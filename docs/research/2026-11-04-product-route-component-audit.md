# InFraX product, route, and component audit — 2026-11-04

> Research-only audit of `mikevocalz/infrax` at `main` commit `bce60ae9d58a8041a58ed018efbb829c6c186cd3`.
> This audit examines repository source and authoritative external documentation. It is **not** a tested production deployment or a live-site accessibility/security certification. The previously shared Vercel preview could not be independently inspected in a browser during this review. No database, data feed, or front-end component was modified by this document.
> Scope: 12 public page routes, API routes, shared and page-specific components, navigation, user journeys, content trust, and production requirements.

## Executive product decision

**InFraX should be an evidence-backed infrastructure decision and advisory platform, not an unsourced facility directory or a generic cybersecurity services site.**

The product is made of three clearly separated layers:

1. **Public institutional site** — explain who InfraX serves, how the firm operates, what the platform does, and how to engage.
2. **Infra-Align™ application** — enter requirements, discover and evaluate eligible assets, compare feasibility and evidence, request diligence, save work and monitor decisions. Only use inventory whose status is explicit.
3. **Partner/analyst operations** — onboard operators, ingest public/licensed sources, collect attestations, validate field-level claims, manage confidential opportunities, and track engagements.

Never imply that platform software automatically proves availability, power rights, construction readiness, or financial feasibility. Each case must distinguish public indications from operator-verified commitments.

## 1. Information architecture and navigation

Current site has **12 public App Router pages**, while `constants.tsx NAV_ITEMS` contains **7 navigation destinations**. Some useful pages are orphaned from the primary navigation, while other routes overlap or contain off-topic copy. The ideal main navigation is **Platform, Solutions, Intelligence, How We Work, Company, Contact**, with a single contextual **Request Assessment** action; the logo returns Home. Use a company/solutions menu to avoid an overloaded 12-item desktop header. Provide separate authenticated workspace navigation later.

| Current route | Keep/merge/replace | Canonical page purpose and changes | Priority |
| --- | --- | --- | --- |
| `/` | **Keep; rework** | State the unique value in one sentence; distinguish advisory from software; audience-specific journeys; credible sourcing; one primary assessment CTA and one platform exploration CTA. The mini scenario form currently loses MW/region/timeline because it links to `/platform` without passing values. Eliminate the unsourced “7 live candidates”, hardcoded numeric scores and unverified ticker counts. | P0 |
| `/services` | **Consolidate as What We Do** | Keep the three useful pillars (matching, impartial advisory, execution), but explain deliverables, responsibility boundaries, and who provides each service. “Explore Pillar” buttons have no action. Keep old route as redirect if URL changes. | P1 |
| `/solutions` | **Rewrite completely** | Current content advertises SOC monitoring, HIPAA-compliant SOC services, real-time fraud detection, and zero-trust defense. That is a cybersecurity product mismatch. Replace with infrastructure use cases: AI enterprise/hyperscale buyer, developer/operator, investor, public sector. Avoid guaranteeing certifications, availability, or outcomes. “View Full Roadmap” buttons do nothing. | **P0** |
| `/platform` | **Keep; distinguish demo vs product** | Explain and show the Infra-Align workflow. The current `ScenarioBuilder` runs only on locally defined mock candidates; no save, versioning, real inventory, or source evidence. Label demo clearly until backed by approved data. Support explicit loading, error, empty and restricted-results states. | **P0** |
| `/intelligence` | **Keep; build actual feed** | Feed requires source URLs, data type, publication/observation/retrieval dates, geographic scope, validation and licensing status. Current `SignalFeed` and `TrendChart` read fixed data. “Watch Signal” and “Run Infra-Align” actions are inert. | **P0** |
| `/metrics` | **Keep as educational resource** | Explain the meaning, unit, source, limitations and business significance of PUE, IT load vs facility MW, interconnection, effective availability, cooling, redundancy, latency, risk and CapEx. Existing cards are abstract headings, not inspectable metrics. No fake company KPIs. Consider eventual `/resources/metrics`. | P1 |
| `/why-infrax` | **Merge or make concise** | Keep defensible differentiation, independence and review methodology; avoid repeating Services and About. Business model claims such as “no placement fees” require founder confirmation. | P1 |
| `/about` | **Keep; verify** | Use approved actual leadership names, accurate titles and approved biographies. Current LinkedIn and email icon buttons have no action. Do not surface the unrelated illustrative leadership array in `lib/mock-data.ts`. Add accessible real contact links and governance statement. | P0 |
| `/partners` | **Rewrite completely** | Current partner copy refers to SOC products, strategic resellers and “Tier 1 Provider 1…8” placeholders with “VERIFIED_INFRAX_NODE”. Replace with actual operator/developer/supplier onboarding, operator-submitted availability, attestation, privacy and review requirements. Remove fabricated logos/status, connect all CTAs to real routes. | **P0** |
| `/capital` | **Separate public service from private reports** | Explain investor diligence and methodology publicly. The interactive dossier currently displays hardcoded `DILIGENCE_REPORTS`, “Assets Under Review”, and an unsupported cycle metric. Move actual due-diligence reports to authenticated, access-controlled engagement workspaces; use a clearly marked example only if needed. | **P0** |
| `/execution` | **Separate process from private mandate status** | Public page should show lifecycle stages and deliverables as a generic methodology. Current “Active Phase” and completed tasks come from `MANDATE_PHASES` sample data, giving the impression of a real engagement. Actual mandates belong in private workspaces. | **P0** |
| `/contact` | **Implement real submissions** | `IntakeFlow` branches by four personas but only calls `setSubmitted(true)`. It never sends a request. Build a validated, rate-limited server-side submission endpoint, durable persistence, email/CRM notification and actual confirmed receipt. Do not promise response in one business day until operations approve an SLA. | **P0** |

