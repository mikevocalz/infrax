import test from 'node:test';import assert from 'node:assert/strict';import{readFileSync}from'node:fs';
const sql=readFileSync(new URL('../migrations/20261112_011_external_intelligence_quarantine.sql',import.meta.url),'utf8');
test('new tables start private and cannot claim available capacity',()=>{
 assert.match(sql,/CREATE TABLE IF NOT EXISTS infra\.external_facility_leads/);
 assert.match(sql,/CREATE TABLE IF NOT EXISTS infra\.external_network_incidents/);
 assert.match(sql,/public_discovery_allowed boolean NOT NULL DEFAULT false CHECK\(public_discovery_allowed = false\)/);
 assert.match(sql,/facility_outage_confirmed boolean NOT NULL DEFAULT false CHECK\(facility_outage_confirmed=false\)/);
 assert.doesNotMatch(sql,/available_capacity_mw/i);
});
test('provider provenance, uniqueness and private role revocation are mandatory',()=>{
 assert.equal((sql.match(/license_id uuid NOT NULL REFERENCES infra\.source_licenses\(id\)/g)||[]).length,2);
 assert.equal((sql.match(/UNIQUE\(license_id,external_key\)/g)||[]).length,2);
 assert.match(sql,/REVOKE ALL ON infra\.external_facility_leads,infra\.external_network_incidents FROM PUBLIC/);
 assert.match(sql,/REVOKE ALL ON infra\.external_facility_leads,infra\.external_network_incidents FROM infrax_runtime/);
});
