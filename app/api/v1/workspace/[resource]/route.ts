import{getPayload}from'payload';
import{getServerSession}from'@delmaredigital/payload-better-auth';
import config from'@payload-config';
import{workspaceRequest}from'../../../../../backend/workspace-runtime.mjs';
export const runtime='nodejs';export const dynamic='force-dynamic';
async function handle(request:Request,context:{params:Promise<{resource:string}>}){
 const {resource}=await context.params;
 const payload=await getPayload({config});
 const session=await getServerSession(payload,request.headers);
 return workspaceRequest(request,resource,session);
}
export const GET=handle;export const POST=handle;
