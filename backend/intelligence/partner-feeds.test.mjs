import test from 'node:test';import assert from 'node:assert/strict';
import {PARTNERS,acquisitionChecklist,assertPartnerRights,normalizePartnerEvidence} from './partner-feeds.mjs';
test('four partner sources are never acquired without agreement',()=>{
 assert.equal(Object.keys(PARTNERS).length,4);
 for(const p of Object.values(PARTNERS)){assert.equal(acquisitionChecklist(p.provider).ready,false);assert.throws(()=>assertPartnerRights(p.provider),/PARTNER_RIGHTS_REQUIRED/);}
});
test('license is provider-specific and publication requires explicit terms',()=>{
 const p=PARTNERS.peeringdb;const grant={provider:p.provider,reviewed:true,...Object.fromEntries(p.needs.map(k=>[k,true]))};
 assert.equal(assertPartnerRights(p.provider,grant),true);
 assert.throws(()=>assertPartnerRights(p.provider,{...grant,provider:'cloudscene-directory'}),/PARTNER_RIGHTS_REQUIRED/);
 assert.throws(()=>assertPartnerRights(p.provider,grant,'publish'),/NO_REDISTRIBUTION_PERMISSION/);
 assert.equal(assertPartnerRights(p.provider,{...grant,redistributionApproved:true},'publish'),true);
});
test('all partner observations remain pending context, not capacity or facility outage',()=>{
 const p=PARTNERS.netblocks;const grant={provider:p.provider,reviewed:true,...Object.fromEntries(p.needs.map(k=>[k,true]))};
 const e=normalizePartnerEvidence(p.provider,{externalId:'incident-123',observedAt:'2026-11-12T00:00:00Z',summary:'Example'},grant);
 assert.equal(e.publicAllowed,false);assert.equal(e.reviewStatus,'pending');assert.equal(e.availableCapacityMw,null);assert.equal(e.facilityOutageConfirmed,false);
 assert.throws(()=>normalizePartnerEvidence(p.provider,{externalId:'',observedAt:'2026-11-12'},grant),/PARTNER_RECORD_INVALID/);
});
