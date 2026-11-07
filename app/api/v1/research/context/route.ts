import{getPayload}from'payload';import{getServerSession}from'@delmaredigital/payload-better-auth';
import config from'@payload-config';import{createResearchAPI,loadResearchContext}from'@/lib/server/research';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function GET(request:Request){
 const api=createResearchAPI({identity:async(req:Request)=>{const payload=await getPayload({config});return getServerSession(payload,req.headers);},load:loadResearchContext});
 return api(request);
}
