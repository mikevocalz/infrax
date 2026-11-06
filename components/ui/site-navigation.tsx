'use client';
import{useEffect,useRef,type KeyboardEvent}from'react';import{usePathname}from'next/navigation';import Link from'next/link';import{useStore}from'zustand';import{ArrowUpRight,ChevronDown,Menu,Radio,X}from'lucide-react';
import{SITE_NAV,ASSESSMENT_ACTION,activeGroup}from'@/lib/ux/navigation.mjs';import{createSiteMenu}from'@/client/site-menu';
/** Semantic web navigation adapter. Raw host elements remain within /ui. */
export function SiteHeader({authAvailable=false}:{authAvailable?:boolean}){
 const ref=useRef<ReturnType<typeof createSiteMenu>|null>(null);if(!ref.current)ref.current=createSiteMenu();const store=ref.current,state=useStore(store),path=usePathname();
 const root=useRef<HTMLElement>(null),dialog=useRef<HTMLDialogElement>(null),opener=useRef<HTMLButtonElement>(null);const selected=activeGroup(path);
 const closeGroup=()=>store.setState({group:null}),closeDrawer=()=>store.setState({drawer:false});
 useEffect(()=>{store.setState({group:null,drawer:false});},[path,store]);
 useEffect(()=>{const outside=(e:PointerEvent)=>{if(!root.current?.contains(e.target as Node))closeGroup();};document.addEventListener('pointerdown',outside);return()=>document.removeEventListener('pointerdown',outside);},[store]);
 useEffect(()=>{if(!authAvailable)return;const controller=new AbortController();void fetch('/api/auth/get-session',{cache:'no-store',credentials:'same-origin',signal:controller.signal}).then(async r=>r.ok?await r.json():null).then(session=>{if(!controller.signal.aborted&&session?.user?.id)store.setState({account:'Account',accountHref:'/account'});}).catch(()=>{});return()=>controller.abort();},[authAvailable,store]);
 useEffect(()=>{const element=dialog.current;if(!element)return;if(!state.drawer){if(element.open)element.close();return;}const prior=document.body.style.overflow;if(!element.open)element.showModal();document.body.style.overflow='hidden';return()=>{document.body.style.overflow=prior;if(element.open)element.close();opener.current?.focus({preventScroll:true});};},[state.drawer]);
 useEffect(()=>{const back=()=>closeDrawer();window.addEventListener('popstate',back);return()=>window.removeEventListener('popstate',back);},[store]);
 const keyboard=(event:KeyboardEvent<HTMLElement>)=>{if(event.key==='Escape'&&state.group){event.preventDefault();const id=state.group;closeGroup();document.getElementById('nav-'+id)?.focus();}};
 const trapDrawerFocus=(event:KeyboardEvent<HTMLDialogElement>)=>{
  if(event.key!=='Tab')return;
  const targets=Array.from(event.currentTarget.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex="0"]')).filter(el=>el.getClientRects().length>0&&el.tabIndex>=0);
  if(!targets.length){event.preventDefault();event.currentTarget.focus();return;}
  const first=targets[0],last=targets[targets.length-1];
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
 };
 return <><Link href="#main-content" className="ix-skip">Skip to content</Link>
 <header className="ix-header" ref={root} onKeyDown={keyboard}><div className="ix-header-inner">
 <Link href="/" className="ix-logo" aria-label="InFraX home"><Radio aria-hidden="true" size={24}/><span>InFra<span className="ix-accent">X</span></span></Link>
 <nav aria-label="Main navigation" className="ix-desktop-nav" onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget as Node))closeGroup();}}><ul className="ix-nav-list">{SITE_NAV.map(g=><li key={g.id} className="ix-nav-group">
 <button id={'nav-'+g.id} type="button" className="ix-nav-trigger" data-current={selected===g.id||undefined} aria-expanded={state.group===g.id} aria-controls={'nav-panel-'+g.id} onClick={()=>store.setState({group:state.group===g.id?null:g.id})}>{g.label}<ChevronDown aria-hidden="true" size={15}/></button>
 <div id={'nav-panel-'+g.id} className="ix-dropdown" hidden={state.group!==g.id}><p className="ix-menu-description">{g.description}</p><ul>{g.items.map(i=><li key={i.href}><Link href={i.href} aria-current={path===i.href?'page':undefined} onClick={closeGroup}>{i.label}<ArrowUpRight size={16} aria-hidden="true"/></Link></li>)}</ul></div></li>)}</ul></nav>
 <div className="ix-header-actions">{authAvailable?<Link href={state.accountHref} className="ix-account-link">{state.account}</Link>:null}<Link href={ASSESSMENT_ACTION.href} className="ix-action ix-primary ix-header-cta">{ASSESSMENT_ACTION.label}</Link><button type="button" ref={opener} className="ix-menu-toggle" aria-haspopup="dialog" aria-expanded={state.drawer} aria-controls="website-menu" onClick={()=>store.setState({drawer:true,group:null})}><span>Menu</span><Menu aria-hidden="true" size={22}/></button></div>
 </div></header>
 <dialog id="website-menu" ref={dialog} className="ix-drawer" onKeyDown={trapDrawerFocus} aria-labelledby="website-menu-title" onCancel={e=>{e.preventDefault();closeDrawer();}} onClose={()=>{if(store.getState().drawer)closeDrawer();}} onClick={e=>{if(e.target===e.currentTarget){const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right)closeDrawer();}}}>
 <div className="ix-drawer-top"><h2 id="website-menu-title">Explore InFraX</h2><button type="button" aria-label="Close menu" autoFocus onClick={closeDrawer}><X aria-hidden="true" size={22}/></button></div>
 <Link href={ASSESSMENT_ACTION.href} className="ix-action ix-primary ix-drawer-cta" onClick={closeDrawer}>{ASSESSMENT_ACTION.label}<ArrowUpRight aria-hidden="true" size={18}/></Link>
 <nav aria-label="Mobile website navigation"><ul className="ix-mobile-groups">{SITE_NAV.map(g=><li key={g.id}><button type="button" aria-expanded={state.mobileGroup===g.id} aria-controls={'mobile-'+g.id} onClick={()=>store.setState({mobileGroup:state.mobileGroup===g.id?null:g.id})}>{g.label}<ChevronDown aria-hidden="true" size={18}/></button><ul id={'mobile-'+g.id} hidden={state.mobileGroup!==g.id}>{g.items.map(i=><li key={i.href}><Link href={i.href} aria-current={path===i.href?'page':undefined} onClick={closeDrawer}>{i.label}</Link></li>)}</ul></li>)}</ul></nav>
 <div className="ix-drawer-bottom">{authAvailable?<Link href={state.accountHref} onClick={closeDrawer}>{state.account}</Link>:null}<Link href="/contact" onClick={closeDrawer}>Contact & questions</Link><p>Infrastructure advisory, backed by evidence.</p></div></dialog></>;
}
