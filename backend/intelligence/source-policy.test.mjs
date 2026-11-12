import test from 'node:test';
import assert from 'node:assert/strict';
import {SOURCES,assertSourcePermission,sourceToPublicStatus,classifyEvidence} from './source-policy.mjs';
const provider='datacentermap-directory';
const license={provider,allowed_usage:'internal',reviewed_at:'2026-11-12T12:00:00Z',redistribution_approved:false};
test('six providers registered and restricted by default',()=>{assert.equal(Object.keys(SOURCES).length,6);for(const source of Object.values(SOURCES))assert.equal(source.right,'restricted');});
test('unknown and not-yet-reviewed sources fail closed',()=>{
 assert.throws(()=>assertSourcePermission({provider:'other',license}),/UNREGISTERED_SOURCE/);
 assert.throws(()=>assertSourcePermission({provider,license:{...license,reviewed_at:null}}),/SOURCE_LICENSE_REVIEW_REQUIRED/);
 assert.throws(()=>assertSourcePermission({provider,license:{...license,allowed_usage:'restricted'}}),/SOURCE_ACCESS_RESTRICTED/);
});
test('internal license cannot authorize redistribution',()=>{
 assert.equal(assertSourcePermission({provider,license,action:'ingest'}),true);
 assert.throws(()=>assertSourcePermission({provider,license,action:'publish'}),/REDISTRIBUTION_NOT_APPROVED/);
 assert.throws(()=>assertSourcePermission({provider,license,action:'delete'}),/UNSUPPORTED_SOURCE_ACTION/);
});
test('public display requires reviewed and explicitly approved terms',()=>{
 assert.equal(sourceToPublicStatus({provider,license,records:200}).records,0);
 const publicLicense={...license,allowed_usage:'licensed_public',redistribution_approved:true};
 assert.equal(sourceToPublicStatus({provider,license:publicLicense,records:200}).records,200);
 assert.equal(assertSourcePermission({provider,license:publicLicense,action:'publish'}),true);
});
test('facility and network reports cannot become verified power or outages',()=>{
 assert.equal(classifyEvidence({kind:'facility_directory',mw:120}),'facility_context_not_contractable_capacity');
 assert.equal(classifyEvidence({kind:'network_outage'}),'network_observation_not_facility_outage');
 assert.equal(classifyEvidence({kind:'operator_offer',operator_authorized:true,verified_at:'2026-11-01',expires_at:'2000-01-01'}),'unverified_context');
});
