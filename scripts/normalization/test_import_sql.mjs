/** Real PostgreSQL transaction tests. This runner refuses remote/customer databases. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import pg from 'pg';
const url=new URL(process.env.INFRAX_TEST_DATABASE_URL??'');
if(process.env.CI!=='true'||url.hostname!=='127.0.0.1'||url.pathname!=='/infrax')throw Error('Disposable loopback CI database required');
const c=new pg.Client({connectionString:url.href});await c.connect();let assertions=0;
const check=(value,message)=>{assert.ok(value,message);assertions++;};
const query=p=>c.query('SELECT * FROM infra_meta.import_context_summaries($1::jsonb)',[JSON.stringify(p)]);
const reject=async fn=>{await c.query('SAVEPOINT denial');let denied=false;try{await fn();}catch{denied=true;await c.query('ROLLBACK TO SAVEPOINT denial');}await c.query('RELEASE SAVEPOINT denial');check(denied,'Invalid request must be denied');};
try{
 await c.query("CREATE EXTENSION IF NOT EXISTS pgcrypto; CREATE ROLE infrax_owner NOLOGIN; CREATE ROLE infrax_api_development NOLOGIN; CREATE SCHEMA infra AUTHORIZATION infrax_owner; CREATE SCHEMA infra_meta AUTHORIZATION infrax_owner; SET ROLE infrax_owner;");
 const source=fs.readFileSync('db/migrations/20261104_001_infra_catalog.sql','utf8');
 for(const name of ['source_licenses','source_records','ingestion_runs']){
  const match=source.match(new RegExp('CREATE TABLE IF NOT EXISTS infra\\.'+name+' \\([\\s\\S]*?\\n\\);'));
  assert.ok(match,'Expected authoritative table DDL '+name);await c.query(match[0]);
 }
 await c.query(fs.readFileSync('db/migrations/20261107_007_market_context.sql','utf8'));
 await c.query(fs.readFileSync('db/migrations/20261107_008_context_summary_import.sql','utf8'));
 await c.query(fs.readFileSync('db/migrations/20261107_009_research_schema_usage.sql','utf8'));
 await c.query('BEGIN');
 const p={base:{dataset:'eia860-generators-2025',source_id:'S03',source_title:'CI synthetic fixture',source_url:'https://www.eia.gov/electricity/data/eia860/xls/eia8602025.zip',source_package_sha256:'a'.repeat(64),output_sha256:'b'.repeat(64),normalization_version:'infrax-context-v1',observation_period:'2025',entity_kind:'generator_inventory',commercial_offer:false,publication_approved:false},rows:[['TX',5,5,{'nameplate_capacity:reported':4,'nameplate_capacity:missing':1}]]};
 let result=await query(p);check(result.rows[0].inserted_summaries===1,'First insert');check(result.rows[0].inserted_evidence===1,'Evidence created');
 result=await query(p);check(result.rows[0].inserted_summaries===0,'Replay no-op');check(result.rows[0].inserted_evidence===0,'Evidence deduplicated');
 const [stored]=(await c.query('SELECT m.summary,s.content_sha256,s.raw_payload,l.allowed_usage,l.redistribution_approved FROM infra.market_context_summaries m JOIN infra.source_records s ON s.id=m.source_record_id JOIN infra.source_licenses l ON l.id=s.license_id')).rows;
 check(stored.summary.normalized_rows===5,'Stored count');check(stored.allowed_usage==='internal'&&!stored.redistribution_approved,'No publication');
 check((await c.query("SELECT content_sha256=encode(public.digest(raw_payload::text,'sha256'),'hex') AS valid FROM infra.source_records")).rows[0].valid,'Database checksum');
 await reject(()=>query({...p,rows:[['TX',6,6,{'nameplate_capacity:reported':6}]]}));
 for(const patch of [{commercial_offer:true},{publication_approved:true},{source_url:'https://evil.example/'},{source_package_sha256:'invalid'}])await reject(()=>query({...p,base:{...p.base,...patch}}));
 for(const rows of [[['ZZ',5,5,{}]],[['CA',-1,0,{}]],[['CA',5,6,{}]],[['CA',5,5,{'nameplate_capacity:reported':6}]],[['CA',5,5,{'nameplate_capacity:reported':4}]],[p.rows[0],p.rows[0]]])await reject(()=>query({...p,rows}));
 await c.query('SET LOCAL ROLE infrax_api_development');
 check((await c.query("SELECT dataset,state,period,summary FROM infra.market_context_summaries WHERE state='TX'")).rows.length===1,'Runtime can actually read summaries');
 await reject(()=>c.query('SELECT * FROM infra.source_records'));
 await reject(()=>c.query('CREATE TABLE infra.forbidden_runtime_table(id int)'));
 await reject(()=>c.query("UPDATE infra.market_context_summaries SET period='wrong'"));
 await reject(()=>query(p));
 await c.query('RESET ROLE; SET LOCAL ROLE infrax_owner');
 check((await c.query('SELECT count(*)::int AS n FROM infra.market_context_summaries')).rows[0].n===1,'Rejected rows did not persist');
 await c.query('ROLLBACK');
 check((await c.query('SELECT count(*)::int AS n FROM infra.source_records')).rows[0].n===0,'All CI fixtures rolled back');
 console.log(JSON.stringify({assertions,status:'passed',scope:'disposable PostgreSQL; no customer data'}));
}finally{await c.end();}
