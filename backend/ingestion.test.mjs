import{test}from'node:test';import assert from'node:assert/strict';
import{ingestEia}from'./ingestion.mjs';import{readEiaRetailSales}from'../lib/ingestion/eia.mjs';
const response=async()=>Response.json({response:{data:[{period:'2026-10',price:'12.3',stateid:'TX',sectorid:'COM'}]}});
test('unreviewed source cannot fetch or write a run',async()=>{
 let fetched=false;await assert.rejects(ingestEia({sql:{query:async()=>[]},apiKey:'secret',fetchImpl:async()=>{fetched=true;}}),/LICENSE_REVIEW/);assert.equal(fetched,false);
});
test('missing source key fails before database work',async()=>{
 let queried=false;await assert.rejects(ingestEia({sql:{query:async()=>{queried=true;}}}),/CREDENTIAL/);assert.equal(queried,false);
});
test('real orchestration writes source evidence and an audit run but never signals',async()=>{
 const calls=[];const sql={query:async(q,p)=>{calls.push({q,p});if(q.startsWith('SELECT id'))return [{id:'source'}];if(q.includes('RETURNING id'))return [{id:'row'}];return [];}};
 const result=await ingestEia({sql,apiKey:'secret',fetchImpl:response});assert.equal(result.inserted,1);assert.equal(result.published,false);
 assert.ok(calls.some(c=>c.q.includes("result='succeeded'")));assert.ok(calls.every(c=>!c.q.includes('market_signals')));
 assert.doesNotMatch(JSON.stringify(calls),/api_key|secret/);
});
test('duplicate raw records are not reported as newly imported',async()=>{
 const sql={query:async q=>q.startsWith('SELECT id')?[{id:'source'}]:[]};const r=await ingestEia({sql,apiKey:'secret',fetchImpl:response});assert.equal(r.inserted,0);assert.equal(r.duplicates,1);
});
test('provider errors produce sanitized failed-run records',async()=>{
 const calls=[];const sql={query:async(q,p)=>{calls.push({q,p});return q.startsWith('SELECT id')?[{id:'source'}]:[];}};
 await assert.rejects(ingestEia({sql,apiKey:'secret',fetchImpl:async()=>{throw Error('api_key=secret');}}),/^Error: EIA_INGESTION_FAILED$/);
 assert.ok(calls.some(c=>c.q.includes("result='failed'")));assert.doesNotMatch(JSON.stringify(calls),/api_key=secret/);
});
test('missing prices, mismatched scope and invalid months cannot turn into data',async()=>{
 const rows=await readEiaRetailSales({apiKey:'secret',fetchImpl:async()=>Response.json({response:{data:[
 {period:'2026-01',price:null},{period:'2026-02',price:''},{period:'2026-13',price:3},{period:'2026-03',price:4,stateid:'CA'},{period:'2026-04',price:0}]}})});
 assert.equal(rows.length,1);assert.equal(rows[0].value,0);assert.equal(rows[0].period,'2026-04');
});
