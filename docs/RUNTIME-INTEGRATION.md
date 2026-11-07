# InFraX runtime integration — verified November 6, 2026

PR #24 continues API #23 in one actual Next application. No merge, hosted deployment, production/staging migration, data-provider import, email send or paid-plan change was performed.

## Implemented and built

- Payload 4.0.0-beta.7 with Next 16.4.3 and the selected `@delmaredigital/payload-better-auth@0.40.0-next.1` / Better Auth 1.7.15 integration.
- `/admin` uses Payload's own layout. Marketing pages move under `(site)` without changing their twelve public URLs; `/api/v1/*` remains intact.
- `/api/auth/*` is mounted through Payload; `/sign-in` and `/account` use actual authentication APIs/server session reads. No replacement identity provider or second password store.
- Account creation never confers staff access. First-user-admin is disabled; role input is ignored/forced to user in auth creation. Normal accounts cannot create privileged users, change their own role, publish editorial content or view operator reviews.
- Public editorial reads expose published records only. Partner publication requires approval evidence and verification date. Research publication requires rights clearance and review.
- Inquiry form now actually calls the durable intake API, requires explicit consent, validates the returned receipt and shows queued—not delivered—notification status. Frozen payload + idempotency key survives in-component retries; double clicks share one request. No personal draft is written to browser localStorage. Cross-refresh draft/receipt persistence remains a separate design task.
- SignalFeed now uses the contract-v2 database endpoint, with distinct loading, empty and unavailable states, real source links and dates. Mock pricing-chart output and the decorative LIVE indicator were removed from this screen. Other legacy demonstration screens are NOT claimed migrated by this PR.
- New feature forms use an owned semantic `/ui` web adapter and instance-scoped Zustand state. This is the **legacy web host integration**, not completion of the NYC-Tron Expo/native shell in Starter Pro #28.

## CI evidence

Code commit `c17c939506b5ada965d00ee65a7788437c01b0d4`:
- Runtime workflow **42294754515**: dependency resolution/install, generated Payload import map/types, migration generation/application to disposable PostgreSQL 18, TypeScript, Next production build and real HTTP authentication tests all succeeded.
- HTTP checks exercised signup, session restoration, signout/reuse of the revoked cookie, rejection of self-promotion and privileged user creation, staff-only review access, published-content filtering and denial of user publication. These are real local HTTP + PostgreSQL checks, not fetch mocks.
- Backend/ingestion/data-policy/CMS policy unit job passed. Separate client workflow **42294754581** passed all 11 client transport/retry tests. External dependencies in unit tests are explicit doubles.
- Generated lockfile, migration SQL/Drizzle snapshot, import map and types were saved by the scoped CI persistence job as commit `1ccb6a21a6af03d364388c18fbcd3b162e4715e6` only after the runtime checks passed. No customer credentials were provided to CI.

## Live Neon DEVELOPMENT only

Target: project `spring-glitter-25305067`, branch `br-holy-mode-bcenb3y8`, database `infrax`.

1. Applied namespace migration `20261106_006_cms_namespace`, source blob `83974c6494815d491c9d98006b3d15196175e3ce`.
2. Created login `infrax_cms_development` with explicit **read_write scope limited to schema cms**, not Neon's default admin role. It has no superuser, neon_superuser membership, RLS bypass, create-database, create-role or schema-CREATE rights, and no `infra` schema access.
3. Applied the generated migration **UP** to the previously empty `cms` schema. Source: `cms/migrations/20261106_211324_initial_auth_editorial.ts`, Git blob `396a0680a6060a4803316ea49111699eb5cab3ec`. The Neon SQL transaction used equivalent loops for repetitive FK/index definitions. No DOWN statements ran. Both the Payload migration tracking row and the infrastructure provenance ledger record the application.
4. Verified the live catalog against the CI-generated snapshot: **25 tables, 159 columns (types/defaults/nullability/primary keys), 86 non-primary indexes, 32 foreign keys and 7 enums**. Sorted structural fingerprints matched in all four categories; see `cms/verification/development-schema.json`. MD5 here is a compact equality check, not a security primitive.
5. Connected as the actual restricted CMS login and tested a temporary normal-user/session write. All fixtures were rolled back using an exception subtransaction. Verified that schema DDL and infrastructure access are denied. Retained users, sessions, accounts and editorial pages: **zero**.

The schema is therefore prepared in real Neon development, while the HTTP runtime was validated against CI's disposable database. **A running application host connected to Neon has not yet been demonstrated.**

## Remaining boundaries

- Bind the separate restricted API/CMS connection strings and independent secrets to the approved development host. None are committed. Do not reuse migration-owner credentials.
- There are no real accounts, approved staff administrator, organization onboarding/invitations or recovery/verification email delivery yet. Public self-signup defaults off. Creating an account does not authorize a company or operator workspace.
- CMS `push` is false. Future migrations need a migration identity/explicit process; the runtime CMS login deliberately cannot perform DDL. Production remains disabled pending protection/restore policy and release approval.
- Complete shared native/tab/rail/drawer mounting, scenario matching/results and other frontend consumers, native/device/browser-accessibility QA and real HTTP-to-Neon end-to-end checks.
- Source keys/licensing, actual market/facility imports, scheduled workers, operator evidence approval and notification dispatch remain unactivated. No fake data or CI identities were copied into Neon.

## Running locally after secure secret binding

Use Node >=24.22.1. Copy the blank `cms/.env.example` into an ignored local environment file and fill it through your secret manager; use the corresponding existing branch hosts and distinct credentials. Install with `npm ci`, then `npm run dev`. Run `npm run typecheck`, `npm run test:client`, and `npm run test:cms`. The committed migration is already recorded on development; do not bootstrap it again or apply it to production without review.
