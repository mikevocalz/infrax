-- Internal-only source summaries. Explicit owner execution; no runtime write grant.
-- Execute ONLY on the approved InFraX development branch, never production.
BEGIN;
CREATE FUNCTION infra_meta.import_context_summaries(p jsonb)
RETURNS TABLE(dataset text, inserted_summaries integer, inserted_evidence integer, ingestion_run_id uuid)
LANGUAGE plpgsql SECURITY INVOKER SET search_path=pg_catalog,infra,infra_meta,public AS $fn$
DECLARE
 b jsonb; r jsonb; v jsonb; old jsonb; metric record;
 ds text; st text; permitted_url text; lic uuid; evidence uuid; n integer:=0; e integer:=0;
 expected_states text[]:=string_to_array('AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY PR VI GU AS MP',' ');
BEGIN
 IF current_database()<>'infrax' OR current_user<>'infrax_owner' THEN RAISE EXCEPTION 'Import requires the approved owner/database'; END IF;
 IF jsonb_typeof(p) IS DISTINCT FROM 'object' OR pg_column_size(p)>100000 THEN RAISE EXCEPTION 'Invalid bounded import'; END IF;
 b:=p->'base'; ds:=b->>'dataset';
 permitted_url:=CASE ds
 WHEN 'eia860-generators-2025' THEN 'https://www.eia.gov/electricity/data/eia860/xls/eia8602025.zip'
 WHEN 'eia860m-generators-2026-09' THEN 'https://www.eia.gov/electricity/data/eia860m/xls/september_generator2026.xlsx'
 WHEN 'eia861-utility-counties-2025' THEN 'https://www.eia.gov/electricity/data/eia861/zip/f8612025.zip'
 WHEN 'eia923-generation-fuel-2025' THEN 'https://www.eia.gov/electricity/data/eia923/xls/f923_2025.zip'
 WHEN 'lbnl-queue-through-2025' THEN 'https://eta-publications.lbl.gov/sites/default/files/2026-05/lbnl_ix_queue_data_file_thru2025.xlsx'
 WHEN 'egrid-plants-2023-rev2' THEN 'https://www.epa.gov/system/files/documents/2025-06/egrid2023_data_rev2.xlsx' END;
 IF permitted_url IS NULL OR b->>'source_url' IS DISTINCT FROM permitted_url OR
 b->>'normalization_version' IS DISTINCT FROM 'infrax-context-v1' OR
 b->'commercial_offer' IS DISTINCT FROM 'false'::jsonb OR b->'publication_approved' IS DISTINCT FROM 'false'::jsonb OR
 coalesce(b->>'source_package_sha256','') !~ '^[a-f0-9]{64}$' OR coalesce(b->>'output_sha256','') !~ '^[a-f0-9]{64}$' OR
 coalesce(b->>'source_title','')='' OR coalesce(b->>'observation_period','')='' OR coalesce(b->>'entity_kind','')='' THEN
 RAISE EXCEPTION 'Unreviewed dataset identity or publication flag'; END IF;
 IF jsonb_typeof(p->'rows') IS DISTINCT FROM 'array' THEN RAISE EXCEPTION 'Rows required'; END IF;
 IF jsonb_array_length(p->'rows') NOT BETWEEN 1 AND 56 OR
 (SELECT count(DISTINCT x->>0) FROM jsonb_array_elements(p->'rows') x)<>jsonb_array_length(p->'rows') THEN RAISE EXCEPTION 'Invalid or repeated states'; END IF;
 PERFORM pg_advisory_xact_lock(746291,7);
 INSERT INTO infra.source_licenses(provider,license_url,allowed_usage,redistribution_approved,review_notes)
 VALUES(ds,CASE WHEN ds LIKE 'eia%' THEN 'https://www.eia.gov/about/copyrights_reuse.php'
 WHEN ds LIKE 'lbnl%' THEN 'https://creativecommons.org/licenses/by/4.0/' ELSE 'https://www.epa.gov/egrid/detailed-data' END,
 'internal',false,'Internal development summary review only. No publication approval. Preserve original source/date and attribution; LBNL/GridTracker Queued Up 2026 CC BY 4.0, transformed selected-table counts.')
 ON CONFLICT(provider) DO NOTHING;
 SELECT l.id INTO STRICT lic FROM infra.source_licenses l WHERE l.provider=ds AND l.allowed_usage='internal' AND NOT l.redistribution_approved;
 FOR r IN SELECT value FROM jsonb_array_elements(p->'rows') LOOP
  IF jsonb_typeof(r) IS DISTINCT FROM 'array' OR jsonb_array_length(r)<>4 THEN RAISE EXCEPTION 'Invalid row shape'; END IF;
  st:=r->>0;
  IF st IS NULL OR NOT(st=ANY(expected_states)) OR jsonb_typeof(r->1) IS DISTINCT FROM 'number' OR jsonb_typeof(r->2) IS DISTINCT FROM 'number' OR
  (r->>1) !~ '^[0-9]{1,8}$' OR (r->>2) !~ '^[0-9]{1,8}$' OR (r->>2)::int>(r->>1)::int OR jsonb_typeof(r->3) IS DISTINCT FROM 'object' THEN RAISE EXCEPTION 'Invalid state/counts'; END IF;
  FOR metric IN SELECT key,value FROM jsonb_each(r->3) LOOP
   IF metric.key !~ '^[a-z0-9_]+:(reported|missing|invalid)$' OR jsonb_typeof(metric.value) IS DISTINCT FROM 'number' OR metric.value::text !~ '^[0-9]{1,8}$' OR (metric.value::text)::int>(r->>1)::int THEN RAISE EXCEPTION 'Invalid quality count'; END IF;
  END LOOP;
  IF EXISTS (SELECT 1 FROM jsonb_each_text(r->3) q GROUP BY split_part(q.key,':',1) HAVING sum(q.value::int)<>(r->>1)::int) THEN RAISE EXCEPTION 'Quality totals do not reconcile'; END IF;
  v:=b||jsonb_build_object('state',st,'normalized_rows',(r->>1)::int,'distinct_entity_keys',(r->>2)::int,'metric_quality',r->3);
  SELECT m.summary INTO old FROM infra.market_context_summaries m WHERE m.dataset=ds AND m.state=st;
  IF FOUND AND old IS DISTINCT FROM v THEN RAISE EXCEPTION 'Existing evidence changed: review a version migration before replacement'; END IF;
  evidence:=NULL;
  INSERT INTO infra.source_records(license_id,external_key,source_url,source_version,content_sha256,retrieved_at,raw_payload)
  VALUES(lic,ds||':'||st,permitted_url,b->>'normalization_version',encode(public.digest(v::text,'sha256'),'hex'),
   coalesce((b->>'source_retrieved_at')::timestamptz,now()),v)
  ON CONFLICT(license_id,external_key,content_sha256) DO NOTHING RETURNING id INTO evidence;
  IF evidence IS NOT NULL THEN e:=e+1; ELSE
   SELECT s.id INTO STRICT evidence FROM infra.source_records s WHERE s.license_id=lic AND s.external_key=ds||':'||st AND s.content_sha256=encode(public.digest(v::text,'sha256'),'hex');
  END IF;
  INSERT INTO infra.market_context_summaries(dataset,state,period,source_record_id,summary)
  VALUES(ds,st,b->>'observation_period',evidence,v) ON CONFLICT DO NOTHING;
  IF FOUND THEN n:=n+1; END IF;
 END LOOP;
 INSERT INTO infra.ingestion_runs(provider,finished_at,result,imported,rejected)
 VALUES(ds||':state-summary',now(),'succeeded',n,0) RETURNING id INTO ingestion_run_id;
 dataset:=ds;inserted_summaries:=n;inserted_evidence:=e;RETURN NEXT;
END $fn$;
REVOKE ALL ON FUNCTION infra_meta.import_context_summaries(jsonb) FROM PUBLIC;
COMMIT;
