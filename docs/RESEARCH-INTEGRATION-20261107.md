# Evidence review integration — November 7, 2026

## Completed data slice
Re-ran the existing six-dataset normalizer against the acquired, manifest-verified publisher files: 156,728 normalized rows in local NDJSON artifacts. Imported **306 state/dataset review summaries and their 306 source-evidence records** into Neon development. With the prior EIA price pilot the source table now holds 408 records. This is NOT a claim that all normalized rows were inserted.

All source-license entries remain internal, redistribution disabled. No facility, offer or public market signal was created. Ordered projection fingerprint matches independently computed local output; all 306 database SHA256 evidence checksums pass. Replaying all six summary payloads inserted zero summaries/evidence. Migration 008 exposes an owner-only, immutable, bounded import function; altered existing evidence requires explicit version review rather than silent overwrite.

## Existing integration bug found
The development app role had table SELECT but lacked schema USAGE. Migration 009 grants USAGE on `infra` only, leaving raw source/private inquiry read and DDL/write privileges absent. The database integration test now exercises actual role reads and denied raw-table/DDL/write/import actions, rather than checking table privileges alone.

## Shared transport and actual web screen
`client/research-contract.mjs` and `research-client.mjs` are dependency-free and usable from web or native session adapters. The V2 contract checks dataset/period/entity identity, exact publisher URLs, hashes, quality reconciliation, expected state, duplicate rows and timestamps. The transport bounds responses, distinguishes session/permission/service/validation failures and cancels or ignores obsolete requests. This is not native authentication integration by itself.

The mounted `/account/research` web screen consumes this transport, clears previous-region results immediately, provides real empty/error/access states and exposes source/import dates and both source/output fingerprints. Staff authorization remains server-side. No signed-in ordinary account acquires review access by changing client headers or menus.

## Evidence, not implied readiness
At commit `3ea3f96849332c8dd084c1a1073f93810efc62ae`, the research browser step passed eight layouts (320, 390, 768, 1024, 1440px, emulated book/tabletop and enlarged root text), eight axe scans, state switching, provenance disclosure, malformed response rejection/recovery, empty results, forbidden and signed-out states. Actual anonymous/ordinary-user HTTP checks returned 401/403. Artifact `13563602860` from run `42345899504` was downloaded and inspected: eight layout records, zero reported failures. Auth uses disposable PostgreSQL; research data responses are synthetic and explicitly intercepted. Not a hosted HTTP-to-Neon or native/hardware test.

Additional import-plan and schema-USAGE changes need their own final CI result before merge. No merge, deployment, real staff bootstrap, source publication, email send or staging/production change is authorized by this document.
