# InFraX — Infrastructure Intelligence and Infra-Align

Public site and decision-platform implementation for strategic data center, power, land and connectivity planning. This repository still contains the legacy Next.js 15 website during migration.

**Truthful status:** the working site UI is not proof of real commercial facility availability. The legacy demo fixtures remain in `lib/mock-data.ts` for test/reference only. Production read APIs must not expose them as verified inventory.

## Development (legacy web)
- Node 24 recommended; `npm ci` then `npm run dev`.
- `npm run build` for production compilation and `npx tsc --noEmit` for types.
- The root lockfile must be regenerated whenever a PR changes dependencies.
- The assistant uses `GEMINI_API_KEY` only on the server; source-grounded AI remains gated.

## Cross-platform direction
- Universal Spatial Starter Pro: shared Expo SDK 58 mobile, Next.js App Router web, foldables, native/adaptive desktop and spatial targets.
- NYC-Tron-UI: composable semantic native/UI components; InFraX light/dark navy-orange theme.
- Kinetrell: consistent web GSAP/Lenis and native Reanimated motion.
- Zustand in native app features, no raw HTML / WebView editor or app shell.
- Payload v4 beta CMS + Better Auth adapter + Neon PostgreSQL/PostGIS evidence catalog are separate migration PRs.

See `docs/PR-ROLLUP.md` for current branches and merge order. No live InFraX Neon project, source API credentials or licensed operator inventory was connected by the initial PR creation.
