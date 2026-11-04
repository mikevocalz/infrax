# InFraX Neon data foundation

Apply `migrations/20261104_001_infra_catalog.sql` to a **dedicated InFraX Neon Postgres project** with PostGIS enabled. This branch only authors the migration; it does not create or mutate a live database. No InFraX Neon project appeared in the connected project listing on 2026-11-04.

No public grants or default open API. Roles/organization membership must be enforced in server code, and confidential `infra.capacity_offers` must never be exposed without per-offer authorization. Before live rollout, add SQL migration execution and rollback tooling, an explicit schema-ownership decision for Payload (CMS content) versus `infra` (evidence/transactional data), and database integration tests.

Run pure data-policy tests: `node --test lib/infra/data-policy.test.mjs`.
