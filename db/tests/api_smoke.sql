-- Development ONLY. Re-runnable; fixtures never commit. Run with ON_ERROR_STOP.
BEGIN;
DO $$ BEGIN IF current_database()<>'infrax' OR current_user<>'infrax_owner' THEN RAISE EXCEPTION 'Wrong smoke-test target'; END IF; END $$;
INSERT INTO infra.organizations(id,legal_name,kind) VALUES
 ('11111111-1111-4111-8111-111111111111','ROLLBACK TEST A','buyer'),
 ('22222222-2222-4222-8222-222222222222','ROLLBACK TEST B','buyer');
INSERT INTO infra.organization_members(organization_id,identity_subject,member_role) VALUES
 ('11111111-1111-4111-8111-111111111111','test-owner-a','owner'),
 ('11111111-1111-4111-8111-111111111111','test-viewer-a','viewer'),
 ('22222222-2222-4222-8222-222222222222','test-owner-b','owner');
SET LOCAL ROLE infrax_runtime;
DO $$ DECLARE a uuid; b uuid; BEGIN
 BEGIN PERFORM * FROM infra.intake_requests; RAISE EXCEPTION 'Private intake readable'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN PERFORM * FROM infra_meta.api_idempotency; RAISE EXCEPTION 'Internal receipt readable'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN PERFORM * FROM infra_api.list_scenarios('test-owner-a','22222222-2222-4222-8222-222222222222'); RAISE EXCEPTION 'Cross-org read allowed'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN PERFORM infra_api.save_scenario('test-viewer-a','11111111-1111-4111-8111-111111111111','Denied','{}','55555555-5555-4555-8555-555555555555'); RAISE EXCEPTION 'Viewer write allowed'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 a:=infra_api.save_scenario('test-owner-a','11111111-1111-4111-8111-111111111111','Test scenario','{"minimumItMw":5,"maximumItMw":10}','66666666-6666-4666-8666-666666666666');
 b:=infra_api.save_scenario('test-owner-a','11111111-1111-4111-8111-111111111111','Test scenario','{"minimumItMw":5,"maximumItMw":10}','66666666-6666-4666-8666-666666666666');
 IF a<>b THEN RAISE EXCEPTION 'Scenario duplicate'; END IF;
 IF (SELECT count(*) FROM infra_api.list_scenarios('test-viewer-a','11111111-1111-4111-8111-111111111111'))<>1 THEN RAISE EXCEPTION 'Authorized read failed'; END IF;
 BEGIN PERFORM infra_api.save_scenario('test-owner-a','11111111-1111-4111-8111-111111111111','Different payload','{}','66666666-6666-4666-8666-666666666666'); RAISE EXCEPTION 'Conflicting key accepted'; EXCEPTION WHEN invalid_parameter_value THEN NULL; END;
 a:=infra_api.submit_intake('developer','Rollback Test','backend-smoke@example.invalid','Test Company','{"notes":"test"}','77777777-7777-4777-8777-777777777777');
 b:=infra_api.submit_intake('developer','Rollback Test','backend-smoke@example.invalid','Test Company','{"notes":"test"}','77777777-7777-4777-8777-777777777777');
 IF a<>b THEN RAISE EXCEPTION 'Inquiry duplicate'; END IF;
END $$;
RESET ROLE;
DO $$ BEGIN
 IF (SELECT count(*) FROM infra.notification_outbox WHERE reference_id IN (SELECT id FROM infra.intake_requests WHERE email='backend-smoke@example.invalid'))<>1 THEN RAISE EXCEPTION 'Outbox duplicate'; END IF;
 IF (SELECT count(*) FROM infra.scenario_versions WHERE scenario_id IN (SELECT id FROM infra.scenarios WHERE created_by='test-owner-a'))<>1 THEN RAISE EXCEPTION 'Initial version duplicate'; END IF;
END $$;
ROLLBACK;
