-- Least-privilege development runtime path to already-granted review summaries.
-- USAGE permits name resolution; it does not grant access to other relations.
BEGIN;
GRANT USAGE ON SCHEMA infra TO infrax_api_development;
COMMIT;
