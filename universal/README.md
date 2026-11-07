# InFraX universal source-review host

A first mounted feature, not the entire client/operator app. Both Next and Expo import `shared/ResearchScreen.tsx`, NYC-Tron alpha.4 Button/Card subpaths, scoped Zustand state, and the existing repository `client/research-*.mjs` contract. The backend remains the existing Payload/Better Auth/Neon implementation; this host does not create a second identity store.

## Run

Use Node 24.22.1 or newer. From `universal`: `npm install`, `npm test`, `npm run typecheck`, `npm run build:web`, `npm run bundle:native`. Start web with `npm run dev:web` (port 3100); native with `npm run dev:mobile`. Keep the current InFraX backend on its existing development port. Expo native bundles are not native OS binaries and do not prove device behavior.

Web's `/api/v1/research/context` forwards only GET requests to the fixed server-configured origin and hostname, carrying the existing session cookie and no privileged key. Unknown queries, redirects, invalid evidence, oversized responses and unauthorized upstream sessions fail closed. It requires the existing staff session; cross-site production login/cookie configuration is NOT solved by this development proxy. Default host behavior is unavailable/signed-out, never fabricated records.

Native's public configuration contains only the approved API origin. The current host relies on the native cookie/session adapter; full Better Auth Expo secure-session integration and sign-in/recovery screens remain release gates. Never put a database password or admin token in EXPO_PUBLIC_*.

## Preserved invariants and remaining gates

This feature follows the existing Universal Spatial Starter split (Next web / Expo native / shared features). No raw HTML feature screens or WebViews; web document/probe markup is isolated in `shared/ui/`. One shared state/evidence component; no native copy of matching/data logic. Real NYC-Tron release packages, not substitute controls. Shared measured-region interface preserves content state on resize and selects columns from usable width and font scale.

The native host consumes @nyc-tron/reserved-regions and @nyc-tron/core measured geometry. The web host measures viewport-segment environment values. Missing native bridge is explicitly disclosed. Neither is physical-device certification. The common account drawer, five complete workspace destinations, Kinetrell choreography, native auth and physical-device testing remain incomplete.

Browser tests use an explicit synthetic localhost upstream through the real Next BFF, not live staff permissions or Neon. The existing main website is not replaced. No Vercel config/deployment, live account, source publication or production database change is part of this change.
