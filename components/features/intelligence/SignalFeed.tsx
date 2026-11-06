'use client';
import {useEffect,useRef} from 'react';
import {createStore} from 'zustand/vanilla';import{useStore}from'zustand';
import {createInfraXClient,errorMessage,sourceLink} from '@/client/api.mjs';
import {Stack,Panel,Heading,Body,Notice,Action,TextLink} from '@/components/ui/semantic';
type Signal={id:string;headline:string;category:string;geography:string|null;source_url:string;provider:string;published_at:string|null;observed_at:string|null};
function date(value:string|null){if(!value)return 'Not supplied';const d=new Date(value);return Number.isFinite(d.getTime())?d.toLocaleDateString():'Not supplied';}
function makeStore(){return createStore(()=>({status:'loading',signals:[] as Signal[],error:'',hasMore:false}));}
export default function SignalFeed(){
 const ref=useRef<ReturnType<typeof makeStore>|null>(null);if(!ref.current)ref.current=makeStore();const store=ref.current,state=useStore(store);
 const request=useRef<AbortController|null>(null);
 const load=async()=>{request.current?.abort();const controller=new AbortController();request.current=controller;store.setState({status:'loading',error:''});try{const result=await createInfraXClient().signals({signal:controller.signal});if(!controller.signal.aborted)store.setState({status:result.status,signals:result.data,hasMore:!!result.nextCursor});}catch(e){if(!controller.signal.aborted)store.setState({status:'unavailable',signals:[],error:errorMessage(e)});}};
 useEffect(()=>{void load();return()=>request.current?.abort();},[]);
 return <Stack><Heading>Reviewed market signals</Heading><Body>Published source records—not operator capacity guarantees. Observation and publication dates are shown separately.</Body>
 {state.status==='loading'?<Notice>Loading reviewed sources…</Notice>:state.status==='empty'?<Notice>No reviewed signals have been published yet.</Notice>:state.status==='unavailable'?<Notice error>{state.error}</Notice>:null}
 {state.signals.map(signal=><Panel key={signal.id}><Heading>{signal.headline}</Heading><Body>{signal.category} · {signal.geography??'Region not supplied'}</Body><Body>Published: {date(signal.published_at)} · Observed: {date(signal.observed_at)}</Body>{sourceLink(signal.source_url)?<TextLink external href={sourceLink(signal.source_url)!}>Read source: {signal.provider}</TextLink>:<Notice>Source link is unavailable.</Notice>}</Panel>)}
 {state.hasMore?<Body>Showing the first page of published records. Additional pagination is not connected in this view yet.</Body>:null}
 <Action onClick={()=>void load()} disabled={state.status==='loading'}>Refresh sources</Action>
 </Stack>;
}
