# Private InFraX workspace

Implements domain authorization gates and a draft Neon migration for saved scenario versions, watchlists and diligence requests. It does NOT create PDF reports, send alerts or publish private cases. Domain code explicitly marks unavailable reports as `not_generated` and keeps unresolved evidence in dossiers.

The caller must integrate Better Auth project/organization permissions, Neon repository methods, auth session refresh and auditing before these commands are exposed as API routes. No public route may allow `organization_id` to be supplied by an untrusted client.

Run `node --test lib/infra/workflows.test.mjs`. This PR stacks on the Neon evidence schema #9. Required app UI components are in Starter Pro #21 and future workspace PRs.
