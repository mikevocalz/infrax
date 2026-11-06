-- API boundary; apply first to InFraX development as infrax_owner.
BEGIN;
DO $$ BEGIN
 IF current_database()<>'infrax' OR current_user<>'infrax_owner' THEN RAISE EXCEPTION 'Wrong migration target'; END IF;
END $$;
CREATE SCHEMA IF NOT EXISTS infra_api;
REVOKE ALL ON SCHEMA infra_api FROM PUBLIC;
ALTER DEFAULT PRIVILEGES FOR ROLE infrax_owner IN SCHEMA infra_api REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;
DO $$ BEGIN
 IF NOT EXISTS(SELECT FROM pg_roles WHERE rolname='infrax_runtime') THEN
  CREATE ROLE infrax_runtime NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS;
 END IF;
END $$;
GRANT USAGE ON SCHEMA infra_api TO infrax_runtime;
GRANT infrax_runtime TO infrax_owner;

CREATE OR REPLACE VIEW infra_api.facilities WITH (security_barrier=true) AS
 SELECT id,canonical_name,locality,state,country,lifecycle FROM infra.facilities WHERE public_discovery_allowed IS TRUE;
CREATE OR REPLACE VIEW infra_api.signals WITH (security_barrier=true) AS
 SELECT m.id,m.headline,m.category,m.geography,m.event_at,m.published_at,m.expires_at,
 s.source_url,s.observed_at,s.retrieved_at,l.provider
 FROM infra.market_signals m JOIN infra.source_records s ON s.id=m.source_record_id
 JOIN infra.source_licenses l ON l.id=s.license_id
 WHERE m.publication_status='published' AND m.reviewed_at<=now() AND m.published_at<=now()
 AND (m.expires_at IS NULL OR m.expires_at>now()) AND l.redistribution_approved IS TRUE
 AND l.reviewed_at<=now() AND l.allowed_usage IN ('attributed_public','licensed_public')
 AND s.source_url LIKE 'https://%';
CREATE OR REPLACE VIEW infra_api.offers WITH (security_barrier=true) AS
 SELECT o.id,o.facility_id,f.canonical_name,f.locality,f.state,o.product,o.critical_it_mw,
 o.delivery_date,o.verified_at,o.expires_at
 FROM infra.capacity_offers o JOIN infra.facilities f ON f.id=o.facility_id
 JOIN infra.field_claims c ON c.id=o.evidence_claim_id AND c.facility_id=o.facility_id
 WHERE f.public_discovery_allowed AND o.status='approved' AND o.disclosure='public'
 AND o.critical_it_mw>0 AND o.verified_at<=now() AND o.expires_at>now()
 AND c.field_key='available_critical_it_mw' AND c.unit='MW_IT' AND c.disclosure='public'
 AND c.verification_status='independently_verified' AND c.verified_at<=now() AND c.valid_until>now()
 AND c.value_json=to_jsonb(o.critical_it_mw)
 AND EXISTS(SELECT 1 FROM infra.claim_evidence e JOIN infra.source_records s ON s.id=e.source_record_id
   JOIN infra.source_licenses l ON l.id=s.license_id WHERE e.claim_id=c.id
   AND e.reviewed_by IS NOT NULL AND e.reviewed_at<=now() AND l.redistribution_approved
   AND l.reviewed_at<=now() AND l.allowed_usage IN ('attributed_public','licensed_public'));
REVOKE ALL ON infra_api.facilities,infra_api.signals,infra_api.offers FROM PUBLIC;
GRANT SELECT ON infra_api.facilities,infra_api.signals,infra_api.offers TO infrax_runtime;

CREATE TABLE IF NOT EXISTS infra_meta.api_idempotency (
 scope text NOT NULL, request_key uuid NOT NULL, payload_hash text NOT NULL,
 result_id uuid NOT NULL, created_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(scope,request_key)
);
REVOKE ALL ON infra_meta.api_idempotency FROM PUBLIC,infrax_runtime;

-- Subject comes ONLY from the server's verified Better Auth session. No browser SQL access.
CREATE OR REPLACE FUNCTION infra_api.list_scenarios(p_subject text,p_org uuid,p_limit integer DEFAULT 25,p_after uuid DEFAULT NULL)
RETURNS TABLE(id uuid,name text,created_at timestamptz)
LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,infra,pg_temp AS $$
BEGIN
 IF p_subject IS NULL OR length(p_subject) NOT BETWEEN 1 AND 128 OR NOT EXISTS(
  SELECT 1 FROM infra.organization_members WHERE organization_id=p_org AND identity_subject=p_subject)
 THEN RAISE EXCEPTION USING ERRCODE='42501',MESSAGE='Organization access denied'; END IF;
 IF p_limit IS NULL OR p_limit NOT BETWEEN 1 AND 100 THEN RAISE EXCEPTION USING ERRCODE='22023',MESSAGE='Invalid page size'; END IF;
 RETURN QUERY SELECT s.id,s.name,s.created_at FROM infra.scenarios s
  WHERE s.organization_id=p_org AND (p_after IS NULL OR s.id>p_after) ORDER BY s.id LIMIT p_limit;
END $$;

