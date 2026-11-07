import { connectionConfig } from './config.mjs';
export async function loadResearchContext(state){
 if(typeof window!=='undefined')throw new Error('Server only');
 const config=connectionConfig(process.env);
 if(config.environment!=='development')throw new Error('Research pilot is development only');
 const {neon}=await import('@neondatabase/serverless');
 const sql=neon(config.connectionString,{fetchOptions:{signal:AbortSignal.timeout(10000)}});
 const [role]=await sql.query("SELECT current_user AS role,rolsuper,rolbypassrls,rolcreatedb,rolcreaterole,pg_has_role(current_user,'neon_superuser','member') AS admin FROM pg_roles WHERE rolname=current_user");
 if(!role||role.role!==config.expectedRole||role.rolsuper||role.rolbypassrls||role.rolcreatedb||role.rolcreaterole||role.admin)throw new Error('Unsafe role');
 return sql.query('SELECT dataset,state,period,summary,imported_at FROM infra.market_context_summaries WHERE state=$1 ORDER BY dataset LIMIT 7',[state]);
}
