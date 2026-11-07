import{headers}from'next/headers';import{redirect,notFound}from'next/navigation';import{getPayload}from'payload';import{getServerSession}from'@delmaredigital/payload-better-auth';import config from'@payload-config';
import{PageFrame}from'@/components/ui/marketing';import{MarketResearch}from'@/components/features/research/MarketResearch';
export const dynamic='force-dynamic';
export default async function Research(){
 const payload=await getPayload({config});const session=await getServerSession(payload,await headers());
 if(!session)redirect('/sign-in');if((session.user as {role?:string}).role!=='admin')notFound();
 return <PageFrame eyebrow="Staff source review" title="Market context and evidence" summary="Internal development research. No verified capacity offers or facility availability are represented here."><MarketResearch/></PageFrame>;
}
