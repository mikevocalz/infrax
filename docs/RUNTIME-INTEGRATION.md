# InFraX runtime integration — 2026-11-06

This branch continues API PR #23. It mounts Payload 4 and the existing chosen Better Auth adapter into the same Next application, retaining `/api/v1/*` and the twelve public URLs. Marketing routes move under `(site)` without changing URL paths. `/admin` has Payload's own layout, not the marketing header/footer.

## Identity and isolation
- One Better Auth identity store through Payload, in a separate `cms` Postgres schema. No Neon Managed Auth or competing password store.
- First-user-admin disabled. Users cannot write a privileged role through sign-up, collection create or self-update. Ordinary users are not editorial administrators.
- Public editorial queries filter published records. Operator reviews are staff-only. Secret auth collections retain adapter defaults.
- Server-only CMS login must be `infrax_cms_development` or `infrax_cms_staging` on the corresponding existing InFraX endpoint. Owner credentials and production launch are rejected.
- Payload `push` is disabled. Generated migrations must be reviewed and applied explicitly, never triggered by application startup.
- Signup disabled unless explicitly enabled; production remains gated. Recovery/verification email delivery, first approved staff account and organizational onboarding are separate release requirements.

## Verification process
A disposable PostgreSQL 18 service in CI generates and applies the Payload schema, builds the actual Next application and tests HTTP signup, session restoration, signout, privilege-escalation rejection and public-versus-private content. This service uses synthetic identities under `example.invalid`; it is not the live Neon development database.

After all checks pass, a narrowly scoped CI job may persist only the generated lockfile, migration source, import map and types on this exact integration branch. It refuses an advanced branch and never force-pushes, merges or deploys. No customer credentials are present in that job.

## Status at initial commit
Source implemented; tests not yet run at authoring. Runtime config and generated migration compatibility still need CI verification. No new live Neon schema or credential binding yet. All Git-triggered Vercel deployments disabled on this branch. Do not interpret source files as a verified deployment.
