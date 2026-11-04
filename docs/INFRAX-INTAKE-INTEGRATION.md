# Intake implementation gate

This PR is stacked on Neon data schema PR #9. It changes the legacy Next.js intake from a false local success to a real POST request and durable database receipt. It does not falsely promise a guaranteed analyst response time.

Before merging: provision a **new dedicated InFraX Neon** project, apply PR #9 migration, install/regenerate npm lockfile for `@neondatabase/serverless`, configure server-only `DATABASE_URL`, `INFRAX_PUBLIC_ORIGIN`, privacy/legal wording and a proper abuse-prevention layer. Add notification delivery using a queued, idempotent Resend worker; receiving an HTTP 201 means persistence only, not delivery.

The existing Next website remains legacy code until its NYC-Tron / Starter Pro migration; no new raw HTML controls were authored for the cross-platform app.

Validation tests: `node --test lib/infra/intake-validation.test.mjs`. The route needs deployment integration and endpoint tests before publication.
