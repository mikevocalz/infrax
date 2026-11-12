import test from 'node:test';import assert from 'node:assert/strict';
import {RADAR_OUTAGES_URL,normalizeRadarAnnotation,parseRadarOutages,fetchRadarOutages} from './cloudflare-radar.mjs';
const event={id:'test-incident',startDate:'2026-11-01T08:00:00Z',endDate:'2026-11-01T10:00:00Z',locations:['US'],asns:[13335],outage:{outageType:'REGIONAL',outageCause:'UNKNOWN'},description:'Reported connectivity incident'};
test('outages do not become facility downtime or capacity values',()=>{
 const x=normalizeRadarAnnotation(event);assert.equal(x.category,'network_outage');assert.equal(x.facilityOutageConfirmed,false);assert.equal(x.capacityAvailableMw,null);assert.equal(x.countries[0],'US');
});
test('rejects malformed, duplicates and impossible intervals',()=>{
 const r=parseRadarOutages({result:{annotations:[event,event,{...event,id:'bad',startDate:'2026-11-04',endDate:'2026-11-01'},{}]}});
 assert.equal(r.events.length,1);assert.equal(r.rejected.length,3);assert.equal(r.publications,0);
});
test('fails closed with no token, no permission, wrong MIME or HTTP failure',async()=>{
 await assert.rejects(fetchRadarOutages({token:'sampletoken1234'}),/RADAR_LICENSE_REVIEW_REQUIRED/);
 await assert.rejects(fetchRadarOutages({token:'',licenseReviewed:true}),/RADAR_TOKEN_REQUIRED/);
 await assert.rejects(fetchRadarOutages({token:'sampletoken1234',licenseReviewed:true,fetchImpl:async()=>({ok:false})}),/RADAR_REQUEST_FAILED/);
 await assert.rejects(fetchRadarOutages({token:'sampletoken1234',licenseReviewed:true,fetchImpl:async()=>({ok:true,headers:new Headers({'content-type':'text/html'})})}),/RADAR_CONTENT_TYPE_INVALID/);
});
test('only requests exact Radar URL and never publishes automatically',async()=>{
 let request;
 const result=await fetchRadarOutages({token:'sampletoken1234',licenseReviewed:true,fetchImpl:async(url,opts)=>{request={url,opts};return new Response(JSON.stringify({success:true,result:{annotations:[event]}}),{headers:{'content-type':'application/json'}})}});
 assert.equal(request.url,RADAR_OUTAGES_URL);assert.equal(request.opts.redirect,'error');
 assert.equal(result.events.length,1);assert.equal(result.publications,0);assert.match(result.checksum,/^[a-f0-9]{64}$/);
 assert.equal(result.events[0].publicationStatus,'internal_review');
});