CREATE OR REPLACE FUNCTION infra_api.save_scenario(p_subject text,p_org uuid,p_name text,p_requirements jsonb,p_key uuid)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,infra,pg_temp AS $$
DECLARE v_scope text; v_hash text; v_existing infra_meta.api_idempotency%ROWTYPE; v_id uuid;
BEGIN
 IF p_subject IS NULL OR length(p_subject) NOT BETWEEN 1 AND 128 OR NOT EXISTS(
  SELECT 1 FROM infra.organization_members WHERE organization_id=p_org AND identity_subject=p_subject AND member_role IN ('owner','admin','analyst'))
 THEN RAISE EXCEPTION USING ERRCODE='42501',MESSAGE='Scenario write access denied'; END IF;
 IF p_key IS NULL OR p_name IS NULL OR length(btrim(p_name)) NOT BETWEEN 1 AND 160 OR p_requirements IS NULL
 OR jsonb_typeof(p_requirements)<>'object' OR octet_length(p_requirements::text)>16000
 THEN RAISE EXCEPTION USING ERRCODE='22023',MESSAGE='Invalid scenario'; END IF;
 v_scope:='scenario:'||p_org::text||':'||p_subject;
 v_hash:=encode(public.digest(jsonb_build_object('name',btrim(p_name),'requirements',p_requirements)::text,'sha256'),'hex');
 PERFORM pg_advisory_xact_lock(hashtextextended(v_scope||':'||p_key::text,0));
 SELECT * INTO v_existing FROM infra_meta.api_idempotency WHERE scope=v_scope AND request_key=p_key;
 IF FOUND THEN
  IF v_existing.payload_hash<>v_hash THEN RAISE EXCEPTION USING ERRCODE='22023',MESSAGE='Idempotency key reused with different input'; END IF;
  RETURN v_existing.result_id;
 END IF;
 INSERT INTO infra.scenarios(organization_id,created_by,name) VALUES(p_org,p_subject,btrim(p_name)) RETURNING infra.scenarios.id INTO v_id;
 INSERT INTO infra.scenario_versions(scenario_id,version,requirements) VALUES(v_id,1,p_requirements);
 INSERT INTO infra_meta.api_idempotency(scope,request_key,payload_hash,result_id) VALUES(v_scope,p_key,v_hash,v_id);
 RETURN v_id;
END $$;

CREATE OR REPLACE FUNCTION infra_api.submit_intake(p_kind text,p_name text,p_email text,p_company text,p_payload jsonb,p_key uuid)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,infra,pg_temp AS $$
DECLARE v_email text; v_scope text; v_hash text; v_existing infra_meta.api_idempotency%ROWTYPE; v_id uuid;
BEGIN
 IF p_kind IS NULL OR p_kind NOT IN ('developer','investor','operator','advisor') OR p_key IS NULL
 OR p_name IS NULL OR length(btrim(p_name)) NOT BETWEEN 1 AND 150
 OR p_company IS NULL OR length(btrim(p_company)) NOT BETWEEN 1 AND 200
 OR p_email IS NULL OR length(p_email)>254 OR p_email!~'^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
 OR p_payload IS NULL OR jsonb_typeof(p_payload)<>'object' OR octet_length(p_payload::text)>12000
 THEN RAISE EXCEPTION USING ERRCODE='22023',MESSAGE='Invalid inquiry'; END IF;
 v_email:=lower(btrim(p_email)); v_scope:='intake:'||encode(public.digest(v_email,'sha256'),'hex');
 v_hash:=encode(public.digest(jsonb_build_object('kind',p_kind,'name',btrim(p_name),'company',btrim(p_company),'payload',p_payload)::text,'sha256'),'hex');
 PERFORM pg_advisory_xact_lock(hashtextextended(v_scope,0));
 SELECT * INTO v_existing FROM infra_meta.api_idempotency WHERE scope=v_scope AND request_key=p_key;
 IF FOUND THEN
  IF v_existing.payload_hash<>v_hash THEN RAISE EXCEPTION USING ERRCODE='22023',MESSAGE='Idempotency key reused with different input'; END IF;
  RETURN v_existing.result_id;
 END IF;
 IF (SELECT count(*) FROM infra.intake_requests WHERE email=v_email AND created_at>now()-interval '1 hour')>=3
 THEN RAISE EXCEPTION USING ERRCODE='P0001',MESSAGE='INTAKE_RATE_LIMIT'; END IF;
 INSERT INTO infra.intake_requests(request_type,submitter_name,email,organization,payload,consented_at)
 VALUES(p_kind,btrim(p_name),v_email,btrim(p_company),p_payload,now()) RETURNING infra.intake_requests.id INTO v_id;
 INSERT INTO infra_meta.api_idempotency(scope,request_key,payload_hash,result_id) VALUES(v_scope,p_key,v_hash,v_id);
 RETURN v_id;
END $$;
REVOKE ALL ON FUNCTION infra_api.list_scenarios(text,uuid,integer,uuid),infra_api.save_scenario(text,uuid,text,jsonb,uuid),infra_api.submit_intake(text,text,text,text,jsonb,uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION infra_api.list_scenarios(text,uuid,integer,uuid),infra_api.save_scenario(text,uuid,text,jsonb,uuid),infra_api.submit_intake(text,text,text,text,jsonb,uuid) TO infrax_runtime;
COMMIT;
