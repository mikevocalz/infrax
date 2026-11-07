import {SignInForm} from '@/components/features/auth/AccountForms';
import {PageFrame} from '@/components/ui/marketing';
export const dynamic='force-dynamic';
export default function SignIn(){return <PageFrame eyebrow="Account access" title="Welcome back." summary="Sign in to your InFraX account. Organization and staff permissions are managed separately."><SignInForm allowSignup={process.env.INFRAX_ALLOW_SIGNUP==='true'}/></PageFrame>;}
