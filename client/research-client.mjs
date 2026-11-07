import {parseResearchResponse,stateFilter} from './research-contract.mjs';
export class ResearchClientError extends Error {
 constructor(code){super(code);this.name='ResearchClientError';this.code=code;}
}
/** Native may inject authenticated headers from its secure session adapter.
 * Origin is fixed at construction; request state can never choose a server.
 */
export function createResearchClient({baseUrl,fetchImpl=fetch,getAuthHeaders=async()=>({}),timeoutMs=12000}){
 const base=new URL(baseUrl);
 if(base.username||base.password||base.pathname!=='/'||base.search||base.hash||!(base.protocol==='https:'||base.protocol==='http:'&&['localhost','127.0.0.1'].includes(base.hostname)))throw new TypeError('Approved HTTPS origin required');
 if(!Number.isInteger(timeoutMs)||timeoutMs<1||timeoutMs>60000)throw new TypeError('Bounded timeout required');
 return async function load(state,{signal}={}){
  stateFilter(state);if(signal?.aborted)throw new ResearchClientError('aborted');
  const controller=new AbortController();const onAbort=()=>controller.abort();
  signal?.addEventListener('abort',onAbort,{once:true});let timedOut=false;
  const timer=setTimeout(()=>{timedOut=true;controller.abort();},timeoutMs);
  try{
   const headers=await getAuthHeaders();
   if(controller.signal.aborted)throw new ResearchClientError(signal?.aborted?'aborted':'unavailable');
   const url=new URL('/api/v1/research/context',base);url.searchParams.set('state',state);
   const response=await fetchImpl(url.href,{method:'GET',headers:{...headers,Accept:'application/json'},credentials:'include',cache:'no-store',redirect:'error',signal:controller.signal});
   if(response.status===401)throw new ResearchClientError('signed_out');
   if(response.status===403)throw new ResearchClientError('forbidden');
   if(!response.ok)throw new ResearchClientError('unavailable');
   if(response.headers?.get('content-type')?.split(';')[0]!=='application/json')throw new ResearchClientError('invalid_response');
   let text='';
   if(response.body?.getReader){
    const reader=response.body.getReader(),decoder=new TextDecoder();let bytes=0;
    try{for(;;){const part=await reader.read();if(part.done)break;bytes+=part.value.byteLength;
     if(bytes>65536){await reader.cancel();throw new ResearchClientError('invalid_response');}
     text+=decoder.decode(part.value,{stream:true});}text+=decoder.decode();}finally{reader.releaseLock();}
   }else{text=await response.text();if(text.length>65536)throw new ResearchClientError('invalid_response');}
   if(controller.signal.aborted)throw new ResearchClientError(signal?.aborted?'aborted':'unavailable');
   try{return parseResearchResponse(JSON.parse(text),state);}catch{throw new ResearchClientError('invalid_response');}
  }catch(error){
   if(signal?.aborted)throw new ResearchClientError('aborted');
   if(timedOut)throw new ResearchClientError('unavailable');
   if(error instanceof ResearchClientError)throw error;
   throw new ResearchClientError('unavailable');
  }finally{clearTimeout(timer);signal?.removeEventListener('abort',onAbort);}
 };
}
/** Instance-local controller: stale requests cannot populate another region/session. */
export function createResearchController({load,onChange}){
 let generation=0,active=null,disposed=false;
 return Object.freeze({
  async select(region){
   stateFilter(region);if(disposed)return;
   const current=++generation;active?.abort();active=new AbortController();const signal=active.signal;
   onChange({region,status:'loading',result:null});
   try{const result=await load(region,{signal});if(!disposed&&current===generation&&!signal.aborted)onChange({region,status:result.status,result});}
   catch(error){if(!disposed&&current===generation&&!signal.aborted)onChange({region,status:error instanceof ResearchClientError?error.code:'unavailable',result:null});}
  },
  dispose(){disposed=true;generation++;active?.abort();},
 });
}
