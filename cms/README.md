# Payload 4 / Neon CMS integration — draft gate

This PR contains a concrete Payload v4 beta CMS collection schema for site pages, published partner profiles, sourced intelligence notes and a restricted operator verification queue. **It does not swap the current public Next.js app to v4**, which still targets Next 15 and has no Payload runtime.

Confirmed Payload 4 beta compatibility baseline on 2026-11-04: Node >=24.22.1, Next >=16.4.0 and TypeScript >=6.0.3. Use matching `payload`, `@payloadcms/next` and `@payloadcms/db-postgres` beta.6 versions. Upgrading the root app and regenerating lockfiles must be a tested migration, not unreviewed package bump. Official docs: https://payloadcms.com/docs/beta/getting-started/installation.

**Identity:** preserve the existing Better Auth adapter architecture from NYC-MON. Do not provision a competing permanent app user store; install/configure the compatible Better Auth–Payload adapter before exposing the admin, and verify what v4 beta APIs it supports.

**Storage:** CMS editorial collections should use the same dedicated InFraX Neon project but not duplicate the independent `infra` PostGIS evidence schema. Raw source/provider records belong in `infra`, not editorial blocks. Do not publish partner logos, figures or signals until verified and permissioned. Staff-only access in this draft depends on a future authenticated `req.user` integration.

**Not a runnable CMS yet:** no app router mount, generated types, migration execution, Neon project, runtime credentials or integration testing. Those gates are explicitly tracked in the PR and require upstream starter consolidation.
