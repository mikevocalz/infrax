# Verified InFraX Neon setup — November 6, 2026

## Completed live actions

Created a new, dedicated project named **InFraX** in the connected Moyo Learn Neon organization. Project ID: `spring-glitter-25305067`. No existing app database was reused or changed.

Engine: PostgreSQL **18.6**, AWS **us-east-1**. Database: `infrax`; migration owner: `infrax_owner`. Enabled **PostGIS 3.6.4** and **pgcrypto 1.4**.

Three separate branch/compute environments are ready:

| Environment | Branch | Compute | Autoscaling |
|---|---|---|---|
| Production | `br-dry-tree-bcj5zkai` | `ep-restless-sky-bcs5wyfg` | 0.25–2 CU |
| Staging | `br-empty-smoke-bc899a09` | `ep-raspy-fog-bc1d7jqg` | 0.25–1 CU |
| Development | `br-holy-mode-bcenb3y8` | `ep-proud-resonance-bcwlhuyj` | 0.25–0.5 CU |

Branch lineage is production → staging → development. The isolated bootstrap/test branch was initially named development, validated, then renamed staging. A clean development child was created from its verified, empty schema. The root production schema was applied only after non-production tests passed. The production branch is the default. Connection pooling was enabled for every endpoint; plan-default idle suspension was retained.

## Applied schema and checks

Every environment has **16 application tables**, the `infra.public_facilities` view and a separate `infra_meta.schema_migrations` ledger recording **4 migrations**. The feature schema includes evidence, source records/licenses, facility geography, operator capacity offers, market signals, intake requests, scenarios, watchlists, diligence and atomic outbox events.

Migration provenance:
- 001 evidence catalog: git blob `b8a1a741c3c22dc435b6b2cb1a1062b1d03e44e0` (PR #9).
- 002 private workflows: `ec4869e0bdc18fa4f1201dbefb0b5787aefd8654` (PR #18).
- 003 intake outbox: `ec0da768c8f6de37bbe0d4f78950f952680b6c0c` (PR #19).
- 004 bootstrap privileges/indexes: `d143e0a4f9dfe405106cb53bf7ed2a2dda47bcc2` (this setup).

The fresh initializer supplied transaction wrappers and skipped the unnecessary DROP TRIGGER from 003. The resulting schema was verified, not merely the presence of migration files.

Live SQL assertions passed: PostGIS distance query, private-site filtering from the public projection, zero-MW rejection, restricted offer defaults, source deduplication, unapproved source defaults, unique scenario versions, atomic inquiry/notification insertion, least-privilege inquiry write and denial of private-table reads by the public reader.

Test fixtures were rolled back. Final queries confirmed **zero actual facilities, inquiries and queued/sent notifications** in all environments; no market data or operator inventory was imported. No messages were sent.

Schema comparison results:
- Staging versus production: empty diff.
- Development versus staging: empty diff.

## Safeguards

PUBLIC grants are removed from `infra` and `infra_meta`; creation in the public schema is restricted. Four narrow no-login capability groups are installed (`infrax_public_reader`, `infrax_ingest`, `infrax_intake`, `infrax_notifications`), without superuser or RLS-bypass rights. They are permission templates, not issued runtime passwords. A hardened trigger queues receipt events without giving the intake role permission to insert arbitrary outbox entries.

The schema is not exposed through a browser-facing Data API. Application and tenant authorization remain the server's responsibility. No existing Better Auth provider was replaced and no second auth user store was provisioned. Payload/Better Auth system tables and server runtime integration remain pending.

## Blocked and pending

**Neon production branch protection is blocked by the current Free-plan limit.** The attempted enable returned HTTP 422. No paid upgrade was performed. Current project restore retention: **21,600 seconds / 6 hours**. Do not call this customer-production ready until protection and backup/restore policy are approved and tested.

Still required before the app works against this backend: environment-specific runtime logins and private secret bindings; Payload and Better Auth migrations/integration; app/worker SQL adapters; resource-level permissions; approved source licenses and provider keys; actual backfill/scheduled ingestion; reliable outbox dispatcher; full application and device/browser tests. Public main-branch mock APIs were not replaced by provisioning this project.

No Vercel deployment, code merge, source ingestion, email send or unrelated project change was performed.

## Handoff

`db/neon.environments.json` contains the verified non-secret endpoint mapping. `db/.env.infrax.example` contains blank placeholders only. Preserve the distinct production, staging and development endpoints; do not use the starter reference database or the owner credential in mobile/browser bundles. Application URLs require the `-pooler` host; migration connections use the direct host.
