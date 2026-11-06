# InFraX Neon database — provisioned November 6, 2026

The dedicated InFraX Neon project now exists: `spring-glitter-25305067`, database `infrax`, PostgreSQL 18.6, AWS `us-east-1`.

The three environment branches are created, with separate compute endpoints and matching schemas. `neon.environments.json` holds non-secret IDs/hosts and sizing. The application is **not yet connected**; do not confuse an applied database schema with completed UI/API integration.

| Environment | Branch ID | Compute range |
|---|---|---|
| production (default) | br-dry-tree-bcj5zkai | 0.25–2 CU |
| staging | br-empty-smoke-bc899a09 | 0.25–1 CU |
| development | br-holy-mode-bcenb3y8 | 0.25–0.5 CU |

## Applied baseline

16 application tables in `infra`, one redacted `public_facilities` view, and migration tracking in `infra_meta.schema_migrations`. PostGIS 3.6.4 and pgcrypto 1.4 are installed. Migrations 001–004 are recorded in every branch.

The feature schema covers organizations/memberships, source licenses/records, facilities, evidence claims, capacity offers, market signals, intake, ingestion history, saved scenarios/versions, watchlists, diligence cases and the transactional notification outbox.

Migrations 002 and 003 are exact existing source blobs from PRs #18 and #19, consolidated here after the schema base #9. During fresh initialization, BEGIN/COMMIT were supplied by Neon transactions; the no-op DROP TRIGGER in 003 was omitted because there was no previous trigger. The resulting schemas were compared through Neon: staging versus production and development versus staging both returned an empty diff.

## Security and verification

Migration 004 removes PUBLIC access to the application/metadata schemas, public schema creation rights and default PUBLIC function access in the application schemas. It adds four narrow **NOLOGIN capability groups**: public view reader, evidence ingester, inquiry intake and notification dispatch. These are not tenant-authenticated user roles or configured application login credentials. All four are NOSUPERUSER and NOBYPASSRLS. No broad app role or browser-facing Data API was provisioned.

The intake trigger has a fixed search_path and controlled owner execution, so an intake writer does not need direct permission to manufacture outbox events. Organization/resource authorization is still required in the server application. No RLS-based tenant-isolation claim is made by this bootstrap.

Live SQL checks passed on an isolated branch before production initialization: spatial distance query; private facility filtering; invalid zero-MW rejection; restricted/unverified offer defaults; source evidence deduplication; unapproved source defaults; scenario-version uniqueness; atomic inquiry/outbox insertion; least-privilege intake write; public-reader denial for private inquiries and offers. Fixtures were rolled back. Confirmed zero facilities, inquiries, source records and queued notifications after testing.

## Important plan limitation

The connected organization is currently on Free. Enabling production branch protection returned HTTP 422 (plan protected-branch limit). Production is **not protected**. The project reports a six-hour restore window. No plan upgrade, billing change, deletion of another project's protections or change to another application was performed. Customer-data launch should wait for an approved protection/backup strategy and tested restore process.

## Connection and release rules

- Server app traffic uses the environment's pooled host; migrations/administration use its direct host with TLS.
- Obtain credentials through Neon and bind them to the appropriate secret manager. No password, API key or connection URL with credentials has been committed or printed in the setup report.
- The migration owner `infrax_owner` is not an end-user credential. Bind application/service logins to the required capability groups; private workspace writes need explicit server authorization and additional reviewed grants.
- Use development for local/PR changes, staging for integration checks, and production only for approved migrations. Do not reset a branch or clone production customer data into previews without authorization.
- Do not auto-run old migrations just because these PRs merge: inspect the ledger first. Payload and Better Auth should generate their own reviewed migrations against the selected database; the `infra` data schema is not a replacement for their system tables.
- Database readiness does not imply a configured CMS, working sign-in, loaded infrastructure inventory, scheduled ingestion, email delivery or a deployed application. No Vercel deployment was triggered by this setup.

Detailed setup evidence: `../docs/NEON-SETUP-2026-11-06.md`.
