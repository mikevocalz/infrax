import{readJSON,RESOURCES}from'./client.mjs';
const noStore={'Cache-Control':'private, no-store','Vary':'Cookie','X-Content-Type-Options':'nosniff'};
const authPaths=new Set(['get-session','sign-in/email','sign-up/email','sign-out','update-user','change-password','request-password-reset']);
const publicReads=new Set(['/api/v1/assets','/api/v1/candidates','/api/v1/intel/signals']);
export function allowedProxyPath(path,method){
 if(path.startsWith('/api/auth/'))return authPaths.has(path.slice(10))&&(path.endsWith('get-session')?method==='GET':method==='POST');
 if(publicReads.has(path))return method==='GET';
 if(path==='/api/v1/intake')return method==='POST';
 if(path.startsWith('/api/v1/workspace/'))return [...RESOURCES,'nonce'].includes(path.slice(18))&&['GET','POST'].includes(method);
 return false;
}
export async function forwardWorkspace(request,path,{origin,allowedHost,fetchImpl=fetch}={}){
 const fail=(status,error)=>Response.json({error},{status,headers:noStore});
 if(!allowedProxyPath(path,request.method))return fail(404,'NOT_FOUND');
 let base;try{base=new URL(origin);if(base.hostname!==allowedHost||base.username||base.password||base.pathname!=='/'||base.search||base.hash||base.origin===new URL(request.url).origin||!(base.protocol==='https:'||base.protocol==='http:'&&['localhost','127.0.0.1'].includes(base.hostname)))throw Error();}catch{return fail(503,'UPSTREAM_NOT_CONFIGURED');}
 const url=new URL(request.url),keys=path.startsWith('/api/v1/workspace/')?['organizationId','id','parent','after']:publicReads.has(path)?['after','limit']:[];
 if([...url.searchParams.keys()].some(k=>!keys.includes(k)||url.searchParams.getAll(k).length>1))return fail(400,'INVALID_QUERY');
 if(request.method==='POST'&&(request.headers.get('origin')!==url.origin||request.headers.get('sec-fetch-site')==='cross-site'))return fail(403,'ORIGIN_NOT_ALLOWED');
 const cookie=request.headers.get('cookie');if(cookie&&cookie.length>8192)return fail(400,'INVALID_SESSION');
 const anonymous=publicReads.has(path)||path==='/api/v1/intake'||path.startsWith('/api/auth/')||path==='/api/v1/workspace/session'||path==='/api/v1/workspace/nonce';
 if(!anonymous&&!cookie)return fail(401,'SIGN_IN_REQUIRED');
 try{
  let body;if(request.method==='POST'){body=await readJSON(request,24576);if(!body||typeof body!=='object'||Array.isArray(body))return fail(400,'INVALID_BODY');}
  const target=new URL(path,base);target.search=url.search;
  const idempotency=request.headers.get('idempotency-key');if(idempotency&&!/^[a-f0-9-]{36}$/i.test(idempotency))return fail(400,'INVALID_REQUEST_KEY');
  const response=await fetchImpl(target,{method:request.method,headers:{Accept:'application/json',...(cookie?{Cookie:cookie}:{}),...(body?{'Content-Type':'application/json',Origin:base.origin}:{}),...(idempotency?{'Idempotency-Key':idempotency}:{})},...(body?{body:JSON.stringify(body)}:{}),redirect:'error',cache:'no-store',signal:AbortSignal.any([request.signal,AbortSignal.timeout(15000)])});
  const result=await readJSON(response,524288);const headers=new Headers(noStore);
  if(path.startsWith('/api/auth/')){
   for(const item of response.headers.getSetCookie?.()??[]){if(!/^(?:__Host-|__Secure-)?better-auth\.[A-Za-z0-9_.-]+=/.test(item))continue;headers.append('Set-Cookie',item.replace(/;\s*Domain=[^;]*/ig,''));}
   if(response.ok&&path.endsWith('get-session'))return Response.json(result?.user?{user:{id:String(result.user.id),name:result.user.name,email:result.user.email,role:result.user.role},session:{expiresAt:result.session?.expiresAt}}:null,{status:response.status,headers});
   if(response.ok)return Response.json({ok:true},{status:response.status,headers});
  }
  return Response.json(result,{status:response.status,headers});
 }catch{return fail(503,'UPSTREAM_UNAVAILABLE');}
}
