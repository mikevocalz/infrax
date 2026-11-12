-- External intelligence quarantine: licensed facility leads and outage observations.
-- Do not run automatically. Apply on disposable database and dev first after review.
BEGIN;
CREATE TABLE IF NOT EXISTS infra.external_facility_leads (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 license_id uuid NOT NULL REFERENCES infra.source_licenses(id),
 source_record_id uuid REFERENCES infra.source_records(id),
 external_key text NOT NULL,
 name text NOT NULL,
 operator_name text,
 locality text,
 state text,
 country text NOT NULL,
 latitude double precision CHECK(latitude BETWEEN -90 AND 90),
 longitude double precision CHECK(longitude BETWEEN -180 AND 180),
 built_out_mw numeric(14,3) CHECK(built_out_mw >= 0),
 observed_at timestamptz,
 review_status text NOT NULL DEFAULT 'pending' CHECK(review_status IN ('pending','rejected','source_checked')),
 public_discovery_allowed boolean NOT NULL DEFAULT false CHECK(public_discovery_allowed = false),
 created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(license_id,external_key)
);
COMMENT ON COLUMN infra.external_facility_leads.built_out_mw IS 'Reported fully built-out site context; not currently contractable or operator-confirmed MW.';
CREATE TABLE IF NOT EXISTS infra.external_network_incidents (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 license_id uuid NOT NULL REFERENCES infra.source_licenses(id),
 source_record_id uuid REFERENCES infra.source_records(id),
 external_key text NOT NULL,
 event_start timestamptz NOT NULL,
 event_end timestamptz CHECK(event_end IS NULL OR event_end >= event_start),
 countries text[] NOT NULL DEFAULT '{}',
 asns bigint[] NOT NULL DEFAULT '{}',
 event_type text,
 description text,
 review_status text NOT NULL DEFAULT 'pending' CHECK(review_status IN ('pending','rejected','source_checked')),
 facility_outage_confirmed boolean NOT NULL DEFAULT false CHECK(facility_outage_confirmed=false),
 publication_status text NOT NULL DEFAULT 'internal' CHECK(publication_status='internal'),
 created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(license_id,external_key)
);
CREATE INDEX IF NOT EXISTS external_facility_leads_license_idx ON infra.external_facility_leads(license_id,review_status);
CREATE INDEX IF NOT EXISTS external_network_incidents_time_idx ON infra.external_network_incidents(event_start DESC,license_id);
REVOKE ALL ON infra.external_facility_leads,infra.external_network_incidents FROM PUBLIC;
DO $$ BEGIN
 IF EXISTS(SELECT 1 FROM pg_roles WHERE rolname='infrax_runtime') THEN
  REVOKE ALL ON infra.external_facility_leads,infra.external_network_incidents FROM infrax_runtime;
 END IF;
END $$;
COMMIT;
