'use client';
import{useEffect,useMemo,useRef,type ReactNode}from'react';import{createStore,type StoreApi}from'zustand/vanilla';import{useStore}from'zustand';
import{usePathname,useRouter}from'next/navigation';import{ViewportProbe}from'../ui/ViewportProbe.web';import type{Region}from'../layout.mjs';
import{WorkspaceProvider}from'./Provider';import{WorkspaceApp}from'./WorkspaceApp';import{createResearchClient}from'../../../client/research-client.mjs';
export function WebWorkspaceProvider({children}:{children:ReactNode}){const ref=useRef<StoreApi<{origin:string}>|null>(null);if(!ref.current)ref.current=createStore(()=>({origin:''}));const store=ref.current,origin=useStore(store,s=>s.origin);useEffect(()=>{store.setState({origin:window.location.origin});},[store]);return <WorkspaceProvider origin={origin||undefined}>{children}</WorkspaceProvider>;}
export function WorkspaceWebHost(){
 const router=useRouter(),href=usePathname(),probe=useRef<HTMLDivElement>(null),ref=useRef<StoreApi<{region:Region;origin:string}>|null>(null);
 if(!ref.current)ref.current=createStore(()=>({region:{x:0,y:0,width:390,height:844},origin:''}));const store=ref.current,state=useStore(store);
 const load=useMemo(()=>state.origin?createResearchClient({baseUrl:state.origin}):null,[state.origin]);
 useEffect(()=>{const visual=window.visualViewport,book=matchMedia('(horizontal-viewport-segments: 2)'),table=matchMedia('(vertical-viewport-segments: 2)');
  const measure=()=>{const v={x:visual?.offsetLeft??0,y:visual?.offsetTop??0,width:visual?.width??innerWidth,height:visual?.height??innerHeight},box=probe.current?.getBoundingClientRect();const segmented=(book.matches||table.matches)&&box&&box.width>0&&box.height>0;const r=segmented?{x:Math.max(v.x,box.x),y:Math.max(v.y,box.y),width:0,height:0}:{...v};if(segmented){r.width=Math.max(1,Math.min(v.x+v.width,box.right)-r.x);r.height=Math.max(1,Math.min(v.y+v.height,box.bottom)-r.y);}store.setState({region:r,origin:window.location.origin});};
  measure();addEventListener('resize',measure);visual?.addEventListener('resize',measure);visual?.addEventListener('scroll',measure);book.addEventListener('change',measure);table.addEventListener('change',measure);
  return()=>{removeEventListener('resize',measure);visual?.removeEventListener('resize',measure);visual?.removeEventListener('scroll',measure);book.removeEventListener('change',measure);table.removeEventListener('change',measure);};
 },[store]);
 return <><ViewportProbe ref={probe}/><WorkspaceApp href={href} go={path=>router.push(path)} back={()=>{if(window.history.length>1)router.back();else router.replace('/app');}} region={state.region} loadResearch={load}/></>;
}
