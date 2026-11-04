# InFraX transactional intake notifications

This PR adds an **atomic Postgres outbox trigger** stacked on Neon-backed intake PR #13. New intake rows queue exactly one delivery event as part of the same transaction. A separate authenticated worker should claim pending rows with `FOR UPDATE SKIP LOCKED`, use the existing Resend transport and idempotency key, mark sent only after the provider confirms a message ID, and retry with backoff. **That worker deployment, row locking, scheduling and monitoring are not implemented yet.**

Only a reference ID goes into the message, never full contact, private operator capacity documents or technical notes. The analyst must sign in to view the underlying intake. Resend requires a verified sending domain, configured operational recipient address and server-side API key before delivery.

Resend official idempotency documentation: https://resend.com/blog/engineering-idempotency-keys

This PR is **not proof that emails have been sent**. Node contract tests: `node --test lib/infra/resend-outbox.test.mjs`. Integration requires applying the migration from PR #9 before #13 and this outbox migration, then adding the actual worker route.
