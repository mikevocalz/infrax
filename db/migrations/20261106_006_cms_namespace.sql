-- Prepare the isolated Payload/Better Auth namespace before generated migrations.
-- Apply as infrax_owner to DEVELOPMENT first. No customer data is copied.
BEGIN;
DO $$ BEGIN
 IF current_database()<>'infrax' OR current_user<>'infrax_owner' THEN
  RAISE EXCEPTION 'Wrong database or migration identity';
 END IF;
 IF EXISTS(SELECT 1 FROM pg_namespace WHERE nspname='cms' AND nspowner<>(SELECT oid FROM pg_roles WHERE rolname='infrax_owner')) THEN
  RAISE EXCEPTION 'Unexpected CMS namespace owner';
 END IF;
END $$;
CREATE SCHEMA IF NOT EXISTS cms AUTHORIZATION infrax_owner;
REVOKE ALL ON SCHEMA cms FROM PUBLIC;
ALTER DEFAULT PRIVILEGES FOR ROLE infrax_owner IN SCHEMA cms REVOKE ALL ON TABLES FROM PUBLIC;
ALTER DEFAULT PRIVILEGES FOR ROLE infrax_owner IN SCHEMA cms REVOKE ALL ON SEQUENCES FROM PUBLIC;
ALTER DEFAULT PRIVILEGES FOR ROLE infrax_owner IN SCHEMA cms REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;
COMMIT;
