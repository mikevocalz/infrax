import {test} from 'node:test';import assert from 'node:assert/strict';import {randomBytes} from 'node:crypto';
if(process.env.CI!=='true'||process.env.INFRAX_CMS_TEST_MODE!=='1')throw new Error('Run only against disposable CI');
const base='http://127.0.0.1:3000';
async function call(path,{cookie,body,method='GET'}={}){
 const response=await fetch(base+path,{method,headers:{Origin:base,...(cookie?{Cookie:cookie}:{}),...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{}),redirect:'manual'});
 let data=null;try{data=await response.json();}catch{}
 return {response,data};
}
function cookies(response){return response.headers.getSetCookie().map(s=>s.split(';')[0]).join('; ');}
test('real Payload/Better Auth HTTP lifecycle and publication isolation',async t=>{
 const email='infrax-ci-'+randomBytes(6).toString('hex')+'@example.invalid';
 const password='Ci-only!'+randomBytes(20).toString('hex');
 let cookie='',id;
 await t.test('anonymous session is not a trusted identity',async()=>{const r=await call('/api/auth/get-session');assert.equal(r.response.status,200);assert.equal(r.data,null);});
 await t.test('first signup is a normal user, not administrator',async()=>{
  const r=await call('/api/auth/sign-up/email',{method:'POST',body:{name:'CI test person',email,password,role:'admin'}});
  assert.equal(r.response.status,200);assert.equal(r.data.user.role,'user');cookie=cookies(r.response);id=String(r.data.user.id);assert.ok(cookie);
 });
 await t.test('real database session can be restored',async()=>{const r=await call('/api/auth/get-session',{cookie});assert.equal(r.response.status,200);assert.equal(String(r.data.user.id),id);assert.equal(r.data.user.role,'user');});
 await t.test('anonymous and ordinary users cannot create privileged users through Payload',async()=>{
  for(const session of ['',cookie]){const r=await call('/api/users',{method:'POST',cookie:session,body:{email:'forbidden@example.invalid',name:'Forbidden',role:'admin'}});assert.ok([401,403].includes(r.response.status));}
 });
 await t.test('ordinary users cannot promote themselves',async()=>{const r=await call('/api/users/'+id,{method:'PATCH',cookie,body:{role:'admin'}});assert.ok([401,403].includes(r.response.status));const session=await call('/api/auth/get-session',{cookie});assert.equal(session.data.user.role,'user');});
 await t.test('operator review data is staff-only',async()=>{const r=await call('/api/operator-reviews',{cookie});assert.ok([401,403].includes(r.response.status));});
 await t.test('public content includes only published records',async()=>{const r=await call('/api/site-pages?limit=50');assert.equal(r.response.status,200);assert.deepEqual(r.data.docs.map(d=>d.slug),['ci-published']);});
 await t.test('ordinary user cannot publish a page',async()=>{const r=await call('/api/site-pages',{method:'POST',cookie,body:{title:'No',slug:'no',publicationStatus:'published'}});assert.ok([401,403].includes(r.response.status));});
 await t.test('sign-out revokes the session, including reuse of the old cookie',async()=>{const r=await call('/api/auth/sign-out',{method:'POST',cookie,body:{}});assert.equal(r.response.status,200);const after=await call('/api/auth/get-session',{cookie});assert.equal(after.data,null);});
});
