'use client';
import {useRef} from 'react';
import {createStore} from 'zustand/vanilla';
import {useStore} from 'zustand';
import {createInfraXClient,createIntakeSubmission,errorMessage} from '@/client/api.mjs';
import {Stack,Panel,Heading,Body,Notice,Action,Form,Fields,Field,Select,TextArea,Check,TextLink} from '@/components/ui/semantic';
type Draft={userType:string;name:string;email:string;organization:string;deploymentSize:string;timeline:string;notes:string;assetType:string;capitalAmount:string;availableMW:string;market:string;regions:string[];consent:boolean};
const initial=():Draft=>({userType:'developer',name:'',email:'',organization:'',deploymentSize:'',timeline:'',notes:'',assetType:'',capitalAmount:'',availableMW:'',market:'',regions:[],consent:false});
function makeStore(){return createStore(()=>({draft:initial(),reviewing:false,pending:false,attempted:false,error:'',receipt:''}));}
export default function IntakeFlow(){
 const storeRef=useRef<ReturnType<typeof makeStore>|null>(null);if(!storeRef.current)storeRef.current=makeStore();const store=storeRef.current;
 const sender=useRef<ReturnType<typeof createIntakeSubmission>|null>(null);if(!sender.current)sender.current=createIntakeSubmission(createInfraXClient());
 const state=useStore(store);const form=state.draft;
 const update=(key:keyof Draft,value:string|boolean)=>{if(!store.getState().attempted)store.setState(s=>({draft:{...s.draft,[key]:value},error:''}));};
 const submit=async()=>{if(store.getState().pending)return;store.setState({pending:true,attempted:true,error:''});try{const result=await sender.current!.submit(store.getState().draft);store.setState({receipt:result.receiptId});}catch(e){store.setState({error:errorMessage(e)});}finally{store.setState({pending:false});}};
 if(state.receipt)return <Panel><Heading>Request received</Heading><Notice>Reference: {state.receipt}</Notice><Body>Your inquiry is saved. The internal notification is queued; this does not confirm an email was delivered. Our team can review your requirements before agreeing next steps.</Body><TextLink href="/">Return home</TextLink></Panel>;
 return <Stack className="max-w-2xl mx-auto"><Heading>{state.reviewing?'Review your request':'Request an infrastructure assessment'}</Heading><Body>Share your requirements. Do not include confidential engineering documents or access credentials.</Body>
 <Form onSubmit={event=>{event.preventDefault();if(state.reviewing)void submit();else store.setState({reviewing:true});}}>
 <Fields disabled={state.reviewing||state.attempted}>
 <Select id="intake-role" label="Your role" value={form.userType} onValue={v=>update('userType',v)} options={[{value:'developer',label:'Enterprise buyer / Developer'},{value:'investor',label:'Investor'},{value:'operator',label:'Operator / Supplier'},{value:'advisor',label:'Advisor'}]}/>
 <Field id="intake-name" label="Full name" autoComplete="name" required maxLength={150} value={form.name} onValue={v=>update('name',v)}/>
 <Field id="intake-email" label="Work email" type="email" autoComplete="email" required maxLength={254} value={form.email} onValue={v=>update('email',v)}/>
 <Field id="intake-company" label="Organization" autoComplete="organization" required maxLength={200} value={form.organization} onValue={v=>update('organization',v)}/>
 {form.userType==='investor'?<Stack><Field id="asset-type" label="Asset or investment type" maxLength={200} value={form.assetType} onValue={v=>update('assetType',v)}/><Field id="capital-range" label="Capital range (optional)" maxLength={200} value={form.capitalAmount} onValue={v=>update('capitalAmount',v)}/></Stack>:form.userType==='operator'?<Stack><Field id="available-mw" label="Operator-reported critical IT capacity (MW)" maxLength={200} value={form.availableMW} onValue={v=>update('availableMW',v)}/><Field id="market" label="Market" maxLength={200} value={form.market} onValue={v=>update('market',v)}/></Stack>:<Stack><Field id="deployment-size" label="Required critical IT power / deployment size" maxLength={200} value={form.deploymentSize} onValue={v=>update('deploymentSize',v)}/><Field id="timeline" label="Required timeline" maxLength={200} value={form.timeline} onValue={v=>update('timeline',v)}/></Stack>}
 <TextArea id="intake-notes" label="Location, cooling, network and other requirements" value={form.notes} onValue={v=>update('notes',v)}/>
 <Check id="intake-consent" label="I authorize InFraX to use these details to respond to this inquiry." checked={form.consent} onValue={v=>update('consent',v)}/>
 </Fields>
 {state.error?<Notice error>{state.error}</Notice>:null}
 {state.attempted&&!state.receipt?<Body>Retry sends the same request safely. Fields remain locked to avoid creating a duplicate after an uncertain response.</Body>:null}
 <Action type="submit" disabled={!form.consent||state.pending} aria-busy={state.pending}>{state.pending?'Saving request…':state.reviewing?(state.attempted?'Retry same request':'Confirm and submit'):'Review request'}</Action>
 {state.reviewing&&!state.attempted?<Action onClick={()=>store.setState({reviewing:false})}>Edit details</Action>:null}
 </Form></Stack>;
}
