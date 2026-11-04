# InFraX evidence architecture, source research and delivery roadmap — 2026-11-04

> Companion to [the route and component audit](./2026-11-04-product-route-component-audit.md).
> Research-only proposal. No feed access, data licensing, operator availability, contract, market price or engineering test is implied by this document.
> Source links were checked for their publicly documented offering/terms during the November 2026 research review. Recheck licenses and API availability before implementation.

## 1. What InFraX can know—and what it must not assume

A defensible infrastructure intelligence platform needs four distinct kinds of facts:

| Fact layer | Examples | Can public feeds establish this? | UI language |
| --- | --- | --- | --- |
| Market context | Generation, load, public grid conditions, known construction projects, utility territory | Often, at published spatial/temporal resolution | “Reported market signal”, dated and sourced |
| Facility discovery | Site location, owner/operator, site status, publicly announced designed MW | Sometimes; accuracy varies by dataset | “Publicly identified facility”, not a commercial availability offer |
| Feasibility indicators | Grid distance, approximate climate, water/hazard indicators, permitting patterns | Often as incomplete indicators; cannot prove utility service or permitting approval | “Risk indicator / requires site study” |
| Deliverable inventory | Contractable IT load, date-ready MW, binding power rights, cooling, network carriers, commercial terms | Normally **no**; requires operator evidence, licensed inventory and direct due diligence | “Operator-reported offer” or “Verified offer” with verification scope |

Critical caveat: **generation interconnection queue data are not load-serving commitments or proof of facility substation headroom**. The U.S. FERC distinguishes generator interconnection rules from newer large-load matters: https://www.ferc.gov/explainer-interconnection-final-rule and https://www.ferc.gov/cost-transparency-customer-protection.

### Unit discipline

Persist and label **critical IT load (MW)**, **gross facility draw (MW)**, **contracted MW**, **available MW at a point in time**, **secured vs requested interconnect**, **MW expansion potential**, **PUE**, **kW/rack and density**, and **$/kW/month** distinctly. Never multiply an undifferentiated `MW` field into a binding price quote. Enforce unit conversions and source definitions in code and UI.

## 2. Source matrix: practical, permission-aware

| Provider/feed | Real use inside InFraX | Source/method | Limits, caveats and license checks | Priority |
| --- | --- | --- | --- | --- |
| **EIA APIv2** | Electricity market demand, generation, balancing authority context, historic retail rates | https://www.eia.gov/opendata/ and https://www.eia.gov/opendata/documentation.php | API key, registered API usage, published regional/temporal scale; it does **not** show sellable data center inventory or available substation MW | P1 |
| **ERCOT Public API / market data** | Texas grid and public interconnection/market reports | https://www.ercot.com/services/mdt/data-portal and https://www.ercot.com/help/terms/data-portal | Registration and API terms; independently verify feed-level rights and relevant accuracy. Confidential load/customer data are not automatically distributable. Texas 2026 adopted large-load rules recognize protected customer information: https://www.sos.state.tx.us/texreg/archive/October22026/Adopted%20Rules/16.ECONOMIC%20REGULATION.html | **Pilot P1** |
| **PJM Data Miner** | Public PJM market context; visible queue and system indicators where available | https://www.pjm.com/markets-and-operations/etools/data-miner-2.aspx | Data Miner rules state internal-use restrictions and redistribution-license/membership requirements; non-member rate limits. Confirm the exact permission before syndicating values on a public dashboard. https://www.pjm.com/markets-and-operations/etools/data-miner-2/data-availability | P1 when licensing cleared |
| **HIFLD electric transmission lines** | Geographic transmission overlay / regional infrastructure context | https://catalog.data.gov/dataset/electric-power-transmission-lines | Catalog identifies original data last updated **2022-10-24**; do not treat as current headroom, voltage guarantees, transmission rights or permit confirmation | P1 context only |
| **OpenStreetMap** | Approximate facility/geographic discovery, surrounding infrastructure and mapping where tagged | https://www.openstreetmap.org/copyright | ODbL attribution and share-alike obligations; independent facility verification required. Does not establish operator ownership, secured power or inventory. | P1 supplemental |
| **NOAA Climate Data Online API** | Temperature/humidity climate exposure to support cooling *screening*, not design certification | https://www.ncdc.noaa.gov/cdo-web/webservices/v2 | Token required; documented 5 requests/sec and 10,000 requests/day; coverage varies by station and period | P2 |
| **USGS modern Water Data OGC API** | Groundwater/stream/monitoring layers for environmental feasibility context | https://api.waterdata.usgs.gov/docs/ogcapi/ | Station observations not legal water access rights. USGS says legacy WaterServices APIs are scheduled for retirement in early 2027: https://www.usgs.gov/tools/usgs-water-data-apis | P2 |
| **FEMA risk data** | Hazard/risk context for prospective site diligence | https://hazards.fema.gov/nri/ | Coarse hazard models; supplement with site-specific engineering and local authority review | P2 |
| **Uptime Institute Tier Certification** | Validate Tier designation separately from self-described redundancy | https://uptimeinstitute.com/tier-certification/ | “Tier III” claim ≠ independently certified Tier III. Store issuing body, scope, report and date. | P1 |
| **Baxtel** | Potential licensed facility inventory baseline | https://baxtel.com/services/datasets | Commercial data product; request sample, field coverage, terms and rights to embed/derive/publish; do **not** scrape | Evaluate |
| **DC Byte** | Potential licensed global supply/demand datasets and analyst-supported market coverage | https://www.dcbyte.com/ | Commercial product; license redistribution, field use, caching and recency explicitly | Evaluate |
| **Operators / developers / partner submissions** | Authenticated available supply, real MW and timeline, commercial options, private off-market inventory | Structured submission + attestation + evidence documents + analyst review | Contracts, ACLs, expiration, source/verification checks, non-public terms and revocation | **Essential P0–P1** |

