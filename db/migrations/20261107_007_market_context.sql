-- Additive, internal source context only. Apply to development; no source publication.
BEGIN;
CREATE TABLE infra.market_context_summaries (
 dataset text NOT NULL,
 state text NOT NULL CHECK(state ~ '^[A-Z]{2}$'),
 period text NOT NULL,
 source_record_id uuid NOT NULL REFERENCES infra.source_records(id),
 summary jsonb NOT NULL CHECK(jsonb_typeof(summary)='object'
   AND (summary->'commercial_offer'='false'::jsonb) IS TRUE
   AND (summary->'publication_approved'='false'::jsonb) IS TRUE
   AND (summary->>'dataset'=dataset) IS TRUE
   AND (summary->>'state'=state) IS TRUE
   AND (summary->>'observation_period'=period) IS TRUE),
 imported_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(dataset,state)
);
CREATE INDEX market_context_summaries_state_idx ON infra.market_context_summaries(state,dataset);
REVOKE ALL ON infra.market_context_summaries FROM PUBLIC;
-- Service credential stays server-side. HTTP reads require the trusted CMS admin session.
GRANT SELECT ON infra.market_context_summaries TO infrax_api_development;
COMMIT;
