import{test}from'node:test';import assert from'node:assert/strict';
import{parseIntake}from'./intake-validation.mjs';
const input={userType:'developer',name:'A Buyer',organization:'Example Inc',email:'BUYER@example.org',consent:true,regions:['TX']};
test('normalized and bounded valid form',()=>{const r=parseIntake(input);assert.equal(r.email,'buyer@example.org');assert.deepEqual(r.payload.regions,['TX']);});
test('reject invalid user type, missing consent and invalid email',()=>{
 for(const override of [{userType:'superadmin'},{consent:false},{email:'bad'}])assert.throws(()=>parseIntake({...input,...override}));
});
