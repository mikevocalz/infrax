-- Screen workflow storage: private submissions are NEVER public facility/offer inventory.
-- Test on a disposable database first. No production/staging application is authorized.
BEGIN;
CREATE TABLE IF NOT EXISTS infra.workspace_records (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL REFERENCES infra.organizations(id),
 kind text NOT NULL CHECK(kind IN ('projects','tasks','documents','reports','messages','sites','offers','requests','responses','watchlists','notifications','preferences')),
 parent_id uuid REFERENCES infra.workspace_records(id), created_by text NOT NULL,
 data jsonb NOT NULL CHECK(jsonb_typeof(data)='object' AND octet_length(data::text)<=20000),
 status text NOT NULL DEFAULT 'draft', version integer NOT NULL DEFAULT 1 CHECK(version>0),
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS workspace_records_scope_idx ON infra.workspace_records(organization_id,kind,parent_id,id);
REVOKE ALL ON infra.workspace_records FROM PUBLIC,infrax_runtime;

CREATE OR REPLACE FUNCTION infra_meta.workspace_admin(p_subject text) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $$
 SELECT EXISTS(SELECT 1 FROM cms.users WHERE id::text=p_subject AND role::text='admin')
$$;
REVOKE ALL ON FUNCTION infra_meta.workspace_admin(text) FROM PUBLIC,infrax_runtime;

CREATE OR REPLACE FUNCTION infra_api.workspace_orgs(p_subject text)
RETURNS TABLE(id uuid,name text,kind text,role text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $$
 SELECT o.id,o.legal_name,o.kind,m.member_role FROM infra.organizations o
 JOIN infra.organization_members m ON m.organization_id=o.id WHERE m.identity_subject=p_subject ORDER BY o.legal_name,o.id
$$;

CREATE OR REPLACE FUNCTION infra_api.workspace_create_org(p_subject text,p_name text,p_key uuid) RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $$
DECLARE v_id uuid; v_scope text; v_hash text; v_old infra_meta.api_idempotency%ROWTYPE;
BEGIN
 IF p_subject IS NULL OR NOT EXISTS(SELECT 1 FROM cms.users WHERE id::text=p_subject) THEN RAISE EXCEPTION USING ERRCODE='42501',MESSAGE='Session required'; END IF;
 IF p_key IS NULL OR p_name IS NULL OR length(btrim(p_name)) NOT BETWEEN 1 AND 160 THEN RAISE EXCEPTION USING ERRCODE='22023',MESSAGE='Invalid organization'; END IF;
 v_scope:='organization:'||p_subject; v_hash:=encode(public.digest(btrim(p_name),'sha256'),'hex');
 PERFORM pg_advisory_xact_lock(hashtextextended(v_scope,0));
 SELECT * INTO v_old FROM infra_meta.api_idempotency WHERE scope=v_scope AND request_key=p_key;
 IF FOUND THEN IF v_old.payload_hash<>v_hash THEN RAISE EXCEPTION USING ERRCODE='22023',MESSAGE='Changed retry'; END IF; RETURN v_old.result_id; END IF;
 IF (SELECT count(*) FROM infra.organization_members WHERE identity_subject=p_subject AND member_role='owner')>=5 THEN RAISE EXCEPTION USING ERRCODE='42501',MESSAGE='Organization limit'; END IF;
 -- A self-created organization is a buyer, never an operator or internal organization.
 INSERT INTO infra.organizations(legal_name,kind) VALUES(btrim(p_name),'buyer') RETURNING id INTO v_id;
 INSERT INTO infra.organization_members(organization_id,identity_subject,member_role) VALUES(v_id,p_subject,'owner');
 INSERT INTO infra_meta.api_idempotency(scope,request_key,payload_hash,result_id) VALUES(v_scope,p_key,v_hash,v_id);
 RETURN v_id;
END $$;

CREATE OR REPLACE FUNCTION infra_api.workspace_read(p_subject text,p_org uuid,p_kind text,p_id uuid DEFAULT NULL,p_parent uuid DEFAULT NULL,p_after uuid DEFAULT NULL)
RETURNS SETOF jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $$
DECLARE v_admin boolean:=infra_meta.workspace_admin(p_subject);
BEGIN
 IF p_subject IS NULL OR length(p_subject) NOT BETWEEN 1 AND 128 THEN RAISE EXCEPTION USING ERRCODE='42501',MESSAGE='Session required'; END IF;
 IF p_kind IN ('reviews','sources','cases','content') THEN
  IF NOT v_admin THEN RAISE EXCEPTION USING ERRCODE='42501',MESSAGE='Staff required'; END IF;
  IF p_kind='reviews' THEN RETURN QUERY SELECT jsonb_build_object('id',r.id,'organizationId',r.organization_id,'kind',r.kind,'data',r.data,'status',r.status,'version',r.version,'createdAt',r.created_at) FROM infra.workspace_records r WHERE r.kind IN ('sites','offers') AND (p_id IS NULL OR r.id=p_id) AND (p_after IS NULL OR r.id>p_after) ORDER BY r.id LIMIT 51;
  ELSIF p_kind='sources' THEN RETURN QUERY SELECT jsonb_build_object('id',s.id,'name',s.provider,'data',jsonb_build_object('licenseUrl',s.license_url,'usage',s.allowed_usage,'reviewedAt',s.reviewed_at,'redistributionApproved',s.redistribution_approved,'notes',s.review_notes),'status',CASE WHEN s.redistribution_approved THEN 'publication_permitted' ELSE 'internal_review' END) FROM infra.source_licenses s WHERE (p_id IS NULL OR s.id=p_id) AND (p_after IS NULL OR s.id>p_after) ORDER BY s.id LIMIT 51;
  ELSIF p_kind='cases' THEN RETURN QUERY SELECT jsonb_build_object('id',i.id,'name',i.organization,'data',jsonb_build_object('name',i.submitter_name,'email',i.email,'type',i.request_type,'requirements',i.payload),'status',i.status,'createdAt',i.created_at) FROM infra.intake_requests i WHERE (p_id IS NULL OR i.id=p_id) AND (p_after IS NULL OR i.id>p_after) ORDER BY i.id LIMIT 51;
  ELSIF p_kind='content' THEN RETURN QUERY SELECT jsonb_build_object('id',p.id::text,'name',p.title,'data',jsonb_build_object('slug',p.slug,'summary',p.summary),'status',p.publication_status::text) FROM cms.site_pages p ORDER BY p.id LIMIT 51;
  END IF; RETURN;
 END IF;
 IF NOT EXISTS(SELECT 1 FROM infra.organization_members WHERE organization_id=p_org AND identity_subject=p_subject) THEN RAISE EXCEPTION USING ERRCODE='42501',MESSAGE='Organization access denied'; END IF;
 IF p_kind='team' THEN RETURN QUERY SELECT jsonb_build_object('id',m.identity_subject,'name',coalesce(u.name,m.identity_subject),'data',jsonb_build_object('role',m.member_role),'status','member') FROM infra.organization_members m LEFT JOIN cms.users u ON u.id::text=m.identity_subject WHERE m.organization_id=p_org ORDER BY m.identity_subject LIMIT 51; RETURN; END IF;
 IF p_kind='scenarios' THEN RETURN QUERY SELECT jsonb_build_object('id',s.id,'name',s.name,'data',v.requirements,'version',v.version,'status','saved','createdAt',s.created_at) FROM infra.scenarios s JOIN LATERAL (SELECT version,requirements FROM infra.scenario_versions WHERE scenario_id=s.id ORDER BY version DESC LIMIT 1) v ON true WHERE s.organization_id=p_org AND (p_id IS NULL OR s.id=p_id) AND (p_after IS NULL OR s.id>p_after) ORDER BY s.id LIMIT 51; RETURN; END IF;
 IF p_kind NOT IN ('projects','tasks','documents','reports','messages','sites','offers','requests','responses','watchlists','notifications','preferences') THEN RAISE EXCEPTION USING ERRCODE='22023',MESSAGE='Invalid resource'; END IF;
 IF p_kind IN ('sites','offers','requests','responses') AND NOT EXISTS(SELECT 1 FROM infra.organizations WHERE id=p_org AND kind IN ('operator','developer')) THEN RAISE EXCEPTION USING ERRCODE='42501',MESSAGE='Operator organization required'; END IF;
 IF p_parent IS NOT NULL AND NOT EXISTS(SELECT 1 FROM infra.workspace_records WHERE id=p_parent AND organization_id=p_org) THEN RAISE EXCEPTION USING ERRCODE='42501',MESSAGE='Parent not accessible'; END IF;
 RETURN QUERY SELECT jsonb_build_object('id',r.id,'parent',r.parent_id,'name',r.data->>'name','data',r.data,'status',r.status,'version',r.version,'createdAt',r.created_at,'updatedAt',r.updated_at) FROM infra.workspace_records r WHERE r.organization_id=p_org AND r.kind=p_kind AND (p_id IS NULL OR r.id=p_id) AND (p_parent IS NULL OR r.parent_id=p_parent) AND (p_after IS NULL OR r.id>p_after) AND (p_kind NOT IN ('preferences','notifications') OR r.created_by=p_subject) ORDER BY r.id LIMIT 51;
END $$;

CREATE OR REPLACE FUNCTION infra_api.workspace_write(p_subject text,p_org uuid,p_kind text,p_parent uuid,p_id uuid,p_data jsonb,p_version integer,p_key uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $$
DECLARE v_id uuid; v_status text; v_version integer; v_scope text; v_hash text; v_old infra_meta.api_idempotency%ROWTYPE; v_record infra.workspace_records%ROWTYPE;
BEGIN
 IF p_subject IS NULL OR p_key IS NULL OR p_data IS NULL OR jsonb_typeof(p_data)<>'object' OR octet_length(p_data::text)>20000 THEN RAISE EXCEPTION USING ERRCODE='22023',MESSAGE='Invalid write'; END IF;
 IF p_kind='reviews' THEN
  IF NOT infra_meta.workspace_admin(p_subject) THEN RAISE EXCEPTION USING ERRCODE='42501',MESSAGE='Staff required'; END IF;
  SELECT * INTO v_record FROM infra.workspace_records WHERE id=p_id AND kind IN ('sites','offers') FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION USING ERRCODE='42501',MESSAGE='Review not accessible'; END IF;
  p_org:=v_record.organization_id;
 ELSE
  IF NOT EXISTS(SELECT 1 FROM infra.organization_members WHERE organization_id=p_org AND identity_subject=p_subject AND member_role IN ('owner','admin','analyst')) THEN RAISE EXCEPTION USING ERRCODE='42501',MESSAGE='Write membership required'; END IF;
 END IF;
 v_scope:='workspace:'||p_org||':'||p_subject||':'||p_kind;
 v_hash:=encode(public.digest(jsonb_build_object('id',p_id,'parent',p_parent,'version',p_version,'data',p_data)::text,'sha256'),'hex');
 PERFORM pg_advisory_xact_lock(hashtextextended(v_scope||':'||p_key,0));
 SELECT * INTO v_old FROM infra_meta.api_idempotency WHERE scope=v_scope AND request_key=p_key;
 IF FOUND THEN IF v_old.payload_hash<>v_hash THEN RAISE EXCEPTION USING ERRCODE='22023',MESSAGE='Changed retry'; END IF; RETURN jsonb_build_object('id',v_old.result_id,'status','saved','replayed',true); END IF;
 IF p_kind='scenarios' THEN
  IF p_id IS NULL THEN v_id:=infra_api.save_scenario(p_subject,p_org,p_data->>'name',p_data,p_key);v_version:=1;
  ELSE
   PERFORM 1 FROM infra.scenarios WHERE id=p_id AND organization_id=p_org FOR UPDATE;
   IF NOT FOUND THEN RAISE EXCEPTION USING ERRCODE='42501',MESSAGE='Scenario not accessible'; END IF;
   SELECT max(version) INTO v_version FROM infra.scenario_versions WHERE scenario_id=p_id;
   IF p_version IS NULL OR p_version<>v_version THEN RAISE EXCEPTION USING ERRCODE='22023',MESSAGE='Version conflict'; END IF;
   v_id:=p_id;v_version:=v_version+1;
   UPDATE infra.scenarios SET name=p_data->>'name' WHERE id=v_id;
   INSERT INTO infra.scenario_versions(scenario_id,version,requirements) VALUES(v_id,v_version,p_data);
  END IF;v_status:='saved';
 ELSIF p_kind='reviews' THEN
  IF p_version IS NULL OR v_record.version<>p_version OR p_data->>'name' NOT IN ('needs_info','accepted','rejected') THEN RAISE EXCEPTION USING ERRCODE='22023',MESSAGE='Invalid review or version'; END IF;
  v_id:=v_record.id;v_version:=v_record.version+1;v_status:=p_data->>'name';
  -- Acceptance is a workflow decision, NOT commercial-capacity verification/publication.
  UPDATE infra.workspace_records SET status=v_status,version=v_version,updated_at=now(),data=jsonb_set(data,'{review}',p_data||jsonb_build_object('reviewedBy',p_subject,'reviewedAt',now())) WHERE id=v_id;
 ELSE
  IF p_kind NOT IN ('projects','tasks','documents','messages','sites','offers','responses','watchlists','preferences') THEN RAISE EXCEPTION USING ERRCODE='42501',MESSAGE='This resource is read-only'; END IF;
  IF p_kind IN ('sites','offers','responses') AND NOT EXISTS(SELECT 1 FROM infra.organizations WHERE id=p_org AND kind IN ('operator','developer')) THEN RAISE EXCEPTION USING ERRCODE='42501',MESSAGE='Operator organization required'; END IF;
  IF p_parent IS NOT NULL AND NOT EXISTS(SELECT 1 FROM infra.workspace_records WHERE id=p_parent AND organization_id=p_org) THEN RAISE EXCEPTION USING ERRCODE='42501',MESSAGE='Parent not accessible'; END IF;
  IF p_kind IN ('tasks','documents','messages','offers','responses') AND p_parent IS NULL THEN RAISE EXCEPTION USING ERRCODE='22023',MESSAGE='Parent required'; END IF;
  v_status:=CASE WHEN p_kind IN ('sites','offers') THEN 'submitted_private' WHEN p_kind='documents' THEN 'reference_only' ELSE 'saved' END;
  IF p_id IS NULL THEN INSERT INTO infra.workspace_records(organization_id,kind,parent_id,created_by,data,status) VALUES(p_org,p_kind,p_parent,p_subject,p_data,v_status) RETURNING id,version INTO v_id,v_version;
  ELSE
   SELECT * INTO v_record FROM infra.workspace_records WHERE id=p_id AND organization_id=p_org AND kind=p_kind FOR UPDATE;
   IF NOT FOUND THEN RAISE EXCEPTION USING ERRCODE='42501',MESSAGE='Record not accessible'; END IF;
   IF p_version IS NULL OR p_version<>v_record.version THEN RAISE EXCEPTION USING ERRCODE='22023',MESSAGE='Version conflict'; END IF;
   IF p_kind='preferences' AND v_record.created_by<>p_subject THEN RAISE EXCEPTION USING ERRCODE='42501',MESSAGE='Private preferences'; END IF;
   v_id:=p_id;v_version:=v_record.version+1;
   UPDATE infra.workspace_records SET data=p_data,status=v_status,version=v_version,updated_at=now() WHERE id=v_id;
  END IF;
 END IF;
 INSERT INTO infra_meta.api_idempotency(scope,request_key,payload_hash,result_id) VALUES(v_scope,p_key,v_hash,v_id);
 RETURN jsonb_build_object('id',v_id,'status',v_status,'version',v_version,'publicationApproved',false);
END $$;
REVOKE ALL ON FUNCTION infra_api.workspace_orgs(text),infra_api.workspace_create_org(text,text,uuid),infra_api.workspace_read(text,uuid,text,uuid,uuid,uuid),infra_api.workspace_write(text,uuid,text,uuid,uuid,jsonb,integer,uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION infra_api.workspace_orgs(text),infra_api.workspace_create_org(text,text,uuid),infra_api.workspace_read(text,uuid,text,uuid,uuid,uuid),infra_api.workspace_write(text,uuid,text,uuid,uuid,jsonb,integer,uuid) TO infrax_runtime;
COMMIT;
