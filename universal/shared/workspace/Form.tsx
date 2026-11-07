import{useRef}from'react';import{createStore,type StoreApi}from'zustand/vanilla';import{useStore}from'zustand';
import{FIELDS,validateForm}from'./forms.mjs';
import{useApp,useDraft}from'./Provider';import{WorkspaceError}from'./client.mjs';
import{Field}from'../ui/Primitives';import{Action,Body,Stack,Notice,errorText,Toggle}from'./ui';
type Local={busy:boolean;errors:Record<string,string>;message:string;receipt:string;consent:boolean};
export function EntryForm({kind,formKey,defaults={},submitLabel='Save',onSubmit,onSaved,fields,requireConsent=false}:{kind:string;formKey:string;defaults?:Record<string,string>;submitLabel?:string;fields?:readonly string[];requireConsent?:boolean;onSubmit:(value:Record<string,string>,key:string)=>Promise<any>;onSaved?:(result:any)=>void}){
 const{client,store}=useApp();const[draft,edit]=useDraft(formKey,defaults);const pending=useStore(store,s=>s.pending[formKey]);
 const ref=useRef<StoreApi<Local>|null>(null);if(!ref.current)ref.current=createStore<Local>(()=>({busy:false,errors:{},message:'',receipt:'',consent:false}));const local=ref.current,state=useStore(local);
 const spec=FIELDS[kind]??[];
 const submit=async()=>{if(state.busy)return;if(requireConsent&&!state.consent){local.setState({message:'Please consent to processing this request.'});return;}
  const checked=validateForm(kind,draft);if(!checked.ok){local.setState({errors:checked.errors,message:'Please correct the indicated fields.'});return;}
  try{const operation=pending??{key:client?.id()??globalThis.crypto.randomUUID(),value:checked.value};store.setState(s=>({pending:{...s.pending,[formKey]:operation}}));local.setState({busy:true,errors:{},message:'',receipt:''});
   const result=await onSubmit(operation.value,operation.key);if(!result||!(result.id||result.receiptId||result.success||result.ok))throw new WorkspaceError('UNAVAILABLE');
   store.setState(s=>{const p={...s.pending};delete p[formKey];return{pending:p};});local.setState({busy:false,receipt:String(result.receiptId??result.id??'Confirmed'),message:''});onSaved?.(result);
  }catch(error){const code=error instanceof WorkspaceError?error.code:'UNAVAILABLE';if(['INVALID_INPUT','FORBIDDEN','CONFLICT','SIGNED_OUT','RATE_LIMITED'].includes(code))store.setState(s=>{const p={...s.pending};delete p[formKey];return{pending:p};});local.setState({busy:false,message:errorText(code)});}
 };
 return <Stack>{spec.filter(([key])=>!fields||fields.includes(key)).map(([key,label,type,required])=><Field key={key} id={formKey+'-'+key} label={label+(required?' *':'')} value={draft[key]??''} onChangeText={value=>edit(key,value)} editable={!state.busy&&!pending} secureTextEntry={type==='password'} keyboardType={type==='number'?'decimal-pad':type==='email'?'email-address':'default'} autoCapitalize={type==='email'||type==='password'?'none':'sentences'} multiline={type==='multiline'} errorText={state.errors[key]} helperText={type==='multiline'?'Do not include passwords or unapproved confidential information.':undefined}/>) }
  {requireConsent?<Toggle label="I authorize InFraX to process this request and contact me about it." value={state.consent} onChange={consent=>local.setState({consent})}/>:null}
  {state.message?<Notice error>{state.message}</Notice>:null}
  {pending&&!state.busy?<Notice>The last operation was not confirmed. Retry the same submission; fields remain locked to prevent a duplicate with changed details.</Notice>:null}
  {state.receipt?<Notice title="Saved confirmation">Reference: {state.receipt}</Notice>:null}
  <Action title={state.busy?'Saving…':pending?'Retry unchanged submission':submitLabel} disabled={state.busy} onPress={()=>{void submit();}}/>
 </Stack>;
}