### Content gaps without needless page sprawl

- **Energy & sustainability:** add source-aware feasibility content and workload-specific cooling guidance inside relevant solutions/resources; create a standalone page only if the firm can maintain it.
- **Public sector:** present as one genuinely differentiated audience solution, not generic SOC marketing.
- **Marketplace:** do **not** advertise public tradable capacity until verified operator listings exist. The genuine product is a restricted, source-aware sourcing workspace.
- **AI security:** position as a diligence/risk dimension of physical infrastructure rather than a parallel MDR/SOC platform.
- **Leadership/case studies:** use only approved people and real, permissioned case studies. Avoid fictitious company logos and unverifiable numerical outcomes.

## 2. User journeys that every page must support

| Persona | Entry | Meaningful next steps | Success criterion |
| --- | --- | --- | --- |
| Enterprise AI / HPC buyer | Home, Solutions | Enter minimum critical IT MW, geography, ready date, density, cooling, redundancy and certifications → evidence-based candidate shortlist → compare → request verification → contact/mandate | A qualified request with preserved criteria and auditable evidence |
| Data center operator / developer | Partners | Submit company/site → upload verification docs → internal review → approve visibility and confidentiality → match to demand | Approved inventory with explicit authorized disclosure |
| Capital investor | Capital, Solutions | Select geography/asset or submit prospect → request diligence → risk and provenance review → engagement | A source-linked feasibility dossier and acknowledged review request |
| Public agency | Solutions/Public Sector | Explain policy and procurement context → request planning engagement | Real reviewed intake; no implied regulatory certification |
| Internal analyst | Admin/Operations (new) | Review ingestion warnings, conflicting source values, operator documents, claims and approvals → publish/expire updates | Traceable changes, audit trail, no unsupported “Verified” labels |
| Returning authenticated buyer | Workspace (new) | Reopen scenarios, saved candidates, watchlists, decisions, reports and mandates | Persisted, access-controlled state |

### Canonical application navigation once backed by data

`Overview → New Scenario → Matches / Compare → Diligence → Watchlist & Alerts → Reports → Engagements`

Use one intake model with persona-specific required fields and consistent data validation. Do not create a second unconnected “mini” form on the homepage.

## 3. Component and interaction audit

