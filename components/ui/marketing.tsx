import Link from 'next/link';
import {ArrowRight,ArrowUpRight,Check,Radio} from 'lucide-react';
import type {ReactNode} from 'react';
import {PUBLIC_PAGES,type PublicPageSpec} from '@/lib/ux/public-pages.mjs';
import {LEADERSHIP} from '@/constants';

export function PageFrame({eyebrow,title,summary,children}:{eyebrow:string;title:string;summary:string;children:ReactNode}){
 return <><section className="ix-page-hero"><div className="ix-container"><Link href="/" className="ix-breadcrumb">Home</Link><p className="ix-eyebrow">{eyebrow}</p><h1>{title}</h1><p className="ix-lead">{summary}</p></div></section><div className="ix-container ix-page-body">{children}</div></>;
}
export function PublicPage({pageKey}:{pageKey:string}){
 const page:PublicPageSpec=PUBLIC_PAGES[pageKey];if(!page)throw Error('Unknown editorial route');
 const inquiry='/contact'+(page.audience?'?audience='+page.audience:'');
 return <PageFrame eyebrow={page.eyebrow} title={page.title} summary={page.summary}>
  {page.note?<aside className="ix-trust-note"><Radio size={20} aria-hidden="true"/><p>{page.note}</p></aside>:null}
  <div className={'ix-sections ix-sections--'+(page.variant??'standard')}>
   {page.sections.map((section,i)=><section id={section.id} key={section.heading} className="ix-section"><span className="ix-section-number" aria-hidden="true">{String(i+1).padStart(2,'0')}</span><div><h2>{section.heading}</h2><p>{section.body}</p>{section.items?<ul className="ix-checklist">{section.items.map(item=><li key={item}><Check size={17} aria-hidden="true"/>{item}</li>)}</ul>:null}{section.action?<Link className="ix-text-action" href={section.action.href}>{section.action.label}<ArrowRight size={18} aria-hidden="true"/></Link>:null}</div></section>)}
  </div>
  {pageKey==='about'?<section className="ix-team"><p className="ix-eyebrow">Leadership</p><h2>The founding team</h2><div>{LEADERSHIP.map(person=><article key={person.name}><h3>{person.name}</h3><p>{person.role}</p><Link className="ix-text-action" href="/contact">Contact the team<ArrowUpRight size={18} aria-hidden="true"/></Link></article>)}</div></section>:null}
  <section className="ix-next-step"><div><p className="ix-eyebrow">Your next step</p><h2>{page.nextTitle}</h2><p>{page.nextBody}</p></div><Link className="ix-action ix-primary" href={inquiry}>Request assessment<ArrowUpRight size={18} aria-hidden="true"/></Link></section>
  <nav aria-label="Related pages" className="ix-related">{page.related.map(link=><Link href={link.href} key={link.href}>{link.label}<ArrowRight size={18} aria-hidden="true"/></Link>)}</nav>
 </PageFrame>;
}
export function HomeContent(){
 const roles=[['Enterprise buyers','Power, cooling and delivery requirements for a new deployment.','/solutions#enterprise'],['Operators & developers','Site readiness, proposed capacity and controlled disclosure.','/solutions#operators'],['Investors','Technical questions behind a capital decision.','/capital'],['Public-sector & advisory teams','Infrastructure planning and stakeholder decision support.','/solutions#public-sector']];
 return <>
  <section className="ix-home-hero"><div className="ix-container ix-home-grid"><div><p className="ix-eyebrow">AI infrastructure advisory</p><h1>Infrastructure decisions.<br/><span>Before commitments.</span></h1><p className="ix-lead">Bring power, cooling, location and delivery requirements into one assessment—without mistaking a public listing for available capacity.</p><div className="ix-hero-actions"><Link href="/contact" className="ix-action ix-primary">Request assessment<ArrowUpRight size={18} aria-hidden="true"/></Link><Link href="/platform" className="ix-action ix-outline-light">Explore Infra-Align<ArrowRight size={18} aria-hidden="true"/></Link></div><p className="ix-hero-footnote">Requirements first. Sources visible. Unknowns explicit.</p></div><aside className="ix-decision-path" aria-label="The assessment approach"><p className="ix-eyebrow">From a question to a next step</p>{[['Define','The workload and constraints'],['Check','The evidence and its limits'],['Compare','Options on the same criteria'],['Review','What needs verification next']].map(([heading,body],i)=><div key={heading}><span aria-hidden="true">0{i+1}</span><div><h2>{heading}</h2><p>{body}</p></div></div>)}</aside></div></section>
  <section className="ix-container ix-home-audiences"><div className="ix-section-intro"><p className="ix-eyebrow">Choose your starting point</p><h2>What decision is ahead?</h2><p>Follow the path that matches your role. You do not need an account to request an assessment.</p></div><div className="ix-role-grid">{roles.map(([title,body,href])=><Link href={href} key={href}><h3>{title}</h3><p>{body}</p><ArrowUpRight size={22} aria-hidden="true"/></Link>)}</div></section>
  <section className="ix-home-method"><div className="ix-container"><div className="ix-section-intro"><p className="ix-eyebrow">The Infra-Align approach</p><h2>A shortlist is only useful if you understand it.</h2><p>See the requirements each option meets, the sources behind the claims, and the questions still open. Fit and evidence quality are not the same thing.</p></div><Link href="/platform" className="ix-text-action">Understand the workflow<ArrowRight size={18} aria-hidden="true"/></Link></div></section>
  <div className="ix-container"><section className="ix-next-step"><div><p className="ix-eyebrow">Start a conversation</p><h2>Bring the requirements you know.</h2><p>We will use your inquiry to scope the next conversation. Submitting it does not reserve capacity or start a paid engagement.</p></div><Link href="/contact" className="ix-action ix-primary">Request assessment<ArrowUpRight size={18} aria-hidden="true"/></Link></section></div>
 </>;
}
