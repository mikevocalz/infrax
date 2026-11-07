import{headers}from'next/headers';import{redirect}from'next/navigation';
import{getPayload}from'payload';import{getServerSession}from'@delmaredigital/payload-better-auth';
import config from'@payload-config';import{Stack,Panel,Body,TextLink}from'@/components/ui/semantic';
import{PageFrame}from'@/components/ui/marketing';import{SignOutButton}from'@/components/features/auth/AccountForms';
export const dynamic='force-dynamic';
export default async function Account(){
 const payload=await getPayload({config});const session=await getServerSession(payload,await headers());if(!session)redirect('/sign-in');
 const user=session.user as{name?:string;email?:string;role?:string};
 return <PageFrame eyebrow="Account" title="Your InFraX account" summary="Manage your account and access."><Stack className="max-w-xl mx-auto"><Panel><Body>{user.name||'Signed-in account'}</Body><Body>{user.email}</Body><Body>Private organization access is verified separately. Creating an account does not make you an operator or staff administrator.</Body>{user.role==='admin'?<><TextLink href="/admin">Open content administration</TextLink><TextLink href="/account/research">Review source evidence</TextLink></>:null}<TextLink href="/contact">Request an infrastructure assessment</TextLink><SignOutButton/></Panel></Stack></PageFrame>;
}
