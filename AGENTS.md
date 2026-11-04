# InFraX engineering agent roster and requirements

Scope: `mikevocalz/infrax`, InFraX modules in Universal Spatial Starter Pro, and the theme-specific NYC-Tron-UI adapter.

## Nonnegotiable product rules
- No claim of live/sellable capacity or verified Tier status without traceable permissioned evidence and validity date.
- No fake stats, invented leadership, fictitious partner logos, or confirmation screens without durable receipts.
- Source licensing, operator consent, cross-tenant permissions and secure credential handling precede publishing data.
- Separate public institutional marketing from authenticated buyer/operator/analyst workspaces.
- The **cross-platform UI** comes from NYC-Tron-UI and Expo/Next Starter Pro. No new raw HTML/WebView app shells or generic third-party component replacements. Preserve InFraX navy/orange via theme tokens.
- App state uses Zustand. Motion uses Kinetrell and platform adapters, reduced-motion aware; no fake LIVE animation.
- Payload v4 CMS for approved editorial/admin content; dedicated Neon PostgreSQL/PostGIS for source evidence, offers, tenants and scenarios.
- No private provider API keys or restricted operator offers in the browser/native bundle.
- Phone, tablet, dual-screen, foldable, desktop and spatial support must be capability-led; never invent sensors, supported hardware or hinge angle.
- Document tests, route contracts, error/empty/loading state, accessibility and provenance for every new feature.

## Review roles (logical, not actual spawned agents)
1. Product/UX: each page has purpose, target persona and functioning call to action.
2. UI: shared NYC-Tron components, no raw HTML, responsive/hinge-aware behavior.
3. Data engineering: providers, rate limits, licensing, idempotency and spatial normalization.
4. Security: Better Auth ownership, source disclosure, audit and privilege tests.
5. QA: API, DB, source evidence, native and web E2E on supported hardware.

Do not merge draft PRs until prerequisites are satisfied and CI passes.
