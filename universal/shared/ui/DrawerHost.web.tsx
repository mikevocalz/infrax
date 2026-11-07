import {useEffect,useRef,type ReactNode} from 'react';
import type {Region} from '../layout.mjs';
export type DrawerHostProps={open:boolean;onClose:()=>void;region:Region;children:ReactNode};
/** Browser adapter only. The shared drawer contents never contain DOM-specific code. */
export function DrawerHost({open,onClose,region,children}:DrawerHostProps){
 const ref=useRef<HTMLDialogElement>(null);
 const returnFocus=useRef<HTMLElement|null>(null);
 const width=Math.min(420,region.width);
 useEffect(()=>{
  const dialog=ref.current;
  if(!dialog)return;
  if(!open){if(dialog.open)dialog.close();return;}
  returnFocus.current=document.activeElement instanceof HTMLElement?document.activeElement:null;
  const overflow=document.body.style.overflow;
  document.body.style.overflow='hidden';
  if(!dialog.open)dialog.showModal();
  dialog.querySelector<HTMLElement>('button,[role="button"],[href],input')?.focus();
  return()=>{
   if(dialog.open)dialog.close();
   document.body.style.overflow=overflow;
   returnFocus.current?.focus();
  };
 },[open]);
 return <dialog ref={ref} aria-label="Workspace and account"
  onCancel={event=>{event.preventDefault();onClose();}}
  onClick={event=>{
   if(event.target!==event.currentTarget)return;
   const b=event.currentTarget.getBoundingClientRect();
   if(event.clientX<b.left||event.clientX>b.right||event.clientY<b.top||event.clientY>b.bottom)onClose();
  }}
  onKeyDown={event=>{
   if(event.key!=='Tab')return;
   const nodes=Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]),a[href],input:not([disabled]),[tabindex="0"]')).filter(n=>n.getClientRects().length>0);
   if(!nodes.length){event.preventDefault();return;}
   const first=nodes[0],last=nodes[nodes.length-1];
   if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
   else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  }}
  style={{position:'fixed',boxSizing:'border-box',margin:0,padding:0,border:0,left:region.x+region.width-width,top:region.y,width,maxWidth:width,height:region.height,maxHeight:region.height,overflow:'hidden',background:'#fff'}}>
  {children}
 </dialog>;
}
