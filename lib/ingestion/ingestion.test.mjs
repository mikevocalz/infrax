import {test} from 'node:test';import assert from 'node:assert/strict';
import {eiaRetailSalesUrl,readEiaRetailSales} from './eia.mjs';
import {readErcotReport} from './ercot.mjs';
import {geojsonDiscoveryFeatures} from './public-geography.mjs';
import {fingerprint,ingestBatch} from './pipeline.mjs';
test('EIA URL is typed and includes market context only',()=>{
 const u=eiaRetailSalesUrl({apiKey:'test',state:'TX',sector:'COM'});
 assert.equal(u.origin,'https://api.eia.gov');assert.equal(u.searchParams.get('facets[stateid][]'),'TX');assert.throws(()=>eiaRetailSalesUrl({apiKey:'',state:'TX'}));
});
test('EIA decoder excludes corrupt prices and never claims site availability',async()=>{
 const rows=await readEiaRetailSales({apiKey:'test',fetchImpl:async()=>({ok:true,json:async()=>({response:{data:[{period:'2026-01',price:'12.5'},{period:'bad',price:'10'}]}})})});
 assert.equal(rows.length,1);assert.equal(rows[0].unit,'cents_per_kwh');assert.equal(rows[0].publicationStatus,'not_reviewed');assert.ok(!('deliverableMW' in rows[0]));
});
test('ERCOT transport requires approved host and credentials',async()=>{
 await assert.rejects(readErcotReport({endpoint:'https://evil.example/report',subscriptionKey:'a',accessToken:'b'}));
 await assert.rejects(readErcotReport({endpoint:'https://api.ercot.com/report'}));
});
test('geography cannot masquerade as verified availability',()=>{
 const [site]=geojsonDiscoveryFeatures({type:'FeatureCollection',features:[{type:'Feature',id:'f1',geometry:{type:'Point',coordinates:[-96,32]},properties:{name:'Example'}}]}, {sourceUrl:'https://example.com/features',license:'ODbL'});
 assert.equal(site.sellableCapacityMw,null);assert.equal(site.verifiedFacility,false);
});
test('ingestion writes hashes, no auto-publication, rejects malformed row',async()=>{
 const saved=[];const result=await ingestBatch({provider:'EIA',sourceUrl:'https://api.eia.gov/v2',license:{provider:'EIA'},rows:[{externalKey:'key1',value:5},{value:7}],repository:{writeSourceRecord:async r=>saved.push(r)}});
 assert.deepEqual([result.imported,result.rejected],[1,1]);assert.equal(saved[0].publicRedistributionApproved,false);assert.equal(saved[0].contentSha256,fingerprint({externalKey:'key1',value:5}));
});
