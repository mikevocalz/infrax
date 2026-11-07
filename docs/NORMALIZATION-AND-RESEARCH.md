# Official-source normalization and staff research

This continuation implements read-only, deterministic normalization of selected worksheets in six acquired official packages. It does not certify full source coverage, operator inventory or public commercial capacity.

## Actually processed locally

| Dataset slice | Normalized rows | Observation edition |
|---|---:|---|
| EIA-860 generator worksheets | 36,573 | 2025 |
| EIA-860M status worksheets | 39,908 | September 2026 |
| EIA-861 utility/county reporting | 11,803 | 2025 |
| EIA-923 generation/fuel page 1 | 18,888 | 2025 |
| Berkeley Lab complete queue table, supported US state codes | 36,944 | through 2025 / 2026 edition |
| eGRID plant worksheet | 12,612 | 2023 revision 2 |
| Total selected source rows | 156,728 | Mixed vintages; never label all as 2026 |

All original package hashes were checked. Each normalized record retains dataset, source package hash, source URL, worksheet and row, selected raw field tokens, units, period, data-quality flags and content hash. Repeated normalization reproduced all six output hashes. Checks of all per-record hashes and within-dataset record-key uniqueness passed. Output artifacts are supplied separately rather than adding large datasets to git.

This is **not every schedule in each package**. Non-US/blank-state queue rows and source footers are counted in the exclusion report. EIA-923 has 310 additional rows sharing entity keys and the LBNL slice 104: they remain separate source rows, not silently merged. Missing values and invalid lexical values remain null with raw tokens and flags. Negative net generation can be valid; negative nameplate capacity is invalid. No plant is relabeled a data center.

## Review API and screen

`/account/research` and `/api/v1/research/context?state=TX` use the server's Better Auth session. Only an actual CMS admin can query context; user-supplied role headers and ordinary accounts do not authorize access. Queries are development-only, parameterized, no-store and use the restricted API login, never an owner connection. The account screen links to the research screen only for staff.

The screen is implemented in the actual Next route, with owned semantic host controls and an instance-scoped Zustand store. It distinguishes loading, unauthorized/unavailable and no imported summaries, shows source URLs/checksums and quality gaps, and uses container-fit cards rather than physical-screen dimensions. Full browser/native integration tests must be reported separately; this is not proof that Expo/native shared app assembly is complete.

## Database boundary

Migration `20261107_007_market_context.sql` adds a separate **internal state-summary** relation. It does not modify facilities, capacity offers or published signals. `prepare_summaries.py` prepares 306 state/dataset summary entries from the verified local outputs; it never connects to a database and refuses non-development targets. Applying the migration or import must be independently recorded. **Normalized NDJSON rows are not automatically database-imported by this script.**

Use the source register with internal-only usage and publication disabled until applicable rights and derived-output publication are reviewed. The API summary counts are not counts of available sites or binding utility service.

## Commands

```sh
python -m unittest discover -s scripts/normalization -p 'test_*.py' -v
python scripts/normalization/normalize.py --source-dir /secure/source-pack --output-dir /secure/normalized
python scripts/normalization/prepare_summaries.py --directory /secure/normalized --environment development --output /secure/summary-plan.json
node --test backend/research.test.mjs
```

No runtime database credentials are in these files. No new paid services, production writes, emails, merges or deployments are implied. No subagent execution was available in this Chat session; the implementation was performed directly. Skills consulted: Neon/Postgres branching/permissions and spreadsheet source handling. Automated checks are not CodeRabbit reviews.

## Source acknowledgment

EIA official survey packages retain original publisher notes and units. EPA eGRID2023 revision 2 is not 2026 observations. Berkeley Lab Queued Up data: Lawrence Berkeley National Laboratory and GridTracker, 2026 edition, CC BY 4.0; selected-table normalization is a transformation, not an unchanged original. Preserve source links, this attribution and the original data notes when sharing derived artifacts.
