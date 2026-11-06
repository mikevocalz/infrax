/** No network, credentials in logs, public bootstrap-admin or implicit production mode. */
export function cmsEnvironment(env){
 const mode=env.APP_ENV;
 if(!['development','staging'].includes(mode))throw new Error('CMS launch is limited to development/staging until release approval');
 const origin=new URL(env.INFRAX_PUBLIC_ORIGIN??'');
 const local=['localhost','127.0.0.1'].includes(origin.hostname);
 if(origin.username||origin.password||origin.search||origin.hash||origin.pathname!=='/'||(!local&&origin.protocol!=='https:')||!['https:','http:'].includes(origin.protocol))throw new Error('Explicit safe public origin required');
 const connection=new URL(env.INFRAX_CMS_DATABASE_URL??'');
 if(!['postgres:','postgresql:'].includes(connection.protocol)||connection.pathname!=='/infrax')throw new Error('Dedicated infrax database required');
 const ci=env.CI==='true'&&env.INFRAX_CMS_TEST_MODE==='1';
 if(ci){
  if(!['127.0.0.1','localhost'].includes(connection.hostname))throw new Error('CI may only use its disposable local database');
 }else{
  const expected=mode==='development'?'ep-proud-resonance-bcwlhuyj':'ep-raspy-fog-bc1d7jqg';
  if(![expected+'.c-16.us-east-1.aws.neon.tech',expected+'-pooler.c-16.us-east-1.aws.neon.tech'].includes(connection.hostname)||decodeURIComponent(connection.username)!=='infrax_cms_'+mode)throw new Error('Wrong CMS host or role');
  if(connection.searchParams.get('sslmode')!=='require'||[...connection.searchParams.keys()].some(k=>!['sslmode','channel_binding'].includes(k)))throw new Error('TLS required; connection overrides forbidden');
 }
 for(const name of ['PAYLOAD_SECRET','BETTER_AUTH_SECRET'])if(typeof env[name]!=='string'||env[name].length<32)throw new Error(name+' must be independently configured');
 if(env.PAYLOAD_SECRET===env.BETTER_AUTH_SECRET)throw new Error('Use separate CMS and session secrets');
 return {mode,ci,origin:origin.origin,connectionString:connection.toString(),payloadSecret:env.PAYLOAD_SECRET,authSecret:env.BETTER_AUTH_SECRET,allowSignup:env.INFRAX_ALLOW_SIGNUP==='true'};
}
export function isCMSAdmin(user){return !!user&&user.role==='admin';}
export function selfOrAdmin(user){return !user?false:isCMSAdmin(user)?true:{id:{equals:user.id}};}
export function safeEditorialLink(value){return typeof value==='string'&&/^\/(?!\/)[A-Za-z0-9/_-]*$/.test(value);}
