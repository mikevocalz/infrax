import { ApiError, boundedJSON } from './core.mjs';
/** Reads the existing Payload/Better Auth identity service. Does NOT create another user store.
 * URL is server configuration, same-origin only; redirects and cookie-cache shortcuts are forbidden.
 */
export function betterAuthIdentity({baseURL,publicOrigin,fetchImpl=fetch,now=()=>new Date()}) {
  return async request=>{
    const cookie=request.headers.get('cookie');
    if(!cookie) throw new ApiError(401,'SIGN_IN_REQUIRED');
    let url;try{url=new URL(baseURL);}catch{throw new ApiError(503,'IDENTITY_NOT_CONFIGURED');}
    if(url.origin!==publicOrigin || url.username || url.password || url.search || url.hash ||
      !/^\/api\/(?:payload\/)?auth\/?$/.test(url.pathname))
      throw new ApiError(503,'IDENTITY_CONFIGURATION_REJECTED');
    url.pathname=url.pathname.replace(/\/$/,'')+'/get-session';
    url.searchParams.set('disableCookieCache','true'); url.searchParams.set('disableRefresh','true');
    const response=await fetchImpl(url,{headers:{cookie,Accept:'application/json'},redirect:'error',cache:'no-store',signal:AbortSignal.timeout(5000)});
    if(response.status===401 || response.status===403) throw new ApiError(401,'SIGN_IN_REQUIRED');
    if(!response.ok) throw new ApiError(503,'IDENTITY_UNAVAILABLE');
    // Refresh belongs to the auth client. Never silently discard a refreshed cookie.
    if(response.headers.has('set-cookie')) throw new ApiError(503,'IDENTITY_READ_ONLY_CONFIGURATION_REQUIRED');
    const content=await boundedJSON(response,65536,true);
    const subject=String(content?.user?.id??'');
    if(!subject || subject.length>128 || String(content?.session?.userId??'')!==subject ||
      !Number.isFinite(Date.parse(content?.session?.expiresAt)) || Date.parse(content.session.expiresAt)<=now().getTime())
      throw new ApiError(401,'SIGN_IN_REQUIRED');
    return Object.freeze({subject}); // never accept client role/org from headers or request JSON
  };
}
