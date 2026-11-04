-- Private client workspaces — all data accessed only through server auth policies.
BEGIN;
CREATE TABLE IF NOT EXISTS infra.scenarios (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 organization_id uuid NOT NULL REFERENCES infra.organizations(id),
 created_by text NOT NULL,
 name text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS infra.scenario_versions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 scenario_id uuid NOT NULL REFERENCES infra.scenarios(id) ON DELETE CASCADE,
 version integer NOT NULL CHECK(version>=1),
 requirements jsonb NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(scenario_id,version)
);
CREATE TABLE IF NOT EXISTS infra.watchlists (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 organization_id uuid NOT NULL REFERENCES infra.organizations(id),
 subject text NOT NULL,
 signal_id uuid NOT NULL REFERENCES infra.market_signals(id),
 notifications_enabled boolean NOT NULL DEFAULT false,
 created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(organization_id,subject,signal_id)
);
CREATE TABLE IF NOT EXISTS infra.diligence_cases (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 organization_id uuid NOT NULL REFERENCES infra.organizations(id),
 requested_by text NOT NULL,
 facility_id uuid NOT NULL REFERENCES infra.facilities(id),
 notes text,
 status text NOT NULL DEFAULT 'submitted' CHECK(status IN ('submitted','triaged','review','closed')),
 report_status text NOT NULL DEFAULT 'not_generated' CHECK(report_status IN ('not_generated','incomplete','reviewed')),
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS infra_diligence_org_idx ON infra.diligence_cases(organization_id,status,created_at DESC);
COMMIT;