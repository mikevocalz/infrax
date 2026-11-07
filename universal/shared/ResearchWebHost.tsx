'use client';
import{useEffect,useRef}from'react';import{createStore,type StoreApi}from'zustand/vanilla';import{useStore}from'zustand';
import{ResearchScreen}from'./ResearchScreen';
import{createResearchClient}from'../../client/research-client.mjs';
import{ViewportProbe}from'./ui/ViewportProbe.web';
import type{Region}from'./layout.mjs';import{Body}from'./ui/Primitives';
type ResearchClient=ReturnType<typeof createResearchClient>;
/** Same feature component as native. The probe reports a real browser segment. */
export function ResearchWebHost(){
 const probe=useRef<HTMLDivElement>(null),ref=useRef<StoreApi<{load:ResearchClient|null;region:Region}>|null>(null);
 if(!ref.current)ref.current=createStore<{load:ResearchClient|null;region:Region}>(()=>({load:null,region:{x:0,y:0,width:390,height:844}}));
 const store=ref.current,state=useStore(store);
 useEffect(()=>{
  const viewport=window.visualViewport,book=matchMedia('(horizontal-viewport-segments: 2)'),table=matchMedia('(vertical-viewport-segments: 2)');
  const measure=()=>{
   const visual={x:viewport?.offsetLeft??0,y:viewport?.offsetTop??0,width:viewport?.width??innerWidth,height:viewport?.height??innerHeight};
   const box=probe.current?.getBoundingClientRect();
   const segmented=(book.matches||table.matches)&&box&&box.width>0&&box.height>0;
   const area=segmented?{x:Math.max(visual.x,box.x),y:Math.max(visual.y,box.y),width:0,height:0}:{...visual};
   if(segmented){area.width=Math.max(1,Math.min(visual.x+visual.width,box.right)-area.x);area.height=Math.max(1,Math.min(visual.y+visual.height,box.bottom)-area.y);}
   store.setState({region:area});
  };
  measure();store.setState({load:createResearchClient({baseUrl:window.location.origin})});
  addEventListener('resize',measure);viewport?.addEventListener('resize',measure);viewport?.addEventListener('scroll',measure);book.addEventListener('change',measure);table.addEventListener('change',measure);
  return()=>{removeEventListener('resize',measure);viewport?.removeEventListener('resize',measure);viewport?.removeEventListener('scroll',measure);book.removeEventListener('change',measure);table.removeEventListener('change',measure);};
 },[store]);
 return <><ViewportProbe ref={probe}/>{state.load?<ResearchScreen load={state.load} sessionScope="same-origin-web-session" region={state.region}/>:<Body>Preparing source review…</Body>}</>;
}
