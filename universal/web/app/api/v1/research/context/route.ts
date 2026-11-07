import{forwardResearch}from'../../../../../../shared/research-proxy.mjs';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function GET(request:Request){return forwardResearch(request,{origin:process.env.INFRAX_UPSTREAM_ORIGIN,allowedHost:process.env.INFRAX_UPSTREAM_ALLOWED_HOST});}
