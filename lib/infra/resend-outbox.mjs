/** Sends only minimal internal notification with a durable receipt reference.
 * Authorization and tenant scope for looking up the underlying inquiry live in the worker.
 */
const email=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export function createIntakeNotice({referenceId,from,to}) {
 if(!/^[0-9a-f]{8}-[0-9a-f-]{27,}$/i.test(referenceId))throw new Error('Real receipt UUID required');
 if(!email.test(from)||!email.test(to))throw new Error('Verified sender and destination required');
 return Object.freeze({
  from,to:[to],subject:'New InFraX infrastructure intake',
  text:'A new infrastructure inquiry was saved. Reference: '+referenceId+
   '\nReview the request only through the authenticated InFraX analyst workspace.',
  idempotencyKey:'infrax-intake-received/'+referenceId
 });
}
export async function deliverIntakeNotice({referenceId,apiKey,from,to,fetchImpl=fetch}) {
 if(!apiKey?.trim())throw new Error('RESEND_API_KEY is required server side');
 const notice=createIntakeNotice({referenceId,from,to});
 const {idempotencyKey,...body}=notice;
 const response=await fetchImpl('https://api.resend.com/emails',{
  method:'POST',
  headers:{Authorization:'Bearer '+apiKey,'Content-Type':'application/json','Idempotency-Key':idempotencyKey},
  body:JSON.stringify(body)
 });
 if(!response.ok)throw new Error('Resend API HTTP '+response.status);
 const result=await response.json();
 if(typeof result?.id!=='string'||!result.id)throw new Error('Resend did not confirm delivery initiation');
 return {providerMessageId:result.id,idempotencyKey};
}