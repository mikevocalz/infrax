-- InFraX bootstrap security and migration provenance, applied 2026-11-06.
-- Run after 001/002/003 as the dedicated infrax_owner on the infrax database.
-- This creates capability GROUP roles, not application login credentials.
BEGIN;
DO $$ BEGIN
 IF current_database() <> 'infrax' OR current_user <> 'infrax_owner' THEN
  RAISE EXCEPTION 'Wrong database or migration owner for InFraX';
 END IF;
END $$;
CREATE SCHEMA IF NOT EXISTS infra_meta;
CREATE TABLE IF NOT EXISTS infra_meta.schema_migrations (
 migration_id text PRIMARY KEY,
 source_git_blob text NOT NULL,
 applied_at timestamptz NOT NULL DEFAULT now(),
 notes text NOT NULL DEFAULT ''
);
INSERT INTO infra_meta.schema_migrations(migration_id,source_git_blob,notes) VALUES
 ('20261104_001_infra_catalog','b8a1a741c3c22dc435b6b2cb1a1062b1d03e44e0','PR #9; transaction wrappers supplied by migration executor'),
 ('20261104_002_private_workflows','ec4869e0bdc18fa4f1201dbefb0b5787aefd8654','PR #18; transaction wrappers supplied by migration executor'),
 ('20261104_003_intake_outbox','ec0da768c8f6de37bbe0d4f78950f952680b6c0c','PR #19; fresh bootstrap omitted DROP TRIGGER because no trigger existed')
ON CONFLICT(migration_id) DO NOTHING;

REVOKE CREATE ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA infra,infra_meta FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA infra,infra_meta FROM PUBLIC;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA infra,infra_meta FROM PUBLIC;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA infra,infra_meta FROM PUBLIC;
ALTER DEFAULT PRIVILEGES FOR ROLE infrax_owner IN SCHEMA infra,infra_meta REVOKE ALL ON TABLES FROM PUBLIC;
ALTER DEFAULT PRIVILEGES FOR ROLE infrax_owner IN SCHEMA infra,infra_meta REVOKE ALL ON SEQUENCES FROM PUBLIC;
ALTER DEFAULT PRIVILEGES FOR ROLE infrax_owner IN SCHEMA infra,infra_meta REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- The intake role must not acquire permission to forge arbitrary outbox events.
-- A trigger-only function queues the minimal receipt event with fixed search_path.
ALTER FUNCTION infra.queue_intake_receipt() SECURITY DEFINER;
ALTER FUNCTION infra.queue_intake_receipt() SET search_path = pg_catalog, infra;
REVOKE ALL ON FUNCTION infra.queue_intake_receipt() FROM PUBLIC;

DO $$ DECLARE r text; BEGIN
 FOREACH r IN ARRAY ARRAY['infrax_public_reader','infrax_ingest','infrax_intake','infrax_notifications'] LOOP
  IF NOT EXISTS(SELECT 1 FROM pg_roles WHERE rolname=r) THEN
   EXECUTE format('CREATE ROLE %I NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS',r);
  END IF;
 END LOOP;
END $$;
GRANT USAGE ON SCHEMA infra TO infrax_public_reader,infrax_ingest,infrax_intake,infrax_notifications;
GRANT SELECT ON infra.public_facilities TO infrax_public_reader;
GRANT SELECT ON infra.source_licenses TO infrax_ingest;
GRANT SELECT,INSERT ON infra.source_records TO infrax_ingest;
GRANT SELECT,INSERT,UPDATE ON infra.ingestion_runs TO infrax_ingest;
GRANT INSERT ON infra.intake_requests TO infrax_intake;
GRANT SELECT(id,email,created_at) ON infra.intake_requests TO infrax_intake;
REVOKE INSERT ON infra.notification_outbox FROM infrax_intake;
GRANT SELECT ON infra.notification_outbox TO infrax_notifications;
GRANT UPDATE(state,attempts,sent_at,provider_message_id,last_error) ON infra.notification_outbox TO infrax_notifications;
-- The existing migration owner already owns these tables. Membership permits
-- least-privilege smoke tests through SET LOCAL ROLE, not escalation for clients.
GRANT infrax_public_reader,infrax_ingest,infrax_intake,infrax_notifications TO infrax_owner;

CREATE INDEX IF NOT EXISTS infra_intake_email_created_idx ON infra.intake_requests(email,created_at DESC);
CREATE INDEX IF NOT EXISTS infra_scenarios_org_created_idx ON infra.scenarios(organization_id,created_at DESC);
CREATE INDEX IF NOT EXISTS infra_offer_facility_idx ON infra.capacity_offers(facility_id);
CREATE INDEX IF NOT EXISTS infra_claim_facility_field_idx ON infra.field_claims(facility_id,field_key);
COMMIT;
