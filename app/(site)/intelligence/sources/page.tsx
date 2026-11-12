import type{Metadata}from'next';
import Link from'next/link';
import{ArrowUpRight,Building2,Network,Activity,ShieldAlert}from'lucide-react';
export const metadata:Metadata={title:'External intelligence sources | InFraX',description:'Source provenance, acquisition readiness, and verification limits for infrastructure intelligence.'};
const sources=[
 {name:'Data Center Map',kind:'FACILITY DIRECTORY',href:'https://www.datacentermap.com/research/explorer/',description:'Facility and operator location leads; licensed exports may include built-out MW, lifecycle and connectivity context.',access:'Paid export and written redistribution approval needed',icon:Building2},
 {name:'Cloudscene',kind:'CONNECTIVITY DIRECTORY',href:'https://explore.cloudscene.com/',description:'Operator, colocation and network directory; commercial data access must be licensed before reuse.',access:'Commercial license needed',icon:Network},
 {name:'PeeringDB',kind:'NETWORK INTERCONNECTION',href:'https://www.peeringdb.com/',description:'Facility, internet exchange and network-presence references. Presence does not guarantee service or capacity.',access:'Commercial data-use permission needed',icon:Network},
 {name:'Cloudflare Radar',kind:'NETWORK DISRUPTIONS',href:'https://radar.cloudflare.com/',description:'Country and ASN-level outage observations and traffic anomalies; no automatic inference that a facility is down.',access:'API token and permitted-use review needed',icon:Activity},
 {name:'NetBlocks',kind:'NETWORK DISRUPTIONS',href:'https://netblocks.org/',description:'Reported network shutdowns and disruption evidence, with source and observation-time review.',access:'Feed agreement needed',icon:ShieldAlert},
 {name:'Downdetector',kind:'SERVICE INCIDENT SIGNALS',href:'https://downdetectorapi.com/v2/docs/',description:'Crowdsourced service-disruption indicators; observations require independent corroboration.',access:'Enterprise API and redistribution terms needed',icon:Activity}
] as const;
export default function ExternalSourcesPage(){return <div className="bg-white text-[#000d1a]">
 <section className="relative overflow-hidden bg-[#000d1a] text-white">
  <div className="absolute inset-0 opacity-25" aria-hidden="true" style={{backgroundImage:'linear-gradient(to right,rgba(255,255,255,.07) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,.07) 1px,transparent 1px)',backgroundSize:'52px 52px'}}/>
  <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-28 md:pb-32 md:pt-40">
   <p className="mb-6 text-xs font-bold uppercase tracking-[.3em] text-[#ff9859]">InFraX / Evidence intelligence / Sources</p>
   <h1 className="max-w-5xl text-5xl font-black uppercase leading-[.94] tracking-[-.055em] md:text-8xl">Know the source.<span className="block text-[#f37021]">Know the limits.</span></h1>
   <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/75">We distinguish provider directory information, operator-confirmed capacity, and internet-disruption signals. Access is restricted until its permitted use and source quality are reviewed.</p>
   <div className="mt-10 flex flex-wrap items-center gap-4"><Link href="/intelligence" className="inline-flex min-h-12 items-center bg-[#f37021] px-6 py-3 font-bold uppercase tracking-wide text-[#000d1a] focus-visible:outline focus-visible:outline-4 focus-visible:outline-white">Back to intelligence</Link><span className="text-xs font-semibold uppercase tracking-widest text-white/65">Six providers registered · Zero licensed records published</span></div>
  </div>
 </section>
 <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
  <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
   <div><p className="mb-4 text-xs font-bold uppercase tracking-[.3em] text-[#b64e12]">Source register</p><h2 className="text-4xl font-black uppercase leading-none tracking-tighter md:text-6xl">Evidence before availability.</h2><p className="mt-7 max-w-sm text-base leading-relaxed text-slate-600">Source access, timestamps, rights and limitations travel with every reviewed record. This page is a source directory, not a live inventory feed.</p></div>
   <ol className="divide-y divide-slate-200 border-y border-slate-200">
    {sources.map((source,index)=>{const Icon=source.icon;return <li key={source.name} className="grid gap-5 py-8 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-8">
     <div className="flex items-start gap-4"><span className="font-mono text-xs font-bold text-[#b64e12]">{String(index+1).padStart(2,'0')}</span><div className="flex h-11 w-11 items-center justify-center border border-slate-300"><Icon aria-hidden size={21}/></div></div>
     <div><span className="text-xs font-bold uppercase tracking-[.19em] text-[#976343]">{source.kind}</span><h3 className="mt-2 text-2xl font-black uppercase tracking-tight">{source.name}</h3><p className="mt-3 leading-relaxed text-slate-600">{source.description}</p><p className="mt-3 text-sm font-semibold text-slate-700">Acquisition: {source.access}</p><a className="mt-5 inline-flex min-h-11 items-center gap-2 font-bold underline decoration-[#f37021] decoration-2 underline-offset-4 hover:text-[#b64e12] focus-visible:outline focus-visible:outline-2" href={source.href} target="_blank" rel="noopener noreferrer">Original provider <ArrowUpRight aria-hidden size={16}/></a></div>
    </li>})}
   </ol>
  </div>
 </section>
 <section className="bg-[#000d1a] px-6 py-16 text-white"><div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
  <div><p className="text-xs font-bold uppercase tracking-widest text-[#ff9859]">01 / Listings</p><h2 className="mt-4 text-2xl font-black uppercase">Built-out is not available</h2><p className="mt-4 leading-relaxed text-white/75">Reported infrastructure power does not establish contractable IT megawatts.</p></div>
  <div><p className="text-xs font-bold uppercase tracking-widest text-[#ff9859]">02 / Outages</p><h2 className="mt-4 text-2xl font-black uppercase">Correlation is not proof</h2><p className="mt-4 leading-relaxed text-white/75">Network disruption in a market does not prove a listed facility experienced downtime.</p></div>
  <div><p className="text-xs font-bold uppercase tracking-widest text-[#ff9859]">03 / Permissions</p><h2 className="mt-4 text-2xl font-black uppercase">No unauthorized reuse</h2><p className="mt-4 leading-relaxed text-white/75">Commercial feeds remain unpublished until license review and approved access are established.</p></div>
 </div></section>
 </div>;}
