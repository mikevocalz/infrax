/** Staff authorization remains server-side; transport validation is shared with native/web. */
import {CONTEXT_SCHEMA,RESEARCH_WARNING,parseContextRow,stateFilter,sourceLink} from '../client/research-contract.mjs';
export {CONTEXT_SCHEMA,stateFilter,sourceLink};
export function summarizeRow(row,expectedState=row?.state){
 const d=row?.summary;
 if(!d||typeof d!=='object'||Array.isArray(d)||d.commercial_offer!==false||d.publication_approved!==false||d.dataset!==row.dataset||d.state!==row.state||d.observation_period!==row.period)throw new TypeError('Inconsistent stored evidence');
 if(!d.metric_quality||typeof d.metric_quality!=='object'||Array.isArray(d.metric_quality))throw new TypeError('Invalid quality object');
 const quality=Object.entries(d.metric_quality).map(([key,count])=>{
  if(!/^[a-z0-9_]+:(reported|missing|invalid)$/.test(key))throw new TypeError('Invalid quality key');
  const [field,status]=key.split(':');return {field,status,count};
 });
 return parseContextRow({dataset:row.dataset,state:row.state,period:row.period,title:d.source_title,
  recordCount:d.normalized_rows,distinctKeys:d.distinct_entity_keys,entityKind:d.entity_kind,
  sourceUrl:d.source_url,sourceSha256:d.source_package_sha256,outputSha256:d.output_sha256,
  normalizationVersion:d.normalization_version,sourceRetrievedAt:d.source_retrieved_at??null,
  importedAt:row.imported_at instanceof Date?row.imported_at.toISOString():row.imported_at??null,
  quality,publication:'internal_review',isCapacityOffer:false},expectedState);
}
export function createResearchAPI({identity,load}){
 return async request=>{
  const reply=(status,body)=>Response.json(body,{status,headers:{'Cache-Control':'no-store','Vary':'Cookie','X-Content-Type-Options':'nosniff',...(status===405?{Allow:'GET'}:{})}});
  if(request.method!=='GET')return reply(405,{error:'METHOD_NOT_ALLOWED'});
  try{
   const session=await identity(request);
   if(!session?.user?.id)return reply(401,{error:'SIGN_IN_REQUIRED'});
   if(session.user.role!=='admin')return reply(403,{error:'STAFF_ACCESS_REQUIRED'});
   let state;try{const params=new URL(request.url).searchParams;if([...params.keys()].some(k=>k!=='state')||params.getAll('state').length>1)throw Error();state=stateFilter(params.get('state')??'TX');}catch{return reply(400,{error:'INVALID_STATE'});}
   const rows=await load(state);
   if(!Array.isArray(rows)||rows.length>6)throw new TypeError('Unexpected context row count');
   const data=rows.map(row=>summarizeRow(row,state));
   if(new Set(data.map(row=>row.dataset)).size!==data.length)throw new TypeError('Duplicate dataset');
   return reply(200,{schema:CONTEXT_SCHEMA,status:data.length?'ready':'empty',state,data,warning:RESEARCH_WARNING});
  }catch{return reply(503,{error:'RESEARCH_UNAVAILABLE'});}
 };
}
