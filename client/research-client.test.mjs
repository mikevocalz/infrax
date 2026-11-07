import{test}from'node:test';import assert from'node:assert/strict';
import{CONTEXT_SCHEMA,DATASETS,parseContextRow,parseResearchResponse}from'./research-contract.mjs';
import{ResearchClientError,createResearchClient,createResearchController}from'./research-client.mjs';
const row=(state='TX')=>({dataset:'eia860-generators-2025',state,period:'2025',title:'EIA annual generators',recordCount:5,distinctKeys:4,entityKind:'generator_inventory',sourceUrl:DATASETS['eia860-generators-2025'].url,sourceSha256:'a'.repeat(64),outputSha256:'b'.repeat(64),normalizationVersion:'infrax-context-v1',sourceRetrievedAt:'2026-11-06T23:33:57.316852+00:00',importedAt:'2026-11-07T06:00:00Z',quality:[{field:'nameplate_capacity',status:'reported',count:4},{field:'nameplate_capacity',status:'missing',count:1}],publication:'internal_review',isCapacityOffer:false});
const payload=(state='TX')=>({schema:CONTEXT_SCHEMA,status:'ready',state,data:[row(state)],warning:'untrusted server copy'});
const json=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:{'content-type':'application/json'}});
test('contract permits known context and supplies canonical warning',()=>{const r=parseResearchResponse(payload(),'TX');assert.equal(r.data[0].isCapacityOffer,false);assert.match(r.warning,/not data centers/);assert.ok(Object.isFrozen(r.data[0]));});
test('unknown dataset, wrong edition, future type and off-host sources are rejected',()=>{
 for(const patch of [{dataset:'unknown'},{period:'2026'},{entityKind:'datacenter'},{sourceUrl:'https://evil.test'},{sourceUrl:row().sourceUrl+'?redirect=1'},{publication:'public'},{isCapacityOffer:true},{normalizationVersion:'v2'}])assert.throws(()=>parseContextRow({...row(),...patch},'TX'));
});
test('wrong state cannot be silently shown under another market',()=>assert.throws(()=>parseResearchResponse({...payload('VA'),state:'TX'},'TX')));
test('empty and unavailable remain distinct',()=>{assert.equal(parseResearchResponse({schema:CONTEXT_SCHEMA,status:'empty',state:'TX',data:[]},'TX').status,'empty');assert.throws(()=>parseResearchResponse({...payload(),status:'empty'},'TX'));});
test('counts must be numbers and quality totals must reconcile',()=>{
 for(const patch of [{recordCount:'5'},{recordCount:-1},{distinctKeys:6},{quality:[]},{quality:[{field:'nameplate_capacity',status:'reported',count:6}]},{quality:[{field:'nameplate_capacity',status:'reported',count:4}]}])assert.throws(()=>parseContextRow({...row(),...patch},'TX'));
});
test('duplicate datasets and duplicate quality fields fail closed',()=>{
 assert.throws(()=>parseResearchResponse({...payload(),data:[row(),row()]},'TX'));
 assert.throws(()=>parseContextRow({...row(),quality:[...row().quality,row().quality[0]]},'TX'));
});
test('provenance fingerprints and timestamp shapes are required',()=>{
 for(const patch of [{sourceSha256:'wrong'},{outputSha256:null},{sourceRetrievedAt:'yesterday'},{importedAt:'invalid'},{title:''}])assert.throws(()=>parseContextRow({...row(),...patch},'TX'));
});
test('client requests fixed origin, authenticated headers and bounded data',async()=>{
 const load=createResearchClient({baseUrl:'https://infrax.example',getAuthHeaders:async()=>({Authorization:'Bearer test-only'}),fetchImpl:async(url,options)=>{assert.equal(url,'https://infrax.example/api/v1/research/context?state=TX');assert.equal(options.headers.Authorization,'Bearer test-only');assert.equal(options.redirect,'error');assert.equal(options.cache,'no-store');return json(payload());}});
 assert.equal((await load('TX')).data.length,1);
});
test('unsafe API origins are rejected',()=>{for(const baseUrl of ['http://outside.example','https://u:p@infrax.example','https://infrax.example/other','https://infrax.example/?query=1'])assert.throws(()=>createResearchClient({baseUrl}));});
test('HTTP session, permission and service failures are distinguishable',async()=>{
 for(const [status,code]of[[401,'signed_out'],[403,'forbidden'],[503,'unavailable']]){
  const load=createResearchClient({baseUrl:'https://infrax.example',fetchImpl:async()=>json({error:'secret internal message'},status)});
  await assert.rejects(load('TX'),error=>error.code===code&&!error.message.includes('secret'));
 }
});
test('HTML responses and malformed JSON are never rendered as research',async()=>{
 for(const response of [new Response('<html>login</html>',{headers:{'content-type':'text/html'}}),new Response('{bad',{headers:{'content-type':'application/json'}}),json({...payload(),data:[{...row(),sourceUrl:'javascript:alert(1)'}]})]){
  await assert.rejects(createResearchClient({baseUrl:'https://infrax.example',fetchImpl:async()=>response})('TX'),e=>e.code==='invalid_response');
 }
});
test('oversized response is cancelled before decoding',async()=>{
 let cancelled=false;const body=new ReadableStream({start(c){c.enqueue(new Uint8Array(70000));},cancel(){cancelled=true;}});
 const load=createResearchClient({baseUrl:'https://infrax.example',fetchImpl:async()=>new Response(body,{headers:{'content-type':'application/json'}})});
 await assert.rejects(load('TX'),e=>e.code==='invalid_response');assert.equal(cancelled,true);
});
test('caller abort stops a request; no raw error leaks',async()=>{
 const controller=new AbortController();controller.abort();let calls=0;
 const load=createResearchClient({baseUrl:'https://infrax.example',fetchImpl:async()=>{calls++;return json(payload());}});
 await assert.rejects(load('TX',{signal:controller.signal}),e=>e.code==='aborted');assert.equal(calls,0);
});
test('deadline becomes unavailable, not an empty region',async()=>{
 const load=createResearchClient({baseUrl:'https://infrax.example',timeoutMs:5,fetchImpl:async(_url,{signal})=>new Promise((_,reject)=>signal.addEventListener('abort',()=>reject(new Error('internal transport'))))});
 await assert.rejects(load('TX'),e=>e.code==='unavailable');
});
test('rapid region changes cannot display stale responses even if transport ignores cancellation',async()=>{
 const deferred={},states=[];const controller=createResearchController({load:region=>new Promise(resolve=>{deferred[region]=resolve;}),onChange:s=>states.push(s)});
 const tx=controller.select('TX'),va=controller.select('VA');deferred.VA(parseResearchResponse(payload('VA'),'VA'));await va;deferred.TX(parseResearchResponse(payload('TX'),'TX'));await tx;
 assert.equal(states.at(-1).region,'VA');assert.equal(states.filter(s=>s.status==='ready').length,1);controller.dispose();
});
test('disposing the mounted screen prevents a late session response from rendering',async()=>{
 let resolve;const states=[];const controller=createResearchController({load:()=>new Promise(r=>{resolve=r;}),onChange:s=>states.push(s)});
 const pending=controller.select('TX');controller.dispose();resolve(parseResearchResponse(payload(),'TX'));await pending;assert.equal(states.length,1);
});
test('access loss clears old content, never leaves privileged rows visible',async()=>{
 const states=[];const controller=createResearchController({load:async()=>{throw new ResearchClientError('forbidden');},onChange:s=>states.push(s)});
 await controller.select('TX');assert.equal(states.at(-1).status,'forbidden');assert.equal(states.at(-1).result,null);controller.dispose();
});
