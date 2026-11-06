import { connectionConfig } from './config.mjs';
import { ApiError, createAPI, failure } from './core.mjs';
import { createRepository } from './repository.mjs';
import { betterAuthIdentity } from './identity.mjs';
/** Import only through Next server route handlers. Credentials are resolved lazily, not during build. */
export async function handleRequest(request,operation) {
  if(typeof window!=='undefined') throw new Error('Server-only backend');
  try {
    const config=connectionConfig(process.env);
    const { neon }=await import('@neondatabase/serverless');
    const sql=neon(config.connectionString,{fetchOptions:{signal:AbortSignal.timeout(10000)}});
    const [role]=await sql.query("SELECT current_user AS role,rolsuper,rolbypassrls,rolcreatedb,rolcreaterole,pg_has_role(current_user,'neon_superuser','member') AS admin FROM pg_roles WHERE rolname=current_user");
    if(!role || role.role!==config.expectedRole || role.rolsuper || role.rolbypassrls || role.rolcreatedb || role.rolcreaterole || role.admin)
      throw new ApiError(503,'UNSAFE_DATABASE_ROLE');
    return createAPI({repository:createRepository(sql),publicOrigin:config.publicOrigin,
      identity:betterAuthIdentity({baseURL:process.env.INFRAX_AUTH_BASE_URL,publicOrigin:config.publicOrigin})})(request,operation);
  }catch(error){return failure(error);}
}
