import{forwardWorkspace}from'../../../../shared/workspace/proxy.mjs';
export const runtime='nodejs';export const dynamic='force-dynamic';
async function handle(request:Request,context:{params:Promise<{path:string[]}>}){const{path}=await context.params;return forwardWorkspace(request,'/api/'+path.join('/'),{origin:process.env.INFRAX_UPSTREAM_ORIGIN,allowedHost:process.env.INFRAX_UPSTREAM_ALLOWED_HOST});}
export const GET=handle;export const POST=handle;
