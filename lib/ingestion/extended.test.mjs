import{test}from'node:test';import assert from'node:assert/strict';
import{fetchNoaaObservations,noaaClimateUrl}from'./noaa.mjs';
import{fetchUsgsWaterContext,usgsWaterUrl}from'./usgs.mjs';
import{approvedHifldUrl,fetchHifldPage}from'./hifld.mjs';
import{approvedPjmUrl}from'./pjm.mjs';
test('NOAA requires real token and returns source-labeled observations',async()=>{
 assert.throws(()=>noaaClimateUrl({stationId:'A',startDate:'2026-11-02',endDate:'2026-11-01'}));
 const r=await fetchNoaaObservations({token:'test',stationId:'GHCND:ABC',startDate:'2026-01-01',endDate:'2026-01-02',
 fetchImpl:async()=>({ok:true,json:async()=>({results:[{station:'GHCND:ABC',datatype:'TAVG',value:25,date:'2026-01-01'}]})})});
 assert.equal(r[0].siteCoolingRightsConfirmed,false);
});
test('USGS path allowlisting avoids arbitrary proxy and water rights claims',async()=>{
 assert.throws(()=>usgsWaterUrl({path:'https://evil.example'}));
 const r=await fetchUsgsWaterContext({fetchImpl:async()=>({ok:true,json:async()=>({collections:[]})})});
 assert.equal(r.waterRightsConfirmed,false);
});
test('HIFLD refuses unrelated hosts, preserves pagination without MW inference',async()=>{
 assert.throws(()=>approvedHifldUrl({serviceUrl:'https://evil.example/FeatureServer/0/query'}));
 const serviceUrl='https://services1.arcgis.com/a/ArcGIS/rest/services/Transmission_Lines/FeatureServer/0/query';
 const r=await fetchHifldPage({serviceUrl,fetchImpl:async()=>({ok:true,json:async()=>({features:[],exceededTransferLimit:false})})});
 assert.deepEqual(r.features,[]);assert.equal(r.isCurrentPowerAvailability,false);
});
test('PJM requires approved redistribution',()=>{
 assert.throws(()=>approvedPjmUrl({endpoint:'https://api.pjm.com/api/v1/somefeed'}));
 assert.equal(approvedPjmUrl({endpoint:'https://api.pjm.com/api/v1/somefeed',distributionApproved:true}).hostname,'api.pjm.com');
});
