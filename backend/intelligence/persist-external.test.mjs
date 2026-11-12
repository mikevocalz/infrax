import test from 'node:test';import assert from 'node:assert/strict';import {persistExternalEvidence}from './persist-external.mjs';
const license={id:'00000000-0000-4000-8000-000000000001',provider:'datacentermap-directory',allowed_usage:'internal',reviewed_at:'2026-11-12'};
const facility={source:'datacentermap-directory',externalId:'DCM-1',name:'Example',country:'US',state:'NY',city:'New York',location:{lat:40.7,lon:-74},builtOutPowerMw:15,availableCapacityMw:null,publicDiscoveryAllowed:false};
test('requires approval and reviewed licensed input',async()=>{
 await assert.rejects(persistExternalEvidence({}),/SQL_REQUIRED/);
 const sql={query:async()=>[license]};
 await assert.rejects(persistExternalEvidence({sql,provider:'datacentermap-directory',items:[facility],sourceVersion:'2026'}),/IMPORT_APPROVAL_REQUIRED/);
 await assert.rejects(persistExternalEvidence({sql,provider:'unapproved',items:[facility],sourceVersion:'2026',importApproved:true}),/UNSUPPORTED_SOURCE/);
 await assert.rejects(persistExternalEvidence({sql:{query:async()=>[]},provider:'datacentermap-directory',items:[facility],sourceVersion:'2026',importApproved:true}),/SOURCE_RIGHTS_NOT_APPROVED/);
});
test('facility evidence remains private, immutable and no operator offer is created',async()=>{
 const statements=[];
 const sql={query:async(q,args)=>{statements.push({q,args});if(q.startsWith('SELECT id,provider'))return[license];if(q.startsWith('INSERT INTO infra.source_records'))return[{id:'00000000-0000-4000-8000-000000000002'}];if(q.startsWith('INSERT INTO infra.external_facility_leads'))return[{id:'00000000-0000-4000-8000-000000000003'}];return[];}};
 const result=await persistExternalEvidence({sql,provider:'datacentermap-directory',items:[facility],sourceVersion:'licensed-2026',importApproved:true});
 assert.equal(result.created,1);assert.equal(result.publications,0);assert.equal(result.operatorOffers,0);
 assert.equal(statements.length,3);assert.equal(statements[2].args.at(-1),15);
 assert.ok(!statements.some(s=>/infra\.capacity_offers|infra\.market_signals/i.test(s.q)));
});
test('rejects any attempt to inject verified MW/public discovery into private leads',async()=>{
 const sql={query:async()=>[license]};
 for(const item of [{...facility,availableCapacityMw:15},{...facility,publicDiscoveryAllowed:true}])await assert.rejects(persistExternalEvidence({sql,provider:'datacentermap-directory',items:[item],sourceVersion:'2026',importApproved:true}),/FACILITY_QUARANTINE_REQUIRED/);
});
test('network incident cannot claim facility downtime and source cannot be switched',async()=>{
 const sql={query:async()=>[license]};
 await assert.rejects(persistExternalEvidence({sql,provider:'datacentermap-directory',items:[{...facility,source:'cloudflare-radar-outages'}],sourceVersion:'2026',importApproved:true}),/MISMATCHED_EVIDENCE_SOURCE/);
});
