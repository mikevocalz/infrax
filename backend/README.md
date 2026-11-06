# InFraX server integration

Run from repository root: `npm run test:backend`. `npm run dev` and `npm run build` install the exact backend driver dependency first. Copy only the required keys from `backend/.env.example` into the host's private environment; never commit credentials.

HTTP requests now target real Neon queries through the restricted API schema. Configuration is lazy and fail-closed. If environment/credentials are absent, endpoints return 503 rather than fixture data. An empty successful query returns 200 with `status: empty`.

The private-scenario identity adapter is a real same-origin Better Auth get-session client, but the underlying Payload/Better Auth runtime and its generated migrations still need to be mounted. Until then, private operations remain unavailable or require sign-in. Do not bypass this with a fake user/session or an owner DB URL.

`ingestEia({sql,apiKey,state,sector})` is the bounded EIA-to-Neon evidence job. Supply a Neon query function authenticated as a restricted ingestion login, not the API runtime login. It requires a reviewed source-license row, records job outcomes and deduplicates evidence. It does not approve source rights, publish market signals, run on a schedule, claim physical availability or send emails. No live upstream run has been performed.

The existing source adapters in `lib/ingestion` are consolidated from PR #16; the EIA decoder now rejects missing prices instead of converting them to zero. Remaining providers retain their prior integration limits. Complete end-to-end builds and provider/identity testing before any release.

See `docs/INFRAX-API-INTEGRATION-20261106.md` for actual live changes, tests and remaining work.
