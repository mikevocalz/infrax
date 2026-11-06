import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildConfig} from 'payload';
import {postgresAdapter} from '@payloadcms/db-postgres';
import {betterAuth,type BetterAuthOptions} from 'better-auth';
import {betterAuthCollections,createBetterAuthPlugin,payloadAdapter} from '@delmaredigital/payload-better-auth';
import {Users,Pages,Partners,Research,OperatorReviews} from './cms/collections';
import {cmsEnvironment} from './cms/policy.mjs';
const root=path.dirname(fileURLToPath(import.meta.url));
const env=cmsEnvironment(process.env);
const authOptions:Partial<BetterAuthOptions>={
 user:{additionalFields:{role:{type:'string',defaultValue:'user',input:false}}},
 emailAndPassword:{enabled:true,disableSignUp:!env.allowSignup,minPasswordLength:12},
 session:{cookieCache:{enabled:false}},rateLimit:{enabled:true},
 databaseHooks:{user:{create:{before:async user=>({data:{...user,role:'user'}})}}}
};
export default buildConfig({
 secret:env.payloadSecret,serverURL:env.origin,
 admin:{user:'users',importMap:{baseDir:root,importMapFile:path.join(root,'app/(payload)/admin/importMap.ts')}},
 collections:[Users,Pages,Partners,Research,OperatorReviews],
 plugins:[
  betterAuthCollections({betterAuthOptions:authOptions,skipCollections:['user'],firstUserAdmin:false,acknowledgeRoleGuardDisabled:true}),
  createBetterAuthPlugin({createAuth:payload=>betterAuth({...authOptions,database:payloadAdapter({payloadClient:payload}),advanced:{database:{generateId:'serial'}},baseURL:env.origin,basePath:'/api/auth',secret:env.authSecret,trustedOrigins:[env.origin]})})
 ],
 db:postgresAdapter({pool:{connectionString:env.connectionString,max:5},schemaName:'cms',push:false,migrationDir:path.join(root,'cms/migrations')}),
 typescript:{outputFile:path.join(root,'cms/payload-types.ts')},
 onInit:async payload=>{
  if(env.ci)return;
  const pool=(payload.db as unknown as {pool:{query:(s:string)=>Promise<{rows:Array<{rolsuper:boolean;rolbypassrls:boolean;rolcreatedb:boolean;rolcreaterole:boolean}>}>}}).pool;
  const {rows}=await pool.query('SELECT rolsuper,rolbypassrls,rolcreatedb,rolcreaterole FROM pg_roles WHERE rolname=current_user');
  if(!rows[0]||Object.values(rows[0]).some(Boolean))throw new Error('Unsafe CMS database role');
 }
});