**Source methodology principle:** the public data feeds are sufficient to build a genuine **market intelligence and site discovery** experience but insufficient to label a specific asset “available now” for sale/lease. Partner-submitted offers are the commercial foundation.

## 3. Evidence and freshness model

Store source facts and each derived assertion separately, so contradictory reports do not overwrite original evidence.

Suggested tables:

- `organizations` (operator, investor, advisory client, partner, user roles).
- `facilities` (canonical facility/site ID, name, geometry, operator, type, location precision/publication permissions).
- `assets` and `facility_capabilities` (site phase, critical IT MW vs facility MW, PUE, cooling, physical/network redundancy, certifications).
- `power_service_claims` (substation / utility reference, load type, secured/requested/approved, interconnect status, evidence validity).
- `availability_offers` (sellable MW, product, timeline, valid-until, contact/terms, public/private status, verification state).
- `sources` + `source_licenses` (source URL/provider, exact dataset, methods, TOS/allowed use).
- `source_records` (raw immutable payload reference, checksum, fetched_at, published_at, observed_at, API version, license_snapshot).
- `claims` and `claim_evidence` (field, unit, value, assertion type, verification actor/date, expiration, document reference, discrepancy status).
- `market_signals` (derived alert, origin claim(s), region, severity, analytic note, as_of, reviewed status, permission).
- `scenario_requirements`, `scenario_versions`, `score_runs`, `match_explanations` (immutable scoring inputs and model/rules version).
- `diligence_cases`, `case_documents`, `engagements`, `tasks`, `watchlists`, `notification_preferences`.
- `ingestion_runs`, `source_health`, `review_queue`, `audit_log`.

An illustrative claim record:

```json
{
  "facility_id": "internal-id",
  "field": "available_critical_it_mw",
  "value": null,
  "unit": "MW_IT",
  "source_type": "operator_attestation",
  "source_reference": null,
  "observed_at": null,
  "verified_at": null,
  "valid_until": null,
  "verification_status": "unverified",
  "disclosure": "restricted"
}
```

This example intentionally uses `null`; the system must not invent a capacity figure to satisfy a UI schema. In a production record, document identifiers and timestamps are present only when supported by actual evidence.

### Do not conflate

- source freshness with truth;
- source publication date with event occurrence date;
- facility capacity with marketable capacity;
- an electrical transmission line near a site with a feasible service connection;
- a percentage-based `fitScore` with probability of commercial success;
- SOC 2 organizational attestation with a Tier Certified physical facility;
- public documents with data that is licensable for open redistribution.

## 4. Ingestion architecture

```text
EIA / ERCOT / approved PJM / HIFLD / OSM / licensed data / operator portal
    -> isolated connectors (source-specific credentials and terms)
    -> versioned raw evidence store + deduplication/checksum
    -> normalization (unit/geometry/time/organization/site matching)
    -> claim comparison + conflict flags + freshness policy
    -> analyst approvals for sensitive claims
    -> Neon PostgreSQL + PostGIS (canonical, access controlled)
    -> server query APIs (typed, scope filtered, cached appropriately)
    -> Infra-Align scoring + source-backed intelligence + private dashboards
```

