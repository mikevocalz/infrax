# InFraX application-to-Neon integration — November 6, 2026

## Live changes, confined to development

Project `spring-glitter-25305067`, database `infrax`, development branch `br-holy-mode-bcenb3y8` only.

Applied `20261106_005_api_boundary.sql` (Git blob `70e22efab3fd627cea69a8fa7f7c2728d4af407e`). Added three redacted API views and organization-authorized scenario/inquiry procedures. Created restricted login `infrax_api_development`, granted `infrax_runtime`; verified no superuser, neon_superuser membership, RLS bypass, database creation or role creation privileges. Runtime login cannot directly read private inquiries or scenarios. No password/credential-bearing connection string is committed.

Production/staging schemas and login credentials were not changed. Development now intentionally has migration 005 ahead of those environments. Production integration is disabled in application configuration. This exact feature branch has Vercel auto-deployment disabled in vercel.json; no deploy action is part of this change.

## Runtime endpoints

| Route | Actual source/behavior |
|---|---|
| GET /api/v1/facilities | Redacted public facility-discovery view, keyset pagination |
| GET /api/v1/assets | Compatibility path to same discovery envelope, not fictitious named assets |
| GET /api/v1/candidates | Publicly disclosed, current offers with matching independently verified MW claim and licensed evidence |
| GET /api/v1/intel/signals | Reviewed/published, unexpired signals whose source redistribution is approved |
| POST /api/v1/intake | Validated, bounded inquiry; idempotent database receipt; existing transaction trigger queues notification |
| GET/POST /api/v1/scenarios | Verified Better Auth subject plus DB membership/role checks; save initial scenario/version atomically |
| GET /api/v1/ready | Restricted database connection readiness; explicitly does not claim whole application readiness |

Responses use contract v2 `{data,status,nextCursor,metadata}` for discovery. Existing clients must be reconciled with this envelope before release. Successful empty data is `empty`; connection failure is `unavailable`/503. POSTs require a UUID `Idempotency-Key`; retry the same key with identical input. Changed input with an old key is rejected. Saving a scenario does not automatically run matching.

`backend/` is an isolated exact-version server dependency package (`@neondatabase/serverless` 1.2.0); root predev/prebuild installs it without install scripts. Existing root dependencies/lockfile are not silently upgraded. The backend lockfile is an authored exact single-package pin; npm install/build execution is a CI gate, not claimed locally. Core request/repository tests have zero external dependencies.

Server configuration requires the exact environment's pooled host, database and restricted runtime role. Database owner credentials, cross-environment URLs, URL options overriding role, disabled TLS and implicit production defaults are rejected. Next route handlers import through `lib/server/infrax.ts`. No database credentials belong in mobile/web bundles.

## Identity boundary — not a completed auth rollout

`backend/identity.mjs` calls the single configured Payload/Better Auth get-session endpoint on the exact application origin. It forwards only the cookie and requires a valid matching user/session with future expiry. It requests database validation, disallows redirects and will not silently discard session refresh cookies. Subject/role supplied in request JSON or headers is never used as identity. Role and membership remain checked in Postgres. Direct browser SQL access to the API credential would defeat this boundary and is forbidden.

The actual Payload/Better Auth service is **not mounted or migrated by this PR**. Until it is available, private endpoints fail closed. Do not create a second identity store merely to make tests pass. Current project main is still on legacy Next 15; Payload 4 integration needs the compatible patched framework and @delmaredigital/payload-better-auth prerelease. Upstream inspected requirements: next >=16.4.1, Node >=24.22.1, better-auth >=1.7.7 and the Payload-4 adapter line. Full dependency-linked migration/identity tests are required before deployment.

## Ingestion connection

Consolidates existing source readers from InFraX #10/#15/#16 into this integration tree, without merging those PRs. `backend/ingestion.mjs` wires EIA reading to real `infra.source_records` inserts and durable `infra.ingestion_runs` success/failure audit. Hash uniqueness makes repeated rows no-ops; counters report actual inserted rows, not attempted duplicates. Missing/empty EIA prices no longer become invented zeros. The monthly period is preserved as a period, not invented as an exact observation instant.

This is a manual bounded job, not an enabled scheduler. Provider key and reviewed nonrestricted source license are required. Raw evidence never auto-publishes a market signal or an operator offer. No real source key was obtained, no license was approved, no source data was imported and no jobs were scheduled in this turn. General job leases, crash recovery/backfill, upstream revision monitoring and remaining provider-specific runtime validation are follow-up gates.

## Verification actually performed

- Local Node v22.16.0: **31 backend unit/HTTP-policy/repository/ingestion tests passed**, zero failed. Session/provider/SQL calls in these tests are explicit fakes; this is not live HTTP end-to-end testing.
- Live development SQL assertions passed: public facility filtering; denial of direct private inquiry/idempotency-table access; cross-organization read denial; viewer write denial; authorized read; atomic scenario+initial version; same-key retries return same receipt; changed input rejected; intake queues exactly one outbox item. Fixtures were rolled back.
- Logged in through Neon as the actual restricted `infrax_api_development` role and confirmed public view reads succeed while direct private table SELECT privileges are absent.
- Development public facilities, published signals and verified offers remain zero. No fake inventory, inquiries, test organizations or notifications were retained.
- Linked Next/Expo/native builds, actual login, HTTP-to-database E2E, user interface wiring and browser/device/accessibility tests are NOT established by those checks. Container DNS prevented fetching dependencies; do not report a local production build.

## Outstanding release gates

Bind runtime credentials to the chosen development host's secret store; integrate patched Payload/Better Auth runtime and generated migrations; bind organization onboarding; reconcile app clients and POST idempotency; remove remaining legacy UI fixtures with the public-trust/scoring workstreams; run all linked builds/E2E; add abuse protection beyond per-email limits; add retention policy for idempotency records; explicitly approve ingestion access/keys; implement outbox dispatcher; address production branch protection/restore policy before customer data.

No code merge, staging/production migration, emails, source publication or paid-plan change is included.

## Primary references inspected

- Neon driver: https://neon.com/docs/serverless/serverless-driver
- Driver source/version: https://github.com/neondatabase/serverless/blob/v1.2.0/package.json
- Better Auth session validation: https://better-auth.com/docs/concepts/session-management
- Payload-4 adapter requirements and session behavior: https://github.com/delmaredigital/payload-better-auth/blob/payload-4/README.md
- Vercel branch deploy guard: https://vercel.com/docs/project-configuration/git-configuration
