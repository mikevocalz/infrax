-- Transactional Resend notifications: queued in same Postgres transaction as a new inquiry.
BEGIN;
CREATE TABLE IF NOT EXISTS infra.notification_outbox (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 event_kind text NOT NULL,
 reference_id uuid NOT NULL,
 idempotency_key text NOT NULL UNIQUE,
 state text NOT NULL DEFAULT 'pending' CHECK(state IN ('pending','sending','sent','failed')),
 attempts integer NOT NULL DEFAULT 0 CHECK(attempts >= 0),
 created_at timestamptz NOT NULL DEFAULT now(),
 sent_at timestamptz,
 provider_message_id text,
 last_error text
);
CREATE INDEX IF NOT EXISTS infra_notification_outbox_pending ON infra.notification_outbox(created_at) WHERE state='pending';
CREATE OR REPLACE FUNCTION infra.queue_intake_receipt() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
 INSERT INTO infra.notification_outbox(event_kind,reference_id,idempotency_key)
 VALUES('intake.received',NEW.id,'infrax-intake-received/'||NEW.id::text)
 ON CONFLICT(idempotency_key) DO NOTHING;
 RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS infra_queue_intake_received ON infra.intake_requests;
CREATE TRIGGER infra_queue_intake_received AFTER INSERT ON infra.intake_requests
 FOR EACH ROW EXECUTE FUNCTION infra.queue_intake_receipt();
COMMIT;