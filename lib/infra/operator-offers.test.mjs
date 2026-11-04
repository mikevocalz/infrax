import{test}from'node:test';import assert from'node:assert/strict';
import{validateOffer,submitOperatorOffer,approveOperatorOffer,canViewOffer}from'./operator-offers.mjs';
const input={facilityId:'facility',operatorId:'operator',product:'colocation',criticalItMw:15,deliveryDate:'2027-01-01',disclosure:'public'};
test('operator submissions always begin restricted',()=>{
 const v=validateOffer(input);assert.equal(v.disclosure,'restricted');assert.equal(v.verifiedAt,null);
 assert.throws(()=>validateOffer({...input,criticalItMw:-1}));
});
test('submission fails closed without operator authorization',async()=>{
 await assert.rejects(submitOperatorOffer({actor:{subject:'x'},input,authorize:async()=>false,repository:{insertRestrictedOffer:()=>({})}}),/Not authorized/);
});
test('reviewer approval requires evidence and future expiry',async()=>{
 const repo={approveRestrictedOffer:async v=>v};
 await assert.rejects(approveOperatorOffer({reviewer:{subject:'analyst'},offerId:'offer',evidenceClaimId:'x',validUntil:'2020-01-01',authorize:async()=>true,repository:repo}));
 const v=await approveOperatorOffer({reviewer:{subject:'analyst'},offerId:'offer',evidenceClaimId:'x',validUntil:'2028-01-01',authorize:async()=>true,repository:repo,now:new Date('2026-11-04')});
 assert.equal(v.disclosure,'restricted');
});
test('confidential approved supply is never public by default',()=>{
 const offer={status:'approved',verified_at:'2026-01-01',expires_at:'2030-01-01',disclosure:'restricted'};
 assert.equal(canViewOffer({offer}),false);
 assert.equal(canViewOffer({actor:{subject:'buyer'},offer,authorize:()=>false}),false);
});
