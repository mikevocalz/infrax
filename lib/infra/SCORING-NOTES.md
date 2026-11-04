# Scoring migration notes

The production `runScoring(req)` entrypoint now defaults to an **empty candidate set**, not `lib/mock-data`. Supply real, permissioned candidate records after Neon query integration; explicit demo mode must be opt-in and clearly marked. No saved or shared scores should use test fixtures.

This PR makes the previously ignored compliance and procurement filters participate in eligibility, rejects non-contractable statuses, protects against invalid numeric inputs, and requires current independent offer verification before “strong” or “viable” designations.

The existing `Candidate` type should be extended in the integration PR with `availabilityVerificationStatus`, `offerVerifiedAt`, `offerValidUntil` (or a richer evidence object). The current scenario page will show zero results until a genuine service is provided. `estimatedMonthlyKw` intentionally outputs zero to prevent fake quotes; a later API contract should replace this with nullable, itemized estimated costs.

Tests: `node --test lib/infra/scoring-core.test.mjs`.
