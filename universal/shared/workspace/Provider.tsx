'use client';
import{createContext,useContext,useEffect,useMemo,useRef,type ReactNode}from'react';
import{createStore,type StoreApi}from'zustand/vanilla';import{useStore}from'zustand';
import{createWorkspaceClient,type Client,WorkspaceError}from'./client.mjs';
import type{Session,Workspace}from'./routes.mjs';
export type Item={id:string;name?:string;data?:Record<string,any>;status?:string;version?:number;parent?:string;[key:string]:any};
type State={session:Session|null;sessionState:'loading'|'ready'|'unavailable';orgId:string;workspace:Workspace;epoch:number;drawer:boolean;drafts:Record<string,Record<string,string>>;pending:Record<string,{key:string;value:Record<string,any>}>;selected:Record<string,string[]>;preferences:{contrast:boolean;largeText:boolean;reduceMotion:boolean};};
type Context={store:StoreApi<State>;client:Client|null};
const AppContext=createContext<Context|null>(null);
export function WorkspaceProvider({origin,children,makeId}:{origin?:string;children:ReactNode;makeId?:()=>string}){
 const ref=useRef<StoreApi<State>|null>(null);
 if(!ref.current)ref.current=createStore<State>(()=>({session:null,sessionState:'loading',orgId:'',workspace:'client',epoch:0,drawer:false,drafts:{},pending:{},selected:{},preferences:{contrast:false,largeText:false,reduceMotion:false}}));
 const store=ref.current,epoch=useStore(store,s=>s.epoch);
 const client=useMemo(()=>{try{return origin?createWorkspaceClient({baseUrl:origin,makeId}):null;}catch{return null;}},[origin,makeId]);
 useEffect(()=>{if(!client){store.setState({sessionState:'unavailable',session:null});return;}
  const controller=new AbortController();store.setState({sessionState:'loading'});
  client.session({signal:controller.signal}).then((session:Session)=>{
   if(controller.signal.aborted)return;
   if(!session||!Array.isArray(session.organizations)||typeof session.capabilities!=='object'||session.organizations.some(o=>typeof o.id!=='string'||typeof o.name!=='string')||(session.user&&typeof session.user.id!=='string'))throw Error('Invalid session');
   const previous=store.getState();const changed=previous.session?.user?.id!==session.user?.id;
   const orgId=session.organizations.some(o=>o.id===previous.orgId)?previous.orgId:session.organizations[0]?.id??'';
   store.setState({session,sessionState:'ready',orgId,...(changed?{drafts:{},pending:{},selected:{},drawer:false}:{} )});
  }).catch(()=>{if(!controller.signal.aborted)store.setState({session:null,sessionState:'unavailable',drafts:{},pending:{},selected:{}});});
  return()=>controller.abort();
 },[client,store,epoch]);
 const value=useMemo(()=>({store,client}),[store,client]);return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
export function useApp(){const value=useContext(AppContext);if(!value)throw Error('Workspace provider required');return value;}
export function useAppState(){const{store}=useApp();return useStore(store);}
export function useDraft(key:string,defaults:Record<string,string>={}){
 const{store}=useApp(),saved=useStore(store,s=>s.drafts[key]);
 return [saved??defaults,(field:string,value:string)=>store.setState(s=>({drafts:{...s.drafts,[key]:{...defaults,...s.drafts[key],[field]:value}}}))] as const;
}
export function changeOrganization(store:StoreApi<State>,id:string){if(!store.getState().session?.organizations.some(o=>o.id===id))return;store.setState({orgId:id,drafts:{},pending:{},selected:{},drawer:false});}
export function refreshSession(store:StoreApi<State>){store.setState(s=>({epoch:s.epoch+1}));}
export type LoadState={status:'loading'|'ready'|'empty'|'error';data:Item[];error:string;nextCursor:string|null};
export function useRecords(resource:string,options:{id?:string;parent?:string;publicFeed?:boolean;enabled?:boolean}={}){
 const{client,store}=useApp(),orgId=useStore(store,s=>s.orgId),subject=useStore(store,s=>s.session?.user?.id),epoch=useStore(store,s=>s.epoch);
 const ref=useRef<StoreApi<LoadState&{refresh:number}>|null>(null);if(!ref.current)ref.current=createStore(()=>({status:'loading' as const,data:[],error:'',nextCursor:null,refresh:0}));
 const local=ref.current,value=useStore(local),{id,parent,publicFeed=false,enabled=true}=options;
 useEffect(()=>{const controller=new AbortController();local.setState({status:'loading',data:[],error:'',nextCursor:null});
  if(!enabled){local.setState({status:'empty'});return()=>controller.abort();}
  if(!client){local.setState({status:'error',error:'UNAVAILABLE'});return()=>controller.abort();}
  const promise=publicFeed?client.feed(resource,{signal:controller.signal}):client.list(resource,{organizationId:orgId||undefined,id,parent,signal:controller.signal});
  promise.then(result=>{if(controller.signal.aborted)return;if(!result||!Array.isArray(result.data)||result.data.length>100||result.data.some((r:Item)=>!r||typeof r.id!=='string'))throw Error('Invalid list');local.setState({status:result.data.length?'ready':'empty',data:result.data,error:'',nextCursor:result.nextCursor??null});}).catch(error=>{if(!controller.signal.aborted)local.setState({status:'error',data:[],error:error instanceof WorkspaceError?error.code:'UNAVAILABLE'});});
  return()=>controller.abort();
 },[client,orgId,subject,epoch,resource,id,parent,publicFeed,enabled,value.refresh,local]);
 return {...value,reload:()=>local.setState(s=>({refresh:s.refresh+1})),async loadMore(){if(!value.nextCursor||!client)return;try{const result=publicFeed?await client.feed(resource,{after:value.nextCursor}):await client.list(resource,{organizationId:orgId||undefined,parent,after:value.nextCursor});if(!Array.isArray(result.data))throw Error();local.setState(s=>({data:[...s.data,...result.data.filter((r:Item)=>!s.data.some(old=>old.id===r.id))],nextCursor:result.nextCursor??null}));}catch{local.setState({error:'UNAVAILABLE'});}}};
}
