export class WorkspaceError extends Error{constructor(code,status=0){super(code);this.code=code;this.status=status;}}
export const RESOURCES=Object.freeze(['session','organizations','scenarios','projects','tasks','documents','reports','messages','sites','offers','requests','responses','watchlists','reviews','sources','cases','content','notifications','preferences','team']);
const identifiers=/^[A-Za-z0-9_-]{1,128}$/;
export function endpoint(resource){if(!RESOURCES.includes(resource))throw new WorkspaceError('UNKNOWN_RESOURCE');return '/api/v1/workspace/'+resource;}
export async function readJSON(response,max=524288){
 if(response.headers.get('content-type')?.split(';')[0]!=='application/json')throw new WorkspaceError('INVALID_RESPONSE',response.status);
 let size=0,text='';const reader=response.body?.getReader();
 if(reader){const decoder=new TextDecoder('utf-8',{fatal:true});try{for(;;){const part=await reader.read();if(part.done)break;size+=part.value.byteLength;if(size>max){await reader.cancel();throw new WorkspaceError('RESPONSE_TOO_LARGE');}text+=decoder.decode(part.value,{stream:true});}text+=decoder.decode();}finally{reader.releaseLock();}}
 else {text=await response.text();if(text.length>max)throw new WorkspaceError('RESPONSE_TOO_LARGE');}
 try{return JSON.parse(text);}catch{throw new WorkspaceError('INVALID_RESPONSE');}
}
export function createWorkspaceClient({baseUrl,fetchImpl=fetch,getAuthHeaders=async()=>({}),makeId=()=>globalThis.crypto.randomUUID()}){
 const base=new URL(baseUrl);if(base.username||base.password||base.pathname!=='/'||base.search||base.hash||!(base.protocol==='https:'||base.protocol==='http:'&&['localhost','127.0.0.1'].includes(base.hostname)))throw new WorkspaceError('INVALID_ORIGIN');
 async function request(path,{method='GET',body,signal,key}={}){
  if(!path.startsWith('/api/'))throw new WorkspaceError('INVALID_ENDPOINT');
  const controller=new AbortController(),abort=()=>controller.abort();if(signal?.aborted)throw new WorkspaceError('ABORTED');signal?.addEventListener('abort',abort,{once:true});
  const timer=setTimeout(abort,15000);
  try{const headers=await getAuthHeaders();const response=await fetchImpl(new URL(path,base).href,{method,headers:{...headers,Accept:'application/json',...(body?{'Content-Type':'application/json'}:{}),...(key?{'Idempotency-Key':key}:{})},...(body?{body:JSON.stringify(body)}:{}),credentials:'include',redirect:'error',cache:'no-store',signal:controller.signal});
   const result=await readJSON(response);if(!response.ok)throw new WorkspaceError(response.status===401?'SIGNED_OUT':response.status===403?'FORBIDDEN':response.status===404?'NOT_FOUND':response.status===409?'CONFLICT':response.status===429?'RATE_LIMITED':response.status===422||response.status===400?'INVALID_INPUT':'UNAVAILABLE',response.status);
   return result;
  }catch(e){if(signal?.aborted)throw new WorkspaceError('ABORTED');if(e instanceof WorkspaceError)throw e;throw new WorkspaceError('UNAVAILABLE');}
  finally{clearTimeout(timer);signal?.removeEventListener('abort',abort);}
 }
 return Object.freeze({
  id:()=>makeId(),
  session:({signal}={})=>request(endpoint('session'),{signal}),
  list(resource,{organizationId,id,parent,after,signal}={}){const q=new URLSearchParams();for(const[k,v]of Object.entries({organizationId,id,parent,after})){if(v){if(!identifiers.test(v))throw new WorkspaceError('INVALID_IDENTIFIER');q.set(k,v);}}return request(endpoint(resource)+'?'+q,{signal});},
  save(resource,{organizationId,parent,id,data,version},key){if(!key)throw new WorkspaceError('IDEMPOTENCY_REQUIRED');return request(endpoint(resource),{method:'POST',body:{organizationId,parent,id,data,version},key});},
  feed(kind,{after,signal}={}){const names={facilities:'assets',signals:'intel/signals',offers:'candidates'};if(!Object.hasOwn(names,kind))throw new WorkspaceError('UNKNOWN_RESOURCE');return request('/api/v1/'+names[kind]+(after?'?after='+encodeURIComponent(after):''),{signal});},
  intake(body,key){return request('/api/v1/intake',{method:'POST',body,key});},
  auth(action,body={}){const paths={signIn:'sign-in/email',signUp:'sign-up/email',signOut:'sign-out',profile:'update-user',password:'change-password',recovery:'request-password-reset'};if(!Object.hasOwn(paths,action))throw new WorkspaceError('UNKNOWN_ACTION');return request('/api/auth/'+paths[action],{method:'POST',body});},
 });
}
