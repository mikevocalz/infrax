'use client';
import{useEffect,useRef}from'react';import{createStore,type StoreApi}from'zustand/vanilla';import{useStore}from'zustand';
import{Select,Notice,Action,Stack,Body}from'@/components/ui/semantic';import{ResearchCards}from'@/components/ui/research';
import type{ResearchResponse}from'@/client/research-types';
const states='AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY'.split(' ');
type State={region:string;status:'loading'|'ready'|'empty'|'error';result:ResearchResponse|null;refresh:number};
export function MarketResearch(){
 const ref=useRef<StoreApi<State>|null>(null);
 if(!ref.current)ref.current=createStore<State>(()=>({region:'TX',status:'loading',result:null,refresh:0}));
 const store=ref.current,state=useStore(store);
 useEffect(()=>{
  const controller=new AbortController();store.setState({status:'loading',result:null});
  (async()=>{try{const r=await fetch('/api/v1/research/context?state='+encodeURIComponent(state.region),{credentials:'same-origin',signal:controller.signal,cache:'no-store'});
   if(!r.ok)throw Error('unavailable');const result=await r.json() as ResearchResponse;
   if(result.schema!=='infrax-market-context-v1'||result.state!==state.region||!Array.isArray(result.data)||!['ready','empty'].includes(result.status))throw Error('invalid');
   if(!controller.signal.aborted)store.setState({status:result.status,result});
  }catch{if(!controller.signal.aborted)store.setState({status:'error',result:null});}})();
  return()=>controller.abort();
 },[state.region,state.refresh,store]);
 return <Stack><Body>Review source coverage and data-quality gaps before any publication. Counts represent rows in selected source worksheets, not verified infrastructure supply.</Body>
  <Select id="research-state" label="State or District of Columbia" value={state.region} onValue={region=>store.setState({region})} options={states.map(value=>({value,label:value}))}/>
  {state.status==='loading'?<Notice>Loading internal source evidence…</Notice>:null}
  {state.status==='error'?<Stack><Notice error>Research is unavailable or your staff session has expired. No sample data has been substituted.</Notice><Action onClick={()=>store.setState(s=>({refresh:s.refresh+1}))}>Retry</Action></Stack>:null}
  {state.status==='empty'?<Notice>No normalized summaries have been imported for this state. This does not mean the region has no infrastructure.</Notice>:null}
  {state.status==='ready'&&state.result?<ResearchCards rows={state.result.data}/>:null}
 </Stack>;
}
