import {test} from 'node:test';import assert from 'node:assert/strict';
import {createAPI,ApiError,boundedJSON,scenarioInput,pageParameters} from './core.mjs';
import {connectionConfig} from './config.mjs';import {betterAuthIdentity} from './identity.mjs';import {createRepository} from './repository.mjs';
const origin='https://infrax.example';const id='11111111-1111-4111-8111-111111111111';
const request=(path='/',body,headers={})=>new Request(origin+path,{method:body===undefined?'GET':'POST',headers:{origin,...(body===undefined?{}:{'content-type':'application/json','idempotency-key':id}),...headers},...(body===undefined?{}:{body:JSON.stringify(body)})});
const fixture={userType:'developer',name:'A',email:'TEST@example.invalid',organization:'Org',regions:['TX'],consent:true};
const scenario={organizationId:id,name:'Scenario',requirements:{minimumItMw:5,maximumItMw:10,timelineMonths:12,regions:['TX']}};
const setup=(repository={},identity=async()=>({subject:'verified-subject'}))=>createAPI({repository,identity,publicOrigin:origin});
test('empty database is not unavailable or fake sample inventory',async()=>{
 const r=await setup({facilities:async()=>[]})(request('/?limit=25'),'facilities');
 assert.equal(r.status,200);const b=await r.json();assert.deepEqual(b.data,[]);assert.equal(b.status,'empty');assert.equal(b.metadata.dataMode,'database');
});
test('database outage yields 503 without credentials in error',async()=>{
 const r=await setup({signals:async()=>{throw Error('postgres://owner:secret@host');}})(request(),'signals');
 assert.equal(r.status,503);assert.doesNotMatch(await r.text(),/secret|owner|host/);
});
test('page size and UUID cursor are bounded',()=>{
 for(const query of ['limit=0','limit=101','limit=NaN','limit=1.5','after=DROP'])assert.throws(()=>pageParameters(new URL(origin+'/?'+query)));
});
test('pagination fetches an extra row and excludes it from results',async()=>{
 const r=await setup({facilities:async()=>[{id},{id:'2'}]})(request('/?limit=1'),'facilities');
 const b=await r.json();assert.equal(b.data.length,1);assert.equal(b.nextCursor,id);
});
test('intake requires consent, normalized email and an idempotency key',async()=>{
 let seen;const api=setup({submitIntake:async(input,key)=>{seen={input,key};return id;}});
 const response=await api(request('/',fixture),'intake');assert.equal(response.status,201);
 assert.equal(seen.input.email,'test@example.invalid');assert.equal(seen.key,id);
 assert.equal((await response.json()).notificationStatus,'queued');
 assert.equal((await api(request('/',{...fixture,consent:false}),'intake')).status,400);
});
test('client-supplied identity and role fields are rejected',async()=>{
 const api=setup({saveScenario:async()=>id});
 for(const field of ['subject','role','createdBy','userId'])assert.equal((await api(request('/',{...scenario,[field]:'admin'}),'scenarios')).status,400);
});
test('private save uses verified identity, not body org as authorization',async()=>{
 let received;const api=setup({saveScenario:async(subject,input)=>{received={subject,input};return id;}});
 assert.equal((await api(request('/',scenario),'scenarios')).status,201);assert.equal(received.subject,'verified-subject');
});
test('guest cannot list or save private scenarios',async()=>{
 let invoked=false;const api=setup({listScenarios:async()=>{invoked=true;return [];}},async()=>null);
 assert.equal((await api(request('/?organizationId='+id),'scenarios')).status,401);assert.equal(invoked,false);
});
test('SQL membership denial propagates as 403 without internal detail',async()=>{
 const r=await setup({listScenarios:async()=>{throw {code:'42501',message:'private table detail'};}})(request('/?organizationId='+id),'scenarios');
 assert.equal(r.status,403);assert.doesNotMatch(await r.text(),/private table/);
});
test('idempotency conflict and rate limit never look successful',async()=>{
 for(const [error,status] of [[{code:'22023'},409],[{code:'P0001',message:'INTAKE_RATE_LIMIT'},429]]){
  const r=await setup({submitIntake:async()=>{throw error;}})(request('/',fixture),'intake');assert.equal(r.status,status);
 }
});
test('cross-site requests rejected even with spoofed membership headers',async()=>{
 const r=await setup()(request('/',fixture,{origin:'https://evil.example','x-user-id':'admin'}),'intake');assert.equal(r.status,403);
});
test('actual body bytes enforce limit without Content-Length',async()=>{
 const r=request('/',{text:'x'.repeat(20000)});await assert.rejects(boundedJSON(r,100),(e)=>e.status===413);
});
test('unsupported content type rejected before SQL',async()=>{
 const r=request('/',fixture,{'content-type':'text/plain'});assert.equal((await setup()(r,'intake')).status,415);
});
test('scenario validates numeric types rather than silently coercing strings',()=>{
 assert.throws(()=>scenarioInput({...scenario,requirements:{...scenario.requirements,minimumItMw:'5'}}));
 assert.throws(()=>scenarioInput({...scenario,requirements:{...scenario.requirements,cooling:'fictional'}}));
});
const validEnv={INFRAX_ENV:'development',INFRAX_PUBLIC_ORIGIN:origin,INFRAX_RUNTIME_DATABASE_URL:'postgresql://infrax_api_development:test@ep-proud-resonance-bcwlhuyj-pooler.c-16.us-east-1.aws.neon.tech/infrax?sslmode=require'};
test('runtime config accepts only dedicated environment scoped role and host',()=>assert.equal(connectionConfig(validEnv).expectedRole,'infrax_api_development'));
test('owner, wrong branch, TLS disable and option overrides are rejected',()=>{
 for(const change of [u=>u.replace('infrax_api_development','infrax_owner'),u=>u.replace('ep-proud-resonance-bcwlhuyj','ep-restless-sky-bcs5wyfg'),u=>u.replace('sslmode=require','sslmode=disable'),u=>u+'&options=-crole%3Dinfrax_owner'])
  assert.throws(()=>connectionConfig({...validEnv,INFRAX_RUNTIME_DATABASE_URL:change(validEnv.INFRAX_RUNTIME_DATABASE_URL)}));
});
test('production remains disabled and an unknown environment cannot default to production',()=>{
 assert.throws(()=>connectionConfig({...validEnv,INFRAX_ENV:'production'}));assert.throws(()=>connectionConfig({...validEnv,INFRAX_ENV:'qa'}));
});
test('fixed auth origin prevents cookie exfiltration',async()=>{
 let sent=false;const identity=betterAuthIdentity({baseURL:'https://evil.example/api/auth',publicOrigin:origin,fetchImpl:async()=>{sent=true;}});
 await assert.rejects(identity(request('/',undefined,{cookie:'secret'})),e=>e.status===503);assert.equal(sent,false);
});
test('verified session requires matching subject and future expiry',async()=>{
 const identity=betterAuthIdentity({baseURL:origin+'/api/payload/auth',publicOrigin:origin,now:()=>new Date('2026-11-06'),fetchImpl:async(url,options)=>{
  assert.equal(url.searchParams.get('disableCookieCache'),'true');assert.equal(options.redirect,'error');
  return Response.json({user:{id:'42',role:'admin'},session:{userId:'42',expiresAt:'2026-12-01'}});
 }});
 assert.deepEqual(await identity(request('/',undefined,{cookie:'opaque-session'})),{subject:'42'});
});
test('expired or mismatched identity is rejected',async()=>{
 for(const session of [{userId:'42',expiresAt:'2000-01-01'},{userId:'other',expiresAt:'2099-01-01'}]){
  const identity=betterAuthIdentity({baseURL:origin+'/api/auth',publicOrigin:origin,fetchImpl:async()=>Response.json({user:{id:'42'},session})});
  await assert.rejects(identity(request('/',undefined,{cookie:'opaque'})),e=>e.status===401);
 }
});
test('session refresh is not silently lost by a server-side reader',async()=>{
 const identity=betterAuthIdentity({baseURL:origin+'/api/auth',publicOrigin:origin,fetchImpl:async()=>Response.json({}, {headers:{'set-cookie':'s=x'}})});
 await assert.rejects(identity(request('/',undefined,{cookie:'s=y'})),e=>e.status===503);
});
test('all public queries are parameterized and limited to vetted views',async()=>{
 const queries=[];const repository=createRepository({query:async(sql,params)=>{queries.push({sql,params});return [];}});
 await repository.facilities({limit:25,after:null});await repository.signals({limit:10,after:id});
 assert.match(queries[0].sql,/infra_api.facilities/);assert.match(queries[1].sql,/infra_api.signals/);
 assert.deepEqual(queries[1].params,[id,11]);assert.doesNotMatch(queries[0].sql,/SELECT \*/);
});
test('no receipt is reported when a write returns no row',async()=>{
 await assert.rejects(createRepository({query:async()=>[]}).submitIntake({},id));
});
test('readiness does not claim complete application readiness',async()=>{
 const r=await setup({readiness:async()=>{}})(request(),'readiness');assert.deepEqual(await r.json(),{databaseReady:true,applicationReady:false});
});

test('Better Auth null session is sign-in required, not a successful identity',async()=>{
 const identity=betterAuthIdentity({baseURL:origin+'/api/auth',publicOrigin:origin,fetchImpl:async()=>Response.json(null)});
 await assert.rejects(identity(request('/',undefined,{cookie:'old-session'})),e=>e.status===401);
});
