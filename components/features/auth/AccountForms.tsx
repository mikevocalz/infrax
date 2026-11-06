'use client';
import {useRef,useEffect} from 'react';import {createStore} from 'zustand/vanilla';import{useStore}from'zustand';
import {Panel,Heading,Body,Form,Field,Action,Notice,TextLink} from '@/components/ui/semantic';
function factory(){return createStore(()=>({email:'',password:'',name:'',creating:false,pending:false,error:''}));}
export function SignInForm({allowSignup=false}:{allowSignup?:boolean}){
 const ref=useRef<ReturnType<typeof factory>|null>(null);if(!ref.current)ref.current=factory();const store=ref.current,s=useStore(store);
 useEffect(()=>()=>store.setState({password:''}),[store]);
 const submit=async()=>{
  if(store.getState().pending)return;store.setState({pending:true,error:''});
  try{
   const data=store.getState(),creating=allowSignup&&data.creating;
   const response=await fetch(creating?'/api/auth/sign-up/email':'/api/auth/sign-in/email',{method:'POST',redirect:'error',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:data.email,password:data.password,...(creating?{name:data.name}:{})}),signal:AbortSignal.timeout(15000)});
   if(!response.ok)throw new Error('Sign-in could not be completed. Check your details or contact support.');
   const session=await fetch('/api/auth/get-session',{credentials:'same-origin',cache:'no-store',signal:AbortSignal.timeout(15000)});
   const identity=await session.json();if(!session.ok||!identity?.user?.id)throw new Error('No confirmed session was returned. Please sign in again.');
   store.setState({password:''});window.location.assign('/account');
  }catch(e){store.setState({error:e instanceof Error&&e.message.startsWith('No confirmed')?e.message:'Sign-in could not be completed. Check your details or contact support.'});}finally{store.setState({pending:false});}
 };
 return <Panel><Heading>{s.creating?'Create your InFraX account':'Sign in to InFraX'}</Heading><Body>Your account is separate from staff approval or access to an organization.</Body><Form onSubmit={e=>{e.preventDefault();void submit();}}>
 {s.creating?<Field id="auth-name" label="Your name" value={s.name} onValue={name=>store.setState({name})} required maxLength={150} disabled={s.pending}/>:null}
 <Field id="auth-email" label="Email address" type="email" autoComplete="email" value={s.email} onValue={email=>store.setState({email})} required maxLength={254} disabled={s.pending}/>
 <Field id="auth-password" label="Password" type="password" autoComplete={s.creating?'new-password':'current-password'} minLength={s.creating?12:1} value={s.password} onValue={password=>store.setState({password})} required maxLength={128} disabled={s.pending}/>
 {s.error?<Notice error>{s.error}</Notice>:null}
 <Action type="submit" disabled={s.pending} aria-busy={s.pending}>{s.pending?'Checking account…':s.creating?'Create account':'Sign in'}</Action>
 {allowSignup?<Action disabled={s.pending} onClick={()=>store.setState({creating:!s.creating,error:'',password:''})}>{s.creating?'Already registered? Sign in':'Create account'}</Action>:<Body>Account registration is currently invitation-only. No password-reset email is promised by this screen.</Body>}
 </Form><TextLink href="/contact">Contact InFraX</TextLink></Panel>;
}
export function SignOutButton(){
 const ref=useRef<ReturnType<typeof factory>|null>(null);if(!ref.current)ref.current=factory();const store=ref.current,s=useStore(store);
 const exit=async()=>{if(s.pending)return;store.setState({pending:true,error:''});try{const response=await fetch('/api/auth/sign-out',{method:'POST',credentials:'same-origin',redirect:'error',headers:{'Content-Type':'application/json'},body:'{}',signal:AbortSignal.timeout(15000)});if(!response.ok)throw new Error();window.location.assign('/sign-in');}catch{store.setState({pending:false,error:'Sign-out was not confirmed. Please retry.'});}};
 return <><Action disabled={s.pending} onClick={()=>void exit()}>{s.pending?'Signing out…':'Sign out'}</Action>{s.error?<Notice error>{s.error}</Notice>:null}</>;
}
