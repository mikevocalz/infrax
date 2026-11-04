import {test} from 'node:test';import assert from 'node:assert/strict';
import {assertRequirement,scoreRequirements,scoreOne} from './scoring-core.mjs';
const base={powerMinMW:5,powerMaxMW:10,timelineMonths:12,geography:[],coolingType:'any',requiredCertifications:[],redundancy:'any',preferredTier:null,networkDiversityRequired:false,renewableEnergyPreferred:false,offMarketOk:true,expandabilityTargetMW:20,weights:{power:35,location:20,timeline:20,cooling:10,cost:10,expansion:5}};
const c={id:'a',region:'DFW',market:'Dallas',status:'available',availableMW:20,deliverableMW:8,availableMonths:6,coolingTypes:['liquid'],certifications:['SOC2'],tier:3,carriers:['ATT','Lumen'],fiberRoutes:2,redundancy:'N+1',offMarket:false,expandableMW:30,gridRiskLevel:'low',dataConfidence:99};
test('no candidates is empty, not synthetic candidates',()=>assert.deepEqual(scoreRequirements(base),[]));
test('zero and inverted MW are rejected',()=>{assert.throws(()=>assertRequirement({...base,powerMinMW:0}));assert.throws(()=>assertRequirement({...base,powerMaxMW:4}));});
test('unverified never qualifies for strong or viable',()=>{const s=scoreOne(base,c);assert.equal(s.recommendation,'conditional');assert.equal(s.dataConfidence,0);assert.equal(s.estimatedMonthlyKw,0);});
test('all policy flags affect eligibility',()=>{
 assert.equal(scoreOne({...base,networkDiversityRequired:true}, {...c,fiberRoutes:1}).hardConstraintsMet,false);
 assert.equal(scoreOne({...base,offMarketOk:false}, {...c,offMarket:true}).hardConstraintsMet,false);
 assert.equal(scoreOne({...base,preferredTier:4},c).hardConstraintsMet,false);
 assert.equal(scoreOne({...base,redundancy:'2N'},c).hardConstraintsMet,false);
 assert.equal(scoreOne(base,{...c,status:'committed'}).hardConstraintsMet,false);
});
test('expiry invalidates apparent verification',()=>{
 const r=scoreOne(base,{...c,availabilityVerificationStatus:'independently_verified',offerVerifiedAt:'2026-10-01',offerValidUntil:'2026-11-01'},new Date('2026-11-04'));
 assert.equal(r.recommendation,'conditional');
});
test('valid verified offer allows a viable or strong rating',()=>{
 const r=scoreOne(base,{...c,availabilityVerificationStatus:'independently_verified',offerVerifiedAt:'2026-10-01',offerValidUntil:'2026-12-01'},new Date('2026-11-04'));
 assert.ok(['strong','viable','conditional'].includes(r.recommendation));assert.equal(r.dataConfidence,99);
});
