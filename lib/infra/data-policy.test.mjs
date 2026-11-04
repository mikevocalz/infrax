import { test } from 'node:test';
import assert from 'node:assert/strict';
import { canPublishSource, claimState, publicFacilityProjection, validatePublicSignal } from './data-policy.mjs';
test('licensing requires explicitly reviewed public redistribution', () => {
 assert.equal(canPublishSource({allowed_usage:'internal', redistribution_approved:true,reviewed_at:'2026-11-04'}),false);
 assert.equal(canPublishSource({allowed_usage:'licensed_public',redistribution_approved:true,reviewed_at:'2026-11-04'}),true);
});
test('restricted claims and drafts never leave public projection', () => {
 const f={id:'f1',canonical_name:'Example',public_discovery_allowed:true};
 const result=publicFacilityProjection(f,[{field_key:'contract_terms',value_json:'secret',disclosure:'restricted'},{field_key:'region',value_json:'TX',disclosure:'public',verification_status:'publicly_reported'}],
 [{id:'o1',status:'draft',critical_it_mw:20,disclosure:'public',verified_at:'2026-11-01',expires_at:'2027-01-01'}]);
 assert.equal(result.claims.length,1);assert.deepEqual(result.offers,[]);
 assert.equal(publicFacilityProjection({...f,public_discovery_allowed:false}),null);
});
test('expired claims and feed publications are suppressed',()=>{
 assert.equal(claimState({verification_status:'independently_verified',valid_until:'2026-01-01'},new Date('2026-11-04')),'expired');
 assert.equal(validatePublicSignal({publication_status:'published',reviewed_at:'2026-11-01',expires_at:'2026-11-02'}, {source_url:'https://example.org',retrieved_at:'2026-11-01'},{allowed_usage:'attributed_public',redistribution_approved:true,reviewed_at:'2026-11-01'},new Date('2026-11-04')),false);
});
