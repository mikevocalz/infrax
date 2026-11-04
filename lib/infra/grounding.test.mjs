import{test}from'node:test';import assert from'node:assert/strict';
import{verifiedSourceRows,evidencePrompt}from'./grounding.mjs';
const ok={publication_status:'published',reviewed_at:'2026-11-03',redistribution_approved:true,license_reviewed_at:'2026-11-03',allowed_usage:'attributed_public',source_url:'https://eia.gov/record',headline:'Regional demand update'};
test('restricted or unreviewed sources cannot reach the model',()=>{
 const r=verifiedSourceRows([ok,{...ok,allowed_usage:'internal'},{...ok,reviewed_at:null},{...ok,source_url:'http://private'}]);
 assert.equal(r.length,1);
});
test('grounding forbids unsupported availability and citations enumerated',()=>{
 const text=evidencePrompt('What is known?',[{headline:'Regional demand',sourceUrl:'https://eia.gov',publishedAt:'2026-11-03'}]);
 assert.match(text,/Never claim actual site-deliverable MW/);assert.match(text,/\[1\]/);
 assert.throws(()=>evidencePrompt('',[]));
});
