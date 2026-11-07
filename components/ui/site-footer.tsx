import Link from 'next/link';
import {SITE_NAV} from '@/lib/ux/navigation.mjs';
export function SiteFooter(){return <footer className="ix-footer"><div className="ix-container ix-footer-grid">
 <div><Link className="ix-logo" href="/">InFra<span className="ix-accent">X</span></Link><p>Infrastructure decisions start with the requirements, the evidence, and the questions still unanswered.</p><Link href="/contact" className="ix-footer-contact">Contact InFraX</Link></div>
 {SITE_NAV.map(group=><nav aria-label={group.label+' footer links'} key={group.id}><h2>{group.label}</h2><ul>{group.items.map(item=><li key={item.href}><Link href={item.href}>{item.label}</Link></li>)}</ul></nav>)}
 </div><div className="ix-container ix-footer-meta"><p>© {new Date().getUTCFullYear()} InFraX</p><Link href="/contact">Privacy or data questions? Contact us</Link></div></footer>;}
