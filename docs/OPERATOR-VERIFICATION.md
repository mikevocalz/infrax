# Operator and supplier inventory

This PR provides the **domain state machine** for partner-submitted capacity. It is intentionally fail-closed pending first-class Better Auth identity, operator ownership and analyst entitlements, private document storage and Neon repository adapters.

Workflow: authenticated operator → submit restricted offer → attach evidence and utility/power/cooling documents → staff analyst review → approved verified claim → authorized disclosure → expiration or revocation. A new offer is always restricted regardless of its requested disclosure setting. Reviewer must be separate from operator and backed by an independent evidence claim.

UI must distinguish Critical IT MW from gross facility draw and requested from legally deliverable capacity. A public candidate should never derive availability solely from the HIFLD transmission map or ERCOT/PJM queue. Publication rights for operator logos and private inventory must be recorded. Tie this to Payload v4 operator review collection PR #12, Neon schema PR #9 and the cross-platform Starter Pro operator portal.

Execute `node --test lib/infra/operator-offers.test.mjs`. Actual API route, document upload transport and ACL-backed Neon adapters are not yet connected.
