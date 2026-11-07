/** Shared, dependency-free wire contract for web and native source review.
 * This validates evidence shapes, NOT user permissions or commercial availability.
 */
export const CONTEXT_SCHEMA='infrax-market-context-v2';
export const RESEARCH_WARNING='Internal source context only. Record counts are not data centers, available power or commercial offers.';
export const STATE_CODES=Object.freeze('AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY PR VI GU AS MP'.split(' '));
const rows=[
 ['eia860-generators-2025','2025','generator_inventory','https://www.eia.gov/electricity/data/eia860/xls/eia8602025.zip',['nameplate_capacity']],
 ['eia860m-generators-2026-09','2026-09','generator_inventory','https://www.eia.gov/electricity/data/eia860m/xls/september_generator2026.xlsx',['nameplate_capacity']],
 ['eia861-utility-counties-2025','2025','utility_county_report','https://www.eia.gov/electricity/data/eia861/zip/f8612025.zip',[]],
 ['eia923-generation-fuel-2025','2025','plant_fuel_generation','https://www.eia.gov/electricity/data/eia923/xls/f923_2025.zip',['electric_fuel_consumption','net_generation']],
 ['lbnl-queue-through-2025','through-2025','generator_queue_project','https://eta-publications.lbl.gov/sites/default/files/2026-05/lbnl_ix_queue_data_file_thru2025.xlsx',['component_1_capacity','component_2_capacity','component_3_capacity']],
 ['egrid-plants-2023-rev2','2023','plant_environmental_context','https://www.epa.gov/system/files/documents/2025-06/egrid2023_data_rev2.xlsx',['co2_output_rate','nameplate_capacity','net_generation']],
];
export const DATASETS=Object.freeze(Object.fromEntries(rows.map(([id,period,kind,url,metrics])=>[id,Object.freeze({period,kind,url,metrics:Object.freeze(metrics)})])));
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const integer=x=>Number.isSafeInteger(x)&&x>=0&&x<=10000000;
const hash=x=>typeof x==='string'&&/^[a-f0-9]{64}$/.test(x);
export function stateFilter(value='TX'){
 if(typeof value!=='string'||!STATE_CODES.includes(value))throw new TypeError('A supported state code is required');
 return value;
}
export function sourceLink(value){
 if(typeof value!=='string')return null;
 return Object.values(DATASETS).some(d=>d.url===value)?value:null;
}
function timestamp(value){
 if(value===null)return null;
 if(typeof value!=='string'||value.length>40||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,6})?(?:Z|[+-]\d{2}:\d{2})$/.test(value)||!Number.isFinite(Date.parse(value)))throw new TypeError('Invalid evidence timestamp');
 return value;
}
export function parseContextRow(row,expectedState){
 if(!object(row)||!Object.hasOwn(DATASETS,row.dataset))throw new TypeError('Unsupported dataset');
 const spec=DATASETS[row.dataset];
 if(stateFilter(row.state)!==stateFilter(expectedState)||row.period!==spec.period||row.entityKind!==spec.kind||row.sourceUrl!==spec.url||row.publication!=='internal_review'||row.isCapacityOffer!==false||row.normalizationVersion!=='infrax-context-v1')throw new TypeError('Inconsistent context identity');
 if(typeof row.title!=='string'||!row.title.trim()||row.title.length>250||/[\x00-\x1f]/.test(row.title)||!integer(row.recordCount)||!integer(row.distinctKeys)||row.distinctKeys>row.recordCount||!hash(row.sourceSha256)||!hash(row.outputSha256))throw new TypeError('Invalid source counts or provenance');
 if(!Array.isArray(row.quality)||row.quality.length>spec.metrics.length*3)throw new TypeError('Invalid quality fields');
 const seen=new Set(),totals=new Map();
 const quality=row.quality.map(q=>{
  if(!object(q)||!spec.metrics.includes(q.field)||!['reported','missing','invalid'].includes(q.status)||!integer(q.count)||q.count>row.recordCount)throw new TypeError('Invalid quality count');
  const key=q.field+':'+q.status;if(seen.has(key))throw new TypeError('Repeated quality field');seen.add(key);
  totals.set(q.field,(totals.get(q.field)??0)+q.count);
  return Object.freeze({field:q.field,status:q.status,count:q.count});
 });
 if(spec.metrics.some(field=>totals.get(field)!==row.recordCount))throw new TypeError('Quality totals must reconcile to source rows');
 return Object.freeze({dataset:row.dataset,state:row.state,period:row.period,title:row.title,
  recordCount:row.recordCount,distinctKeys:row.distinctKeys,entityKind:row.entityKind,
  sourceUrl:row.sourceUrl,sourceSha256:row.sourceSha256,outputSha256:row.outputSha256,
  normalizationVersion:row.normalizationVersion,sourceRetrievedAt:timestamp(row.sourceRetrievedAt),
  importedAt:timestamp(row.importedAt),quality:Object.freeze(quality),publication:'internal_review',isCapacityOffer:false});
}
export function parseResearchResponse(value,expectedState){
 const state=stateFilter(expectedState);
 if(!object(value)||value.schema!==CONTEXT_SCHEMA||value.state!==state||!Array.isArray(value.data)||value.data.length>rows.length||!['ready','empty'].includes(value.status)||(value.status==='empty')!==(value.data.length===0))throw new TypeError('Invalid research response');
 const data=value.data.map(row=>parseContextRow(row,state));
 if(new Set(data.map(row=>row.dataset)).size!==data.length)throw new TypeError('Repeated dataset');
 return Object.freeze({schema:CONTEXT_SCHEMA,status:value.status,state,data:Object.freeze(data),warning:RESEARCH_WARNING});
}
