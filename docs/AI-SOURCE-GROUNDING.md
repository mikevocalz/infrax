# Source-backed InFraX assistant — integration limits

This PR replaces the freeform assistant that answered market questions without actual references. It consumes only **reviewed, publicly distributable market signals** from the dedicated Neon catalog. No private operator records, unverified inventory, or invented live MW values are sent to Gemini. All summaries include inspectable external source URLs.

**Incomplete gates**: dedicated InFraX Neon DB, authenticated scoped source publishing, ingestion approvals, rate limiting, prompt-injection red team, privacy/security notice for third-party model inference, configured GenAI model, browser rendering/clickable source links, admin monitoring and token cost limits. The data retrieval is currently simple latest-reviewed headlines, **not full semantic RAG** and not appropriate for commercial site recommendations.

Requires Neon schema PR #9, real intake package integration PR #13 and approval of public source rights. Only enable `INFRAX_AI_ENABLED=true` after those gates. Tests: `node --test lib/infra/grounding.test.mjs`.
