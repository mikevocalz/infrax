import{test}from'node:test';import assert from'node:assert/strict';
import{saveScenario,watchMarketSignal,requestDiligence,buildEvidenceDossier}from'./workflows.mjs';
const actor={subject:'user',organizationId:'org'};
test('no private scenario persistence without tenant authorization',async()=>{
 await assert.rejects(saveScenario({actor,scenario:{name:'Test',minimumItMw:5},authorize:async()=>false,repository:{saveScenarioVersion:async()=>1}}));
 const result=await saveScenario({actor,scenario:{name:'Test',minimumItMw:5},authorize:async()=>true,repository:{saveScenarioVersion:async value=>value}});
 assert.equal(result.organizationId,'org');assert.equal(result.verifiedResultsOnly,true);
});
test('draft signals cannot be watched',async()=>{
 await assert.rejects(watchMarketSignal({actor,signal:{id:'signal',publication_status:'draft'},authorize:async()=>true,repository:{upsertWatch:async()=>true}}));
});
test('request diligence is not a fabricated report',async()=>{
 const result=await requestDiligence({actor,facilityId:'facility',notes:'Review power rights',authorize:async()=>true,repository:{createDiligenceRequest:async value=>value}});
 assert.equal(result.reportStatus,'not_generated');assert.equal(result.status,'submitted');
});
test('dossier preserves unresolved evidence',()=>{
 const d=buildEvidenceDossier({caseId:'a',reviewedBy:'analyst',claimRows:[{field:'power_mw',value:10,review_status:'approved',source_url:'https://utility.example',unit:'MW'},{field:'interconnect',review_status:'pending'}]});
 assert.equal(d.status,'incomplete');assert.equal(d.unresolved.length,1);assert.equal(d.claims.length,1);
});
