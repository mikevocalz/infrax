-- InFraX data plane. Apply with a dedicated migration role to a new Neon project.
-- No public grants: API access must be server-side and organization scoped.
BEGIN;
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE SCHEMA IF NOT EXISTS infra;
CREATE TABLE IF NOT EXISTS infra.organizations (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 legal_name text NOT NULL,
 kind text NOT NULL CHECK(kind IN ('operator','developer','buyer','investor','advisor','public_agency','internal')),
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS infra.organization_members (
 organization_id uuid NOT NULL REFERENCES infra.organizations(id) ON DELETE CASCADE,
 identity_subject text NOT NULL,
 member_role text NOT NULL CHECK(member_role IN ('owner','admin','analyst','viewer')),
 PRIMARY KEY (organization_id,identity_subject)
);
CREATE TABLE IF NOT EXISTS infra.source_licenses (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 provider text NOT NULL UNIQUE,
 license_url text NOT NULL,
 allowed_usage text NOT NULL CHECK(allowed_usage IN ('internal','attributed_public','licensed_public','restricted')),
 redistribution_approved boolean NOT NULL DEFAULT false,
 reviewed_at timestamptz,
 review_notes text
);
CREATE TABLE IF NOT EXISTS infra.source_records (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 license_id uuid NOT NULL REFERENCES infra.source_licenses(id),
 external_key text NOT NULL,
 source_url text NOT NULL,
 source_version text NOT NULL DEFAULT '',
 content_sha256 text NOT NULL CHECK(content_sha256 ~ '^[a-f0-9]{64}$'),
 observed_at timestamptz,
 published_at timestamptz,
 retrieved_at timestamptz NOT NULL DEFAULT now(),
 raw_payload jsonb NOT NULL,
 UNIQUE (license_id,external_key,content_sha256)
);
CREATE TABLE IF NOT EXISTS infra.facilities (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 canonical_name text NOT NULL,
 operator_id uuid REFERENCES infra.organizations(id),
 external_reference text UNIQUE,
 location geography(Point,4326),
 location_precision text NOT NULL DEFAULT 'unknown' CHECK(location_precision IN ('precise','approximate','region_only','unknown')),
 locality text,
 state text,
 country text NOT NULL DEFAULT 'US',
 lifecycle text NOT NULL DEFAULT 'unknown' CHECK(lifecycle IN ('operational','planned','under_construction','retired','unknown')),
 public_discovery_allowed boolean NOT NULL DEFAULT false,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS infra_facility_geo_idx ON infra.facilities USING gist(location);
CREATE INDEX IF NOT EXISTS infra_facility_region_idx ON infra.facilities(state, lifecycle);
CREATE TABLE IF NOT EXISTS infra.field_claims (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 facility_id uuid NOT NULL REFERENCES infra.facilities(id) ON DELETE CASCADE,
 field_key text NOT NULL,
 value_json jsonb,
 unit text,
 reported_by uuid REFERENCES infra.organizations(id),
 verification_status text NOT NULL DEFAULT 'unverified'
  CHECK (verification_status IN ('unverified','publicly_reported','operator_attested','independently_verified','disputed','expired')),
 disclosure text NOT NULL DEFAULT 'restricted' CHECK(disclosure IN ('public','qualified_buyers','internal','restricted')),
 observed_at timestamptz,
 verified_at timestamptz,
 valid_until timestamptz,
 created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(facility_id,field_key,reported_by,observed_at)
);
CREATE TABLE IF NOT EXISTS infra.claim_evidence (
 claim_id uuid NOT NULL REFERENCES infra.field_claims(id) ON DELETE CASCADE,
 source_record_id uuid NOT NULL REFERENCES infra.source_records(id),
 reviewed_by text,
 reviewed_at timestamptz,
 PRIMARY KEY (claim_id,source_record_id)
);
CREATE TABLE IF NOT EXISTS infra.capacity_offers (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 facility_id uuid NOT NULL REFERENCES infra.facilities(id),
 operator_id uuid NOT NULL REFERENCES infra.organizations(id),
 critical_it_mw numeric(12,3) CHECK(critical_it_mw > 0),
 facility_draw_mw numeric(12,3) CHECK(facility_draw_mw > 0),
 product text NOT NULL,
 delivery_date date,
 price_per_kw_month numeric(14,4) CHECK(price_per_kw_month >= 0),
 currency text NOT NULL DEFAULT 'USD' CHECK(length(currency)=3),
 status text NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','submitted','under_review','approved','withdrawn','expired')),
 disclosure text NOT NULL DEFAULT 'restricted' CHECK(disclosure IN ('public','qualified_buyers','internal','restricted')),
 evidence_claim_id uuid REFERENCES infra.field_claims(id),
 attested_at timestamptz,
 verified_at timestamptz,
 expires_at timestamptz,
 updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS infra_active_offers_idx ON infra.capacity_offers(status,expires_at,delivery_date);
CREATE TABLE IF NOT EXISTS infra.market_signals (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 source_record_id uuid NOT NULL REFERENCES infra.source_records(id),
 headline text NOT NULL,
 category text NOT NULL CHECK(category IN ('grid','policy','capacity','pricing','supply','demand')),
 geography text,
 event_at timestamptz,
 reviewed_at timestamptz,
 published_at timestamptz,
 publication_status text NOT NULL DEFAULT 'draft' CHECK(publication_status IN ('draft','reviewed','published','retracted')),
 expires_at timestamptz
);
CREATE TABLE IF NOT EXISTS infra.intake_requests (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 request_type text NOT NULL CHECK(request_type IN ('developer','investor','operator','advisor')),
 submitter_name text NOT NULL,
 email text NOT NULL,
 organization text NOT NULL,
 payload jsonb NOT NULL,
 status text NOT NULL DEFAULT 'received' CHECK(status IN ('received','triaged','in_progress','closed')),
 consented_at timestamptz NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS infra.ingestion_runs (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 provider text NOT NULL,
 started_at timestamptz NOT NULL DEFAULT now(),
 finished_at timestamptz,
 result text CHECK(result IN ('succeeded','partial','failed')),
 imported integer NOT NULL DEFAULT 0 CHECK(imported >= 0),
 rejected integer NOT NULL DEFAULT 0 CHECK(rejected >= 0),
 error_text text
);
CREATE INDEX IF NOT EXISTS infra_source_records_latest_idx ON infra.source_records(license_id,retrieved_at DESC);
-- PUBLIC VIEWS deliberately expose no capacity_offer or private claim data.
CREATE OR REPLACE VIEW infra.public_facilities AS
 SELECT id,canonical_name,locality,state,country,lifecycle
 FROM infra.facilities WHERE public_discovery_allowed IS TRUE;
COMMIT;