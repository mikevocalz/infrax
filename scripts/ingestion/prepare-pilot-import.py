#!/usr/bin/env python3
"""Validate an artifact and prepare development-only SQL. No connections or secrets.
Execute statements in one transaction ONLY on the explicit development branch.
"""
import argparse, importlib.util, json, re
from datetime import datetime
from pathlib import Path
spec=importlib.util.spec_from_file_location('collector',Path(__file__).with_name('collect-public-pilot.py'))
c=importlib.util.module_from_spec(spec);spec.loader.exec_module(c)

def literal(value):
    if value is None: return 'NULL'
    if '\x00' in str(value): raise ValueError('NUL is not valid SQL text')
    return "'"+str(value).replace("'","''")+"'"

def validate(dataset):
    if dataset.get('provider') not in ('EIA_EPM_5_6_A','OSM_DFW_DISCOVERY'): raise ValueError('Provider is not approved for internal evaluation')
    if not re.fullmatch(r'[a-f0-9]{64}',dataset.get('response_sha256','')): raise ValueError('Response checksum required')
    dt=datetime.fromisoformat(dataset['retrieved_at'].replace('Z','+00:00'))
    if not dt.tzinfo: raise ValueError('Timezone required')
    records=dataset.get('records')
    if not isinstance(records,list) or not 0<len(records)<=1000: raise ValueError('Bounded nonempty source records required')
    seen=set()
    for r in records:
        if r['external_key'] in seen or r['content_sha256']!=c.checksum(r['raw_payload']): raise ValueError('Duplicate key or altered payload')
        seen.add(r['external_key'])
        if r['observed_at'] is not None: raise ValueError('Pilot observation is monthly/as-of, not instantaneous')
    if dataset['provider']=='EIA_EPM_5_6_A':
        if len(records)!=102 or len({r['raw_payload']['state'] for r in records})!=51: raise ValueError('Complete 51-state/DC comparison required')
        for r in records:
            p=r['raw_payload']
            if r['source_url']!=c.EIA_URL or p['unit']!='cents_per_kwh' or p['scope']!='state_sector_average' or p['facility_quote'] is not False: raise ValueError('Invalid EIA semantic scope')
            if p['period'] not in dataset['periods'] or p['state'] not in c.STATES.values(): raise ValueError('Unexpected geography/period')
            for sector in c.SECTORS:
                price=p['prices'][sector]
                if price['value']!=c.numeric(price['source_token']): raise ValueError('Value/source token disagreement')
    return records

def prepare_eia(dataset, *, environment):
    if environment!='development': raise ValueError('This import is development-only')
    records=validate(dataset)
    if dataset['provider']!='EIA_EPM_5_6_A': raise ValueError('EIA table required')
    indexed={(r['raw_payload']['state'],r['raw_payload']['period']):r['raw_payload'] for r in records}
    periods=dataset['periods'];matrix=[]
    for state in sorted({r['raw_payload']['state'] for r in records}):
        current=indexed[(state,periods[0])];prior=indexed[(state,periods[1])]
        if current['estimate_status']!='preliminary' or prior['estimate_status']!='final': raise ValueError('Unexpected source status')
        matrix.append([state,current['state_name']]+[p['prices'][sector]['source_token'] for sector in c.SECTORS for p in (current,prior)])
    notes='EIA published-data policy checked 2026-11-06. Internal development evaluation only; not approved for app publication. National state-sector averages are not tariffs, facility quotes or available capacity. Source response SHA256 '+dataset['response_sha256']
    guard="DO $guard$ BEGIN IF current_database() <> 'infrax' THEN RAISE EXCEPTION 'Wrong database'; END IF; END $guard$;"
    license_sql=f"INSERT INTO infra.source_licenses(provider,license_url,allowed_usage,redistribution_approved,reviewed_at,review_notes) VALUES ('EIA_EPM_5_6_A','https://www.eia.gov/about/copyrights_reuse.php','internal',false,now(),{literal(notes)}) ON CONFLICT(provider) DO NOTHING;"
    sql=f"""WITH input AS (
 SELECT value AS a FROM jsonb_array_elements({literal(json.dumps(matrix,separators=(',',':')))}::jsonb)
), observations AS (
 SELECT a, period, quality, offset_index FROM input
 CROSS JOIN (VALUES ({literal(periods[0])},'preliminary',0),({literal(periods[1])},'final',1)) AS p(period,quality,offset_index)
), payloads AS (
 SELECT a->>0 AS state,period,jsonb_build_object(
 'dataset','eia_epm_5_6_a','state',a->>0,'state_name',a->>1,'period',period,
 'unit','cents_per_kwh','estimate_status',quality,'scope','state_sector_average','facility_quote',false,
 'source_response_sha256',{literal(dataset['response_sha256'])},
 'prices',(SELECT jsonb_object_agg(sector,jsonb_build_object('source_token',a->>(pos+offset_index),'value',
 CASE WHEN a->>(pos+offset_index) IN ('--','NM','NA','N/A','*','') THEN NULL ELSE (a->>(pos+offset_index))::numeric END))
 FROM (VALUES ('residential',2),('commercial',4),('industrial',6),('transportation',8),('all_sectors',10)) AS sectors(sector,pos))) AS payload
 FROM observations
), inserted AS (
 INSERT INTO infra.source_records(license_id,external_key,source_url,source_version,content_sha256,observed_at,published_at,retrieved_at,raw_payload)
 SELECT l.id,'eia:epm:5.6.a:'||p.state||':'||p.period,{literal(c.EIA_URL)},{literal(dataset['published_at'][:10])},
 encode(digest(convert_to((p.payload-'source_response_sha256')::text,'UTF8'),'sha256'),'hex'),NULL,{literal(dataset['published_at'])}::timestamptz,{literal(dataset['retrieved_at'])}::timestamptz,p.payload
 FROM payloads p CROSS JOIN infra.source_licenses l WHERE l.provider='EIA_EPM_5_6_A'
 ON CONFLICT(license_id,external_key,content_sha256) DO NOTHING RETURNING id
), audit AS (
 INSERT INTO infra.ingestion_runs(provider,started_at,finished_at,result,imported,rejected)
 SELECT 'EIA_EPM_5_6_A',now(),now(),'succeeded',count(*)::int,0 FROM inserted
 RETURNING id,provider,imported
)
SELECT id AS ingestion_run_id,provider,imported,102-imported AS unchanged_records,'development_review_only' AS visibility FROM audit;"""
    return ['SET LOCAL standard_conforming_strings=on;',"SET LOCAL lock_timeout='5s';",guard,"SELECT pg_advisory_xact_lock(hashtextextended('infrax:EIA_EPM_5_6_A',0));",license_sql,sql]

def main():
    ap=argparse.ArgumentParser();ap.add_argument('--bundle',required=True);ap.add_argument('--output',required=True);ap.add_argument('--environment',required=True,choices=['development']);args=ap.parse_args()
    bundle=json.loads(Path(args.bundle).read_text())
    if bundle.get('publication')!='not_published' or bundle.get('purpose')!='development_review_only': raise ValueError('Unexpected bundle purpose')
    d=next(d for d in bundle['datasets'] if d['provider']=='EIA_EPM_5_6_A')
    statements=prepare_eia(d,environment=args.environment)
    Path(args.output).write_text(json.dumps({'project_id':'spring-glitter-25305067','branch_id':'br-holy-mode-bcenb3y8','database_name':'infrax','sql_statements':statements},indent=2))
    print('Prepared 102 state/period evidence records; no database connection opened.')
if __name__=='__main__':main()