Implement **idempotent** upserts keyed by provider/source entity version. Process provider rate-limit responses with backoff. Date-based invalidation should not imply feeds update continuously. Persist original source URLs/license metadata and require a defined cache/redistribution policy before public rendering. Show partial outages rather than silently serving fictitious numbers.

Use webhook or revision-driven ingestion for operator availability; schedule refreshes at provider-permitted frequencies for public feeds; require manual review of conflicting or market-moving claims. A low-level “last ingested” timestamp is **not** a field-level verification timestamp.

## 5. Matching and diligence rules

### Hard gates

- geography within supported service territory and source coverage;
- **critical IT MW** requested and actual *contractable* offer, with required power stage;
- availability date/timeline, project stage and permission to sell/expose;
- cooling type, design density, equipment constraints, redundancy, mandatory regulatory controls;
- network diversity and connectivity prerequisites;
- operator-authorized use of confidential/off-market data;
- non-zero, nonnegative, consistent values (min MW <= max MW, realistic ranges);
- unknown critical mandatory attribute → `requires_diligence`, **not** passing.

### Ranked dimensions only after eligibility

- power deliverability / evidence of service;
- regional suitability, expansion, grid/hazard/permitting risks;
- delivery timeline and documented prerequisites;
- supported cooling and density at required power;
- commercial cost within like-for-like product scope;
- connectivity and contractual constraints;
- optional sustainability preferences.

Every dimension needs a traceable explanation, source document and age. If a high-weight dimension is unverified, show `insufficient evidence` or conditional result rather than a fabricated confidence point estimate.

### Confidence model

Use a transparent rubric first (evidence source authority + attestation + recency + coverage + independent corroboration + contradiction penalties). Only display a confidence **percentage** when tested and calibrated; otherwise use the ordinal vocabulary `high / medium / low / insufficient` with reasons. Do not mix matching quality and evidence confidence.

### Human-in-the-loop stage

An analyst must approve claims of binding deliverability, revenue, permits, commissioning dates or financial feasibility. Reports should distinguish facts, assumptions, risks, requested operator documents, action owners and follow-up deadlines. Clients should be able to open/download cited evidence subject to access rights.

## 6. Platform implementation proposal

- **Web/UI:** retain Next.js App Router; use a single shared typed data client and reusable visual components instead of repeated bespoke widgets.
- **Database:** Neon PostgreSQL with PostGIS, relational claims and access controlled observations. Partition/heavily index spatial and temporal tables where necessary.
- **Authentication:** Better Auth or an existing compatible solution with organization/role and resource-level permissions. Scope all private data by tenant and explicit evidence disclosure rights.
- **Admin/editorial:** Payload v4 for approved content, operator verification workflow and policy-managed publication. Keep its schema independent of public marketing copy.
- **Workers:** dedicated ingestion service/queue; never run expensive harvesting or licensed scraping in request handlers.
- **Storage:** permissioned evidence documents and raw payload storage with immutable checksums and retention schedules.
- **Matching:** separated, pure, deterministic rules engine consuming typed database query results, versioned for auditability.
- **AI assistant:** retrieval over authorized `source_records` and internal reviewed material; cite exact evidence; tool-bounded queries; never substitute model prose for secured operator documents.
- **Observability:** ingestion lag, source errors, false-positive rates, unauthorized read attempts, inquiry delivery and user-visible action completion.

## 7. Proposed engineering PR sequence

| PR / workstream | Scope | Concrete acceptance gate |
| --- | --- | --- |
| **A. Truth and UX safety** | Disable simulated live/verified states, make all demos visibly demos, disable/decorate inert actions honestly, fix legal/contact links, remove fake partner/mandate/report indicators, revise `/solutions` and `/partners` copy | No false “request submitted”, “verified”, “live”, “available” or “active” production claims |
| **B. Intake and workflow delivery** | Role-specific schema, server endpoint, durable inquiry store, verified email/CRM notifications, spam and validation controls, actual result states | Form is traceable end-to-end; failure never presents success; emails sent only on confirmed storage |
| **C. Canonical data and security** | Neon/PostGIS schema, source license registry, typed query layer, organization-level access controls and audit trail | Migrations, integration tests, no cross-tenant/off-market leakage |
| **D. Public ingestion pilot** | EIA + permitted ERCOT + site/geographic public sources with source dates, licensing and normalization | Repeatable idempotent imports; data quality dashboard; zero field invented to pad coverage |
| **E. Operator supply and diligence** | Partner onboarding, facility/availability submission, document upload, attestations, analyst approval, expiration and revocation | Confidential offer visible only to authorized audience; changes audited; expired offers excluded |
| **F. Scenario correctness and application** | All existing flags applied; typed run API, unknown handling, actual inventory, saved/versioned scenarios, compare/diligence actions | Exhaustive tests across hard gates, weights, cost units, stale/unverified statuses and boundary values |
| **G. Intelligence, reports and QA** | Reviewed signals + licensed charts, source citations, subscription/alerts, report generation, responsive/accessibility/audit performance | Every interactive component works with explicit loading/error states; WCAG 2.2 AA evaluation, mobile + keyboard e2e |

