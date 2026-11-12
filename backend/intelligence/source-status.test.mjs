import test from 'node:test';import assert from 'node:assert/strict';
import {sanitizeSourceStatuses,getExternalSourceStatus,EXT_SOURCES}from './source-status.mjs';
const row={provider:'datacentermap-directory',license_url:'https://www.datacentermap.com/research/explorer/',allowed_usage:'restricted',redistribution_approved:false,reviewed_at:null,record_count:33,latest_retrieval:'2026-11-12T00:00:00Z'};
test('public users cannot see unapproved source counts',()=>{
 assert.deepEqual(sanitizeSourceStatuses([row]),[]);
 assert.equal(sanitizeSourceStatuses([row],{staff:true})[0].importedRecords,33);
 assert.equal(sanitizeSourceStatuses([row],{staff:true})[0].recordCount,0);
});
test('only explicitly approved and reviewed sources are public',()=>{
 const valid={...row,allowed_usage:'licensed_public',redistribution_approved:true,reviewed_at:'2026-11-12T00:00:00Z'};
 const result=sanitizeSourceStatuses([valid,{...valid,provider:'other'}]);
 assert.equal(result.length,1);assert.equal(result[0].recordCount,33);
});
test('database query has fixed provider allowlist and safe status projection',async()=>{
 let sqlText,params;const result=await getExternalSourceStatus({sql:{query:async(q,p)=>{sqlText=q;params=p;return[row];}},staff:false});
 assert.equal(result.schema,'infrax-external-sources-v1');assert.equal(result.sources.length,0);
 assert.match(sqlText,/source_licenses/);assert.deepEqual(params[0],EXT_SOURCES);
 await assert.rejects(getExternalSourceStatus({}),/DATABASE_REQUIRED/);
});
