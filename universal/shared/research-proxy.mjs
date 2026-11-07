import{parseResearchResponse,stateFilter}from'../../client/research-contract.mjs';
const headers={'Cache-Control':'private, no-store','Vary':'Cookie','X-Content-Type-Options':'nosniff'};
const reply=(status,error)=>Response.json({error},{status,headers});
/** Read-only BFF: the destination is server configuration, never query/body input.
 * Upstream Better Auth remains the permission authority. No service/admin key.
 */
export async function forwardResearch(request,{origin,allowedHost,fetchImpl=fetch}={}){
 if(request.method!=='GET')return reply(405,'METHOD_NOT_ALLOWED');
 if(!origin||!allowedHost)return reply(503,'HOST_NOT_CONFIGURED');
 let base,state;
 try{
  base=new URL(origin);
  if(base.hostname!==allowedHost||base.username||base.password||base.pathname!=='/'||base.search||base.hash||base.origin===new URL(request.url).origin||!(base.protocol==='https:'||base.protocol==='http:'&&['127.0.0.1','localhost'].includes(base.hostname)))throw Error('origin');
  const params=new URL(request.url).searchParams;
  if([...params.keys()].some(k=>k!=='state')||params.getAll('state').length>1)return reply(400,'INVALID_QUERY');
  state=stateFilter(params.get('state')??'TX');
 }catch{return reply(400,'INVALID_CONFIGURATION_OR_STATE');}
 const cookie=request.headers.get('cookie');if(!cookie)return reply(401,'SIGN_IN_REQUIRED');
 if(cookie.length>8192)return reply(400,'INVALID_SESSION_HEADER');
 try{
  const url=new URL('/api/v1/research/context',base);url.searchParams.set('state',state);
  const response=await fetchImpl(url,{method:'GET',headers:{Accept:'application/json',Cookie:cookie},redirect:'error',cache:'no-store',signal:AbortSignal.any([request.signal,AbortSignal.timeout(12000)])});
  if(response.status===401)return reply(401,'SIGN_IN_REQUIRED');
  if(response.status===403)return reply(403,'STAFF_ACCESS_REQUIRED');
  if(!response.ok)return reply(503,'RESEARCH_UNAVAILABLE');
  if(response.headers.get('content-type')?.split(';')[0]!=='application/json')return reply(502,'INVALID_UPSTREAM');
  let bytes=0,text='';const reader=response.body?.getReader();if(!reader)return reply(502,'INVALID_UPSTREAM');
  const decoder=new TextDecoder();try{for(;;){const part=await reader.read();if(part.done)break;bytes+=part.value.byteLength;if(bytes>65536){await reader.cancel();return reply(502,'INVALID_UPSTREAM');}text+=decoder.decode(part.value,{stream:true});}text+=decoder.decode();}finally{reader.releaseLock();}
  return Response.json(parseResearchResponse(JSON.parse(text),state),{status:200,headers});
 }catch{return reply(503,'RESEARCH_UNAVAILABLE');}
}
