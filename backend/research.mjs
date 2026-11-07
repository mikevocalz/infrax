/** Internal source review only. identity must come from the server's Better Auth session. */
export const CONTEXT_SCHEMA = 'infrax-market-context-v1';
const STATES=new Set('AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY PR VI GU AS MP'.split(' '));
const HOSTS=new Set(['www.eia.gov','www.epa.gov','eta-publications.lbl.gov']);
export function stateFilter(value='TX') {
 if(typeof value!=='string'||!STATES.has(value))throw new TypeError('A supported state code is required');
 return value;
}
export function sourceLink(value){
 try{const u=new URL(value);return u.protocol==='https:'&&HOSTS.has(u.hostname)&&!u.username&&!u.password&&!u.port?u.href:null;}catch{return null;}
}
export function summarizeRow(row){
 const d=row?.summary;
 if(!d||typeof d!=='object'||d.commercial_offer!==false||d.publication_approved!==false||!sourceLink(d.source_url)||!Number.isSafeInteger(d.normalized_rows)||d.normalized_rows<0||!Number.isSafeInteger(d.distinct_entity_keys)||d.distinct_entity_keys<0||d.distinct_entity_keys>d.normalized_rows)throw new TypeError('Invalid context summary');
 if(typeof d.source_title!=='string'||!d.source_title||!/^[a-f0-9]{64}$/.test(d.source_package_sha256)||typeof row.dataset!=='string'||!row.dataset||typeof row.period!=='string'||!row.period)throw new TypeError('Missing source identity');
 const quality=Object.entries(d.metric_quality??{}).map(([key,count])=>{
  if(!/^[a-z0-9_]+:(reported|missing|invalid)$/.test(key)||!Number.isSafeInteger(count)||count<0)throw new TypeError('Invalid evidence quality');
  return {field:key.split(':')[0],status:key.split(':')[1],count};
 });
 return {dataset:row.dataset,state:stateFilter(row.state),period:row.period,title:String(d.source_title),
  recordCount:d.normalized_rows,distinctKeys:d.distinct_entity_keys,entityKind:String(d.entity_kind),
  sourceUrl:sourceLink(d.source_url),sourceSha256:String(d.source_package_sha256),normalizationVersion:String(d.normalization_version),
  quality,publication:'internal_review',isCapacityOffer:false};
}
export function createResearchAPI({identity,load}){
 return async request=>{
  const reply=(status,body)=>Response.json(body,{status,headers:{'Cache-Control':'no-store','Vary':'Cookie','X-Content-Type-Options':'nosniff'}});
  if(request.method!=='GET')return reply(405,{error:'METHOD_NOT_ALLOWED'});
  try{
   const session=await identity(request);
   if(!session?.user?.id)return reply(401,{error:'SIGN_IN_REQUIRED'});
   if(session.user.role!=='admin')return reply(403,{error:'STAFF_ACCESS_REQUIRED'});
   let state;try{state=stateFilter(new URL(request.url).searchParams.get('state')??'TX');}catch{return reply(400,{error:'INVALID_STATE'});}
   const rows=await load(state);
   if(!Array.isArray(rows)||rows.length>12)throw new TypeError('Unexpected context row count');
   const data=rows.map(summarizeRow);
   return reply(200,{schema:CONTEXT_SCHEMA,status:data.length?'ready':'empty',state,data,
    warning:'Internal source context only. Record counts are not data centers, available power or commercial offers.'});
  }catch{return reply(503,{error:'RESEARCH_UNAVAILABLE'});}
 };
}
