import test from 'node:test';import assert from 'node:assert/strict';
import {normalizeFacilityExport} from './datacentermap-export.mjs';
const csv='Data Center ID,Data Center Name,Company Name,Country,City,Latitude,Longitude,Fully Built-Out Power (MW),Lifecycle Stage\n100,"New, York Facility",Operator,US,New York,40.7,-74.0,120,Operational\n101,Example 2,Operator,US,Dallas,,,18,Planned';
test('requires proof of licensed input before parsing',()=>assert.throws(()=>normalizeFacilityExport(csv),/LICENSED_EXPORT_REQUIRED/));
test('normalizes attributed unverified context, never contractable MW',()=>{
 const out=normalizeFacilityExport(csv,{licensed:true,sourceVersion:'paid-2026-11'});
 assert.equal(out.summary.accepted,2);assert.equal(out.accepted[0].name,'New, York Facility');
 assert.equal(out.accepted[0].builtOutPowerMw,120);assert.equal(out.accepted[0].availableCapacityMw,null);
 assert.equal(out.accepted[0].publicDiscoveryAllowed,false);assert.equal(out.summary.operatorOffersCreated,0);
 assert.equal(out.accepted[1].location,null);assert.match(out.checksum,/^[a-f0-9]{64}$/);
});
test('quarantines invalid and duplicate records',()=>{
 const out=normalizeFacilityExport(csv+'\n100,Duplicate,Operator,US,Dallas,90,20,4,Planned\n102,Bad GPS,Operator,US,Dallas,999,20,4,Planned\n103,Bad Power,Operator,US,Dallas,40,20,-1,Planned',{licensed:true});
 assert.equal(out.summary.accepted,2);assert.equal(out.summary.rejected,3);
});
test('rejects malformed, unexpected headers and empty files',()=>{
 assert.throws(()=>normalizeFacilityExport('ID,Name\n1,Test',{licensed:true}),/REQUIRED_COLUMNS_MISSING/);
 assert.throws(()=>normalizeFacilityExport('Data Center ID,Data Center Name,Country\n1,"Unclosed,US',{licensed:true}),/UNCLOSED_CSV_QUOTE/);
 assert.throws(()=>normalizeFacilityExport('Data Center ID,Data Center Name,Country\n',{licensed:true}),/EMPTY_EXPORT/);
});
