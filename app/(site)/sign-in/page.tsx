import {SignInForm} from '@/components/features/auth/AccountForms';
import {Stack} from '@/components/ui/semantic';
export const dynamic='force-dynamic';
export default function SignIn(){return <Stack className="max-w-xl mx-auto py-16 px-5"><SignInForm allowSignup={process.env.INFRAX_ALLOW_SIGNUP==='true'}/></Stack>;}
