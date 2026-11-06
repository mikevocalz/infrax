import { ApiError } from './core.mjs';
const HOSTS=Object.freeze({
 development:'ep-proud-resonance-bcwlhuyj-pooler.c-16.us-east-1.aws.neon.tech',
 staging:'ep-raspy-fog-bc1d7jqg-pooler.c-16.us-east-1.aws.neon.tech',
 production:'ep-restless-sky-bcs5wyfg-pooler.c-16.us-east-1.aws.neon.tech'
});
/** Reject owner credentials, wrong database/branch, plaintext TLS and URL option overrides. */
export function connectionConfig(env) {
  const environment=env.INFRAX_ENV;
  if(!Object.hasOwn(HOSTS,environment)) throw new ApiError(503,'ENVIRONMENT_NOT_CONFIGURED');
  if(environment==='production' && env.INFRAX_PRODUCTION_ENABLED!=='true')
    throw new ApiError(503,'PRODUCTION_INTEGRATION_DISABLED');
  let url; try{url=new URL(env.INFRAX_RUNTIME_DATABASE_URL);}catch{throw new ApiError(503,'DATABASE_NOT_CONFIGURED');}
  if(!['postgres:','postgresql:'].includes(url.protocol) || url.hostname!==HOSTS[environment] ||
    url.pathname!=='/infrax' || decodeURIComponent(url.username)!=='infrax_api_'+environment ||
    !url.password || (url.port && url.port!=='5432') || url.hash ||
    !['require','verify-full'].includes(url.searchParams.get('sslmode')) ||
    [...url.searchParams.keys()].some(k=>!['sslmode','channel_binding'].includes(k)))
    throw new ApiError(503,'DATABASE_CONFIGURATION_REJECTED');
  let origin;try{origin=new URL(env.INFRAX_PUBLIC_ORIGIN);}catch{throw new ApiError(503,'ORIGIN_NOT_CONFIGURED');}
  if(origin.username || origin.password || origin.pathname!=='/' || origin.search || origin.hash ||
    !(origin.protocol==='https:' || (environment==='development' && origin.protocol==='http:' && ['localhost','127.0.0.1'].includes(origin.hostname))))
    throw new ApiError(503,'ORIGIN_CONFIGURATION_REJECTED');
  return {environment,connectionString:url.href,publicOrigin:origin.origin,expectedRole:'infrax_api_'+environment};
}
