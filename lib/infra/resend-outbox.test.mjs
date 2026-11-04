import{test}from'node:test';import assert from'node:assert/strict';
import{createIntakeNotice,deliverIntakeNotice}from'./resend-outbox.mjs';
const receipt='550e8400-e29b-41d4-a716-446655440000',from='notify@example.com',to='ops@example.com';
test('minimal notification does not leak intake notes',()=>{
 const v=createIntakeNotice({referenceId:receipt,from,to});assert.ok(v.text.includes(receipt));
 assert.equal(v.text.includes('confidential engineering'),false);assert.match(v.idempotencyKey,/infrax-intake-received/);
});
test('send uses provider idempotency key',async()=>{
 const r=await deliverIntakeNotice({referenceId:receipt,apiKey:'key',from,to,
 fetchImpl:async(url,opts)=>{
  assert.equal(url,'https://api.resend.com/emails');
  assert.equal(opts.headers['Idempotency-Key'],'infrax-intake-received/'+receipt);
  return {ok:true,json:async()=>({id:'sent123'})};
 }});
 assert.equal(r.providerMessageId,'sent123');
});
test('missing sender and secret never sends',async()=>{
 assert.throws(()=>createIntakeNotice({referenceId:receipt,from:'not an email',to}));
 await assert.rejects(deliverIntakeNotice({referenceId:receipt,from,to}),/RESEND_API_KEY/);
});
