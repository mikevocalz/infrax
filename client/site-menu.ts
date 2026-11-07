import {createStore} from 'zustand/vanilla';
/** A store per mounted header: never share visitor state across server requests. */
export function createSiteMenu(){return createStore(()=>({group:null as string|null,drawer:false,mobileGroup:null as string|null,account:'Sign in',accountHref:'/sign-in'}));}