| Component/module | Actual observation | Required behavior |
| --- | --- | --- |
| `Header` | 7 top-level links for 12 routes; tiny text; full-screen mobile menu; hardcoded contact labels | Navigation groups and semantic labels, 44px target aim, active/focus states, scroll restoration and proper mobile body-lock cleanup |
| `Footer` | Social icons are decorative, legal/privacy text is not linked, telephone and email details not validated; 2025 static copyright | Link only real social/contact destinations, publish legal/privacy pages before collecting leads, dynamic copyright |
| `GlobalCTA` | Repeated on nearly all pages, calls the model “InFraAlign™” | One approved canonical name; change CTA by buyer/partner/investor context; reduce repetitive full-screen banners |
| `HomePage` / mini scenario widget | Inputs discarded on navigation; 7 “live” mock candidates; hardcoded scores/ticker | Persist draft into `/platform`, confirm/demo status, avoid false verified counts |
| `ScenarioBuilder` | Local client state, local `runScoring`, no persistence, no external fetch | Server endpoint with source-verified candidates, schema validation, account-scoped saved scenarios, loading/empty/error, mobile form/results parity |
| `CandidateCard` | Opens selected candidate and represents mock candidate as meaningful result | Supply/site status, evidence, hard-constraint flags, timestamp, unit/availability semantics, actionable details |
| `ScoreBreakdown` | Displays weighted dimensions, data confidence from samples, cost estimate; “Save Candidate” and “Request Diligence” no handlers | Accessible, explainable calculations; real save and diligence actions; show unknown/uncertainty, distinguish normalized IT MW, facility MW, priced product |
| `SignalFeed` | Static `SIGNALS`; “Watch Signal” and “Run Infra-Align” no handlers | Validated feed, linked source records, watchlist creation, transfer selected signal context to scenario |
| `TrendChart` | `PRICING_TREND` hardcoded 7 months of dollar figures | Real licensed/qualified series with dates, sample size, unit, method, missing-data states; otherwise remove pricing claims |
| `IntakeFlow` | Confirmation is only `setSubmitted(true)`; backend never called | POST, server-side validation, spam control, privacy notice, persisted request, real notification and idempotent confirmation |
| `ChatBot` + `services/gemini.ts` | Proper server proxy exists, but generation is ungrounded; UI claims “Signal Live”; no citations | Retrieval-grounded, permission-filtered evidence, explicit source links and as-of dates, no invented inventory, rate limits, consent-safe logging |
| `app/api/v1/chat` | Server-side model key, but no evidenced rate limits/auth/structured bounds; fallback returns HTTP 200 for outages | Schema bounds, abuse limits, structured errors, grounding, redaction and safe fail states |
| `app/api/v1/assets` / `candidates` / `intel/signals` | Return hardcoded arrays; endpoint existence does not mean live data | DB-backed read endpoints, access policy and data-status metadata; demo fixtures never returned as production |
| `app/api/v1/health` | Always says `ok` with timestamp | Separate basic process liveness from readiness of database, ingestion, and dependent services |
| `StatusBadge` | Colors/status text derived from arbitrary strings, including “available” and “operational” | Canonical evidence status vocabulary, text + icon + color, never label unconfirmed supply “available” |
| `ScoreBar` | Blindly renders any input number, no semantic accessible representation | Clamp/validate to [0,100], convey score to assistive tech, distinguish fit from evidence confidence |
| `EmptyState` | Generic but usable | Specific unverified, no-match, no-source, no-permission, loading-error states and real action |
| `Error` / `NotFound` | Styled routes exist; error text claims team was notified without error reporting evidence | Honest error copy, retry/fallback, monitoring with consent and redaction |
| `DataMap`, `ArchitectureBlueprint`, `Hero`, `Services`, `Stats` | Search found no imports by active routes; appear to be legacy components | Confirm ownership; delete obsolete duplicates or formally integrate only where the component fills a real need |
| `constants.tsx` | Houses unsourced ticker figures and security-related presentation copy | Move site copy into reviewed content configuration; dated sources in the data layer, not constants |
| `lib/mock-data.ts` | Seven facility records, signal feed, chart prices, task statuses, dossiers and illustrative leaders | Restrict to explicit demo/storybook/test fixtures, never production business output |
| `lib/scoring.ts` | Actual weighted scoring built on mock data; not all user-input flags are applied | Implement complete validated constraints, data quality, confidence methodology, versioning and tests |

## 4. Specific matching-engine correctness defects

The UI gathers `powerMaxMW`, `redundancy`, `preferredTier`, `renewableEnergyPreferred`, `networkDiversityRequired` and `offMarketOk`, yet `lib/scoring.ts` does **not** use these input fields in the candidate assessment (except their presence in the default requirement). `checkHardConstraints` uses minimum MW, geography, timeline, selected certifications and cooling only.

Additionally:
- `runScoring` always iterates seven static records. No operator-provided availability is checked.
- The scoring logic does not reject an asset purely for `status: committed`, `status: development` or `status: limited`.
- It uses a hardcoded market reference price of **$138/kW/month**, not a dated sourced market index. Estimated cost is `costPerKwMonth * powerMinMW * 1000`, with no distinction between IT load, facility power, contracted product, PUE or term.
- The stored `dataConfidence` is a manually assigned number; confidence is not derived from evidence coverage, age, source type or contradictions.
- Several numeric inputs allow values that would lead to misleading scoring (e.g. zero minimum MW → division by zero). Validate invariants on both sides of API.
- Hard-fail and unknown are different. A missing power attestation should be `unknown / requires diligence`, not “pass”.
- Avoid projecting a ranked fit score as certainty that an asset is commercially available.

