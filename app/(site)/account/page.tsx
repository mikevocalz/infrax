import {headers} from 'next/headers';import {redirect} from 'next/navigation';
import {getPayload} from 'payload';import {getServerSession} from '@delmaredigital/payload-better-auth';
import config from '@payload-config';import{Stack,Panel,Heading,Body,TextLink}from'@/components/ui/semantic';
import{SignOutButton}from'@/components/features/auth/AccountForms';
export const dynamic='force-dynamic';
export default async function Account(){
 const payload=await getPayload({config});const session=await getServerSession(payload,await headers());
 if(!session)redirect('/sign-in');
 const user=session.user as {name?:string;email?:string;role?:string};
 return <Stack className="max-w-xl mx-auto py-16 px-5"><Panel><Heading>Your InFraX account</Heading><Body>{user.name||'Signed-in account'}</Body><Body>{user.email}</Body><Body>Private organization access is verified separately. Creating an account does not make you an operator or staff administrator.</Body>{user.role==='admin'?<TextLink href="/admin">Open content administration</TextLink>:null}<TextLink href="/contact">Request an infrastructure assessment</TextLink><SignOutButton/></Panel></Stack>;
}
