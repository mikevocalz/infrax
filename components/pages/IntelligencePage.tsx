import Link from 'next/link';
import{PageFrame}from'@/components/ui/marketing';
import SignalFeed from'@/components/features/intelligence/SignalFeed';
export default function IntelligencePage(){return <PageFrame eyebrow="Insights / Market intelligence" title="Understand the signal and its source." summary="Published research includes source references and dates. An unavailable feed is not an empty market.">
 <section aria-label="Source provenance" className="mb-10 border-l-4 border-[#f37021] bg-[#000d1a] p-6 text-white md:p-8">
  <p className="mb-3 text-xs font-bold uppercase tracking-[.22em] text-[#ff9859]">New / Intelligence sources</p>
  <h2 className="text-2xl font-black uppercase leading-tight tracking-tight md:text-3xl">Six additional provider feeds under review.</h2>
  <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/75">Review facility-directory, network and outage sources, and their licensing requirements. These sources are not yet imported or evidence of available data-center power.</p>
  <Link href="/intelligence/sources" className="mt-5 inline-flex min-h-11 items-center border border-white/45 px-5 py-3 text-xs font-black uppercase tracking-widest text-white hover:border-[#f37021] hover:text-[#ff9859] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">Explore source register →</Link>
 </section>
 <SignalFeed/>
 </PageFrame>;}
