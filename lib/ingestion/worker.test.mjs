import{test}from'node:test';import assert from'node:assert/strict';
import{createNeonEvidenceWriter}from'./neon-writer.mjs';
import{runIngestionJob,shouldRefresh}from'./worker.mjs';
const record={provider:'EIA',externalKey:'one',sourceUrl:'https://api.eia.gov/data',sourceVersion:'1',contentSha256:'a'.repeat(64),payload:{value:2}};
test('no unregistered source can be inserted',async()=>{
 const sql={query:async()=>[]},writer=createNeonEvidenceWriter(sql);
 await assert.rejects(writer.writeSourceRecord(record),/not been licensed/);
});
test('verified source registration allows parameterized immutable insert',async()=>{
 const queries=[];
 const sql={query:async(text,args)=>{queries.push({text,args});return queries.length===1?[{id:'source-id'}]:[];}};
 await createNeonEvidenceWriter(sql).writeSourceRecord(record);
 assert.equal(queries.length,2);assert.match(queries[1].text,/ON CONFLICT/);assert.equal(queries[1].args[0],'source-id');
 assert.equal(queries[1].args[5],null);
});
test('worker stores source with no automatic public publication',async()=>{
 let stored=0;
 const result=await runIngestionJob({provider:'EIA',sourceUrl:'https://api.eia.gov',license:{provider:'EIA'},
  load:async()=>[{externalKey:'x',value:123}],
  repository:{writeSourceRecord:async()=>{stored++;}}});
 assert.equal(stored,1);assert.equal(result.publication,'not_published');
});
test('refresh logic follows provider cadence',()=>{
 assert.equal(shouldRefresh({lastSuccessfulAt:'2026-11-04T12:00:00Z',minimumIntervalMinutes:60,now:new Date('2026-11-04T12:30:00Z')}),false);
 assert.equal(shouldRefresh({lastSuccessfulAt:'2026-11-04T12:00:00Z',minimumIntervalMinutes:60,now:new Date('2026-11-04T13:00:00Z')}),true);
});