### Recommended narrow pilot

Begin with **Texas / Dallas–Fort Worth** as a contained market to test EIA/ERCOT data ingestion and operator inventory submission. A real pilot is successful when an analyst can trace every displayed candidate property to evidence and an enterprise user can submit, save, compare and request review without simulated transactions. Add PJM only after its redistribution requirements are resolved, rather than treating a “public API” as permission to commercialize arbitrary data.

## 8. Technical acceptance test matrix

| Area | Tests / nonnegotiable expected outcomes |
| --- | --- |
| Trust | No public record from `lib/mock-data`; stale/unverified facts explicitly labeled; no fictitious source timestamps |
| Scoring | Requested minimum, maximum, redundancy, Tier, renewable preference, network diversity and off-market policy all affect eligibility/ranking as intended |
| Unknowns | Missing critical deliverable MW does not default to 0, 100% or “pass”; result becomes Not Assessable / Requires Diligence |
| Numeric | Zero/negative/inverted MW bounds rejected; no NaN/Infinity; currency / contract units converted correctly |
| Access | Partner-only inventory and confidential PDFs never accessible from public API/query or unauthorized account |
| Lead flow | Successful request persist+notification and real receipt ID; server/network failures do not display success |
| Intelligence | Real source link, observed/published/retrieved timestamps, licensed attribution; feed outage shows degraded state |
| UI | Header/footer/contact links valid, every action wired; keyboard/screen-reader/mobile 320px+, reduced-motion tested |
| Reports | Authenticated, generated from stored evidence, versioned and permissions checked; “demo report” never mixed with actual clients |
| AI | No unauthorized record disclosure, no hallucinated availability, citations trace to accessible evidence and source data |
| Ops | Ingestion retries/backoff, source changes, conflicts, audit logging, monitoring, manual review controls |

## 9. Key references

- U.S. EIA Open Data: https://www.eia.gov/opendata/
- EIA APIv2 documentation (updates noted through March 2026): https://www.eia.gov/opendata/documentation.php
- ERCOT Public API Explorer: https://www.ercot.com/services/mdt/data-portal
- ERCOT API terms: https://www.ercot.com/help/terms/data-portal
- Texas adopted large-load rules (effective Oct. 8, 2026): https://www.sos.state.tx.us/texreg/archive/October22026/Adopted%20Rules/16.ECONOMIC%20REGULATION.html
- PJM Data Miner and reuse limits: https://www.pjm.com/markets-and-operations/etools/data-miner-2.aspx
- FERC large-load interconnection update: https://www.ferc.gov/cost-transparency-customer-protection
- HIFLD transmission lines catalog: https://catalog.data.gov/dataset/electric-power-transmission-lines
- OSM ODbL: https://www.openstreetmap.org/copyright
- NOAA CDO API: https://www.ncdc.noaa.gov/cdo-web/webservices/v2
- USGS Water Data modern APIs: https://www.usgs.gov/tools/usgs-water-data-apis
- Uptime Tier Certification: https://uptimeinstitute.com/tier-certification/
- Baxtel data product: https://baxtel.com/services/datasets
- DC Byte market intelligence: https://www.dcbyte.com/
- W3C WCAG 2.2: https://www.w3.org/TR/WCAG22/

## Founder/legal/product decisions still required

1. Canonical InfraAlign™ spelling and trademark status.
2. Exact service model and approved differentiation/compensation claims.
3. Client-facing physical address, phone, email, social destinations and privacy/data retention terms.
4. Whether public unauthenticated users get a **clearly labeled demo** or a limited verified read-only preview.
5. Which operator data can be surfaced publicly, disclosed only to qualified buyers, or held solely for analysts.
6. Commercial dataset licensing, resale/derived-output rights and dataset refresh terms.
7. Initial market(s), operator partners, real inquiry SLAs and who confirms evidence in operations.

No choice above is silently assumed by this research PR.
