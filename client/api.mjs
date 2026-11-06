/** Shared transport for web/native; no provider keys or caller-controlled identity. */
export const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export class ClientError extends Error{constructor(code,status=0){super(code);this.code=code;this.status=status;}}
const messages={SERVICE_UNAVAILABLE:'The service is unavailable. Retry without changing this request.',RATE_LIMITED:'Too many requests. Please try again later.',SIGN_IN_REQUIRED:'Sign in to continue.',ACCESS_DENIED:'Your account does not have access.',INVALID_EMAIL:'Enter a valid email address.',TYPE_AND_CONSENT_REQUIRED:'Select your role and confirm your consent.',INVALID_INPUT:'Check the required fields.',INVALID_OR_CONFLICTING_INPUT:'This request conflicts with an earlier submission. Keep its reference and contact support.',UNCONFIRMED_RESPONSE:'The server did not confirm receipt. Retry this same request.',REQUEST_IN_PROGRESS:'Your request is already being submitted.',RETRY_PAYLOAD_CHANGED:'Retry the original request before starting a different one.'};
export function errorMessage(error){return messages[error?.code]??'The request could not be completed. Please retry.';}
export function createInfraXClient({baseURL='',fetchImpl=fetch}={}){
 let root='';if(baseURL){const u=new URL(baseURL);if(u.username||u.password||u.search||u.hash||u.pathname!=='/'||u.protocol!=='https:')throw new Error('HTTPS API origin required');root=u.origin;}
 async function request(path,{method='GET',body,key,signal}={}){
  let response;try{response=await fetchImpl(root+path,{method,credentials:root?'include':'same-origin',redirect:'error',headers:{Accept:'application/json',...(body?{'Content-Type':'application/json'}:{}),...(key?{'Idempotency-Key':key}:{})},...(body?{body:JSON.stringify(body)}:{}),signal:signal??AbortSignal.timeout(15000)});}catch(e){if(e?.name==='AbortError')throw e;throw new ClientError('SERVICE_UNAVAILABLE');}
  let data;try{data=await response.json();}catch{throw new ClientError('UNCONFIRMED_RESPONSE',response.status);}
  if(!response.ok)throw new ClientError(typeof data?.error==='string'?data.error:'SERVICE_UNAVAILABLE',response.status);return data;
 }
 async function collection(path,{signal}={}){const data=await request(path,{signal});if(!Array.isArray(data?.data)||!['ready','empty'].includes(data.status)||data.metadata?.contractVersion!==2||data.metadata?.dataMode!=='database')throw new ClientError('UNCONFIRMED_RESPONSE');return data;}
 return Object.freeze({facilities:options=>collection('/api/v1/facilities',options),signals:options=>collection('/api/v1/intel/signals',options),offers:options=>collection('/api/v1/candidates',options),
  async submitIntake(body,key){if(body?.consent!==true)throw new ClientError('TYPE_AND_CONSENT_REQUIRED',400);if(!UUID.test(key))throw new ClientError('INVALID_INPUT',400);const result=await request('/api/v1/intake',{method:'POST',body,key});if(result?.status!=='received'||!UUID.test(result.receiptId)||result.notificationStatus!=='queued')throw new ClientError('UNCONFIRMED_RESPONSE');return result;}
 });
}
/** Keeps a frozen retry payload and key through network uncertainty. Never stores PII in localStorage. */
export function createIntakeSubmission(client,{newKey=()=>globalThis.crypto.randomUUID()}={}){
 let key=null,serialized=null,pending=null,receipt=null;
 return Object.freeze({get attempted(){return key!==null;},submit(body){
  if(body?.consent!==true)return Promise.reject(new ClientError('TYPE_AND_CONSENT_REQUIRED',400));const next=JSON.stringify(body);
  if(serialized!==null&&serialized!==next)return Promise.reject(new ClientError('RETRY_PAYLOAD_CHANGED',409));if(receipt)return Promise.resolve(receipt);if(pending)return pending;
  serialized=next;key??=newKey();pending=client.submitIntake(JSON.parse(serialized),key).then(result=>{receipt=result;return result;}).catch(error=>{
   // Only explicit rejection permits editing. Network/5xx uncertainty retains the retry key.
   if(error instanceof ClientError&&[400,401,403,413,422].includes(error.status)){key=null;serialized=null;}throw error;
  }).finally(()=>{pending=null;});return pending;
 }});
}
export function sourceLink(value){try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password?u.href:null;}catch{return null;}}