### Proposed output taxonomy

`Fit: Strong / Conditional / Disqualified / Not Assessable` is distinct from `Evidence: Verified / Operator-Reported / Publicly Reported / Estimated / Unavailable`. Show effective date, last verification date, and source. “Verified” must name **what** was verified and **by whom**, not endorse the entire facility.

## 5. Interaction and design standards

- High information density should come from smart hierarchy, progressive disclosure and saved comparisons—not 9px uppercase text. Audit contrast, keyboard order, focus, target sizes, semantics, dialogs, form error announcements, motion preferences and touch behavior against WCAG 2.2 AA: https://www.w3.org/TR/WCAG22/.
- Use meaningful enterprise UI primitives: evidence chips, status timeline, match comparison table, map with provenance-aware layers, source inspection drawer, verified-claim table, inquiry composer, saved filters, review queue.
- Rename/canonicalize InfraAlign™ vs Infra-Align™ vs InFraAlign™ after owner approval. Use consistent words for `facility`, `site`, `candidate`, `capacity offer`, `mandate` and `diligence`.
- Make “Live” a computed operational data freshness status, not a decorative blinking badge.
- Use real imagery/diagrams, map visuals and facility plans when permissioned. Generic stock photos should not imply depiction of actual listed sites or verified infrastructure.
- Add `loading`, `empty`, `unverified`, `stale`, `partial feed outage`, `restricted access`, `success` and `error` states for every data-backed UI; no dead buttons.
- Validate 320–430px mobile, tablet, desktop and keyboard workflows; platform viewport code currently relies on a full-height panel with nested scroll areas.
- Audit metadata, canonical URLs, sitemap, structured data, image performance, privacy/cookie notices and indexing rules for private/app routes.
- Bring the README into sync with Next.js App Router; it currently describes an AI Studio app and legacy configuration.

## 6. Trust and privacy blockers

- Unverified marketing counts are hardcoded in `TICKER_SIGNALS` and the homepage.
- `/partners` renders eight fake “Tier 1 Provider” cards. Do not imply named/verified commercial relationships without approval.
- `/capital` renders sample diligence dossiers as though they belong to current assets.
- `/execution` displays sample completed/active engagement stages publicly.
- `/solutions` asserts security/compliance capabilities outside the primary infra-decision product.
- Footer legal and privacy links are not functional while intake collects business contact data.
- Contact responses are simulated without data transmission; current copy falsely promises the submission was logged.
- Confidential operator inventory must not be published through open API routes; require disclosure policy, per-party authorization, audit trail and retention controls.

## 7. Priorities and definition of done

**P0 — Launch trust gate:** truthful demo/production separation, working intake, off-topic page cleanup, false partner/capital/engagement claims removed, live indicators corrected, score correctness issues, functioning CTAs, privacy and contact accuracy.

**P1 — Useful MVP:** source ingestion, canonical schema, real operator portal, API inventory/search, evidence-based scoring and risk, saved scenario/compare, real sourced intelligence feed, traceable diligence request, analyst review queue.

**P2 — Premium expansion:** advanced visual map, cross-source temporal comparisons, watchlists/alerts, source-backed AI assistant, investment reports, PDF export, customer workspace, multi-market scaling.

### Required checks before claiming production ready

1. Every public page has a target persona, one clear purpose, unique content and actionable CTA.
2. Every visible button/link reaches a meaningful route, action, feedback or explicit coming-soon disabled state.
3. Every statistic or asset claim has provenance, freshness and appropriate permission.
4. No user sees false confirmation for inquiry, saved candidate, monitoring or report generation.
5. Request → persistence → notification → analyst review works end-to-end and is covered by tests.
6. Scenario filters never silently ignore constraints and no candidate is called deliverable without evidence.
7. Production API responses have no demo identifiers, hardcoded timestamps or misleading availability.
8. Authenticated records and off-market inventory are inaccessible to unauthorized parties.
9. UX passes WCAG 2.2 AA audit and mobile/tablet/desktop functional QA.
10. Product copy, identity, email, phone, business model claims and case studies receive client approval.

## Sources and traceability

Code: [InFraX repository](https://github.com/mikevocalz/infrax/tree/bce60ae9d58a8041a58ed018efbb829c6c186cd3).

External source/industry validation is detailed in [the companion data and architecture report](./2026-11-04-data-evidence-roadmap.md). This audit does not republish private client email correspondence. All founder/client approval decisions are flagged rather than assumed.
