import {connectionConfig} from './config.mjs';
import {createWorkspaceAPI,createWorkspaceRepository} from './workspace.mjs';
import {failure,ApiError,json} from './core.mjs';
export async function workspaceRequest(request,resource,session){
 try{
  if(typeof window!=='undefined')throw Error('Server only');
  if(resource==='session'&&!session?.user?.id)return json({user:null,organizations:[],capabilities:{signup:process.env.INFRAX_ALLOW_SIGNUP==='true',recovery:false,fileUpload:false,reportGeneration:false,emailDispatch:false,workspace:false}});
  const config=connectionConfig(process.env);const {neon}=await import('@neondatabase/serverless');const sql=neon(config.connectionString,{fetchOptions:{signal:AbortSignal.timeout(10000)}});
  const [role]=await sql.query("SELECT current_user AS role,rolsuper,rolbypassrls,rolcreatedb,rolcreaterole,pg_has_role(current_user,'neon_superuser','member') AS elevated FROM pg_roles WHERE rolname=current_user");
  if(!role||role.role!==config.expectedRole||role.rolsuper||role.rolbypassrls||role.rolcreatedb||role.rolcreaterole||role.elevated)throw new ApiError(503,'UNSAFE_DATABASE_ROLE');
  return createWorkspaceAPI({identity:async()=>session,repository:createWorkspaceRepository(sql),publicOrigin:config.publicOrigin,signupEnabled:process.env.INFRAX_ALLOW_SIGNUP==='true'})(request,resource);
 }catch(e){return failure(e);}
}
