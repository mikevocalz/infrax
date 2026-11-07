'use client';
import{useEffect,useRef}from'react';import{createStore,type StoreApi}from'zustand/vanilla';import{useStore}from'zustand';
import{Select,Notice,Action,Stack,Body,TextLink}from'@/components/ui/semantic';import{ResearchCards}from'@/components/ui/research';
import{STATE_CODES}from'@/client/research-contract.mjs';
import{createResearchClient,createResearchController,type ResearchSnapshot}from'@/client/research-client.mjs';
type State=ResearchSnapshot&{refresh:number};
export function MarketResearch(){
 const ref=useRef<StoreApi<State>|null>(null);
 if(!ref.current)ref.current=createStore<State>(()=>({region:'TX',status:'loading',result:null,refresh:0}));
 const store=ref.current,state=useStore(store);
 useEffect(()=>{
  const controller=createResearchController({load:createResearchClient({baseUrl:window.location.origin}),onChange:next=>store.setState(next)});
  void controller.select(state.region);return()=>controller.dispose();
 },[state.region,state.refresh,store]);
 const denied=state.status==='signed_out'||state.status==='forbidden';
 const failure=['invalid_response','unavailable'].includes(state.status);
 return <Stack><Body>Review source coverage and data-quality gaps before publication. Counts represent selected source worksheets, not verified data-center supply.</Body>
  <Select id="research-state" label="State or territory" value={state.region} onValue={region=>store.setState({region,status:'loading',result:null})} options={STATE_CODES.map(value=>({value,label:value}))}/>
  {state.status==='loading'?<Notice>Loading internal source evidence…</Notice>:null}
  {denied?<Stack><Notice error>{state.status==='signed_out'?'Your session has expired. Sign in again to review source evidence.':'This account does not have staff source-review access.'}</Notice><TextLink href={state.status==='signed_out'?'/sign-in':'/account'}>{state.status==='signed_out'?'Sign in':'Return to account'}</TextLink></Stack>:null}
  {failure?<Stack><Notice error>{state.status==='invalid_response'?'Source evidence failed validation. It has not been displayed.':'Research is temporarily unavailable. No sample data has been substituted.'}</Notice><Action onClick={()=>store.setState(s=>({refresh:s.refresh+1,status:'loading',result:null}))}>Retry</Action></Stack>:null}
  {state.status==='empty'?<Notice>No normalized summaries have been imported for this state. This does not mean the region has no infrastructure.</Notice>:null}
  {state.status==='ready'&&state.result?.state===state.region?<ResearchCards rows={state.result.data}/>:null}
 </Stack>;
}
