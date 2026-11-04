# InFraX complete implementation workstreams — 2026-11-04

All linked PRs contain committed code or research, **not production completion**. Do not merge all PRs blindly; some are stacked and cross-repo dependencies are unfinished.

## Web and backend
- [#8](https://github.com/mikevocalz/infrax/pull/8) audit/research
- [#9](https://github.com/mikevocalz/infrax/pull/9) Neon/PostGIS schema, source evidence and disclosure rules
- [#10](https://github.com/mikevocalz/infrax/pull/10) EIA/ERCOT/GeoJSON readers
- [#11](https://github.com/mikevocalz/infrax/pull/11) match eligibility and source-validated scoring
- [#12](https://github.com/mikevocalz/infrax/pull/12) Payload v4 beta editorial/admin collections
- [#13](https://github.com/mikevocalz/infrax/pull/13) real Neon intake, **stacked on #9**
- [#14](https://github.com/mikevocalz/infrax/pull/14) public site truth/CTA and mocked API cleanup
- [#15](https://github.com/mikevocalz/infrax/pull/15) NOAA/USGS/HIFLD/PJM, **stacked on #10**
- [#16](https://github.com/mikevocalz/infrax/pull/16) Neon ingestion writer, **stacked on #15**, requires #9
- [#17](https://github.com/mikevocalz/infrax/pull/17) operator offer verification, **stacked on #9**
- [#18](https://github.com/mikevocalz/infrax/pull/18) private scenarios/watchlists/diligence, **stacked on #9**
- [#19](https://github.com/mikevocalz/infrax/pull/19) Resend outbox, **stacked on #13**
- [#20](https://github.com/mikevocalz/infrax/pull/20) source-only AI assistant, **stacked on #13**

## Shared UI/starter
- NYC-Tron-UI [#1](https://github.com/mikevocalz/NYC-Tron-UI/pull/1) -> [#2](https://github.com/mikevocalz/NYC-Tron-UI/pull/2) -> [#3](https://github.com/mikevocalz/NYC-Tron-UI/pull/3) (InFraX theme/native input)
- Universal Spatial Starter Pro [#21](https://github.com/mikevocalz/universal-spatial-starter-pro/pull/21) shared app slice
- On Pro #21: [#22](https://github.com/mikevocalz/universal-spatial-starter-pro/pull/22) operator form; [#23](https://github.com/mikevocalz/universal-spatial-starter-pro/pull/23) Web Designer Pro/Kinetrell; [#24](https://github.com/mikevocalz/universal-spatial-starter-pro/pull/24) foldable measured layout; [#25](https://github.com/mikevocalz/universal-spatial-starter-pro/pull/25) all 12 route contracts.

## Remaining integration gates before any production claim
1. Merge and package NYC-Tron / full runnable Starter Pro app shell; resolve native platform builds and dependency/lockfile updates.
2. Create **dedicated InFraX Neon project** and run tested migrations. Do not reuse NYC-Mon or Harlem-Might DB.
3. Confirm Payload v4 beta runtime compatibility with Next >=16.4 and compatible Better Auth adapter; mount authenticated CMS/admin.
4. Install provider keys, data licenses, source ingestion schedules and operator approval workflow.
5. Wire working Neon SQL adapters, source review queue, API auth, verified public projections, client saved scenarios and displays.
6. Implement source-backed compare, reports, reliable email dispatch workers and compliant AI query access.
7. Replace all transitional web JSX with shared NYC-Tron components, complete responsive/mobile/hinge/desktop verification, live performance and accessibility tests.
8. Confirm privacy, terms, marketing claims and permitted publication with InFraX leadership.

This is the implementation map, not a claim these integration gates are finished.
