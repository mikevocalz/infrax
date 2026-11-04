# InFraX ingestion operations (worker implementation slice)

This PR provides a database writer and job runner around the source adapters in PRs #10 and #15. Before any live job:

1. Create dedicated InFraX Neon project and apply evidence schema PR #9.
2. Review each provider's license/rights; register the provider explicitly in `infra.source_licenses` with legal/source dates (no auto-license).
3. Configure actual API keys **server-side**, never in mobile or web bundles.
4. Create scheduled deployment jobs only for confirmed refresh cadences and budgets, with idempotent locking, bounded retries and failure alerts.
5. Add the authenticated operator claims/analyst verification workflow: source records are raw, not automatically advertised as facility inventory.
6. Capture ingestion-run timestamps and errors in `infra.ingestion_runs` through an operations adapter and implement an approved publication pipeline before UI uses them.
7. Integrate cron/queue service and provision source backfill; **nothing has been run yet**.

The source reader types and credentials are intentionally injection-based for safe tests. Execute: `node --test lib/ingestion/*.test.mjs`.
