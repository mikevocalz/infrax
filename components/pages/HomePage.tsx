import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { TICKER_SIGNALS } from '@/constants';

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden bg-navy">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2500"
            alt="Infrastructure"
            className="w-full h-full object-cover opacity-20 grayscale brightness-50"
          />
          <div className="absolute inset-0 mesh-bg opacity-40" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl space-y-8 md:space-y-12">
            <div className="space-y-4 animate-in slide-in-from-left duration-700">
              <div className="section-label !text-orange-accent">InfraX // Intelligence Layer</div>
              <h1
                className="text-white font-black uppercase tracking-tighter leading-[0.95] md:leading-[0.9]"
                style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)' }}
              >
                The Intelligence Layer <br className="hidden md:block" />
                For AI-Scale <br className="hidden md:block" />
                <span className="text-orange-accent">Infrastructure.</span>
              </h1>
            </div>

            <p className="text-lg md:text-2xl text-white/60 font-light leading-relaxed max-w-3xl animate-in fade-in duration-1000 delay-300">
              InfraX aligns power, land, capital, and operators using physics-first modeling and real utility
              constraints — before capital is exposed.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 pt-4 animate-in slide-in-from-bottom duration-1000 delay-500">
              <Link
                href="/contact"
                className="px-8 py-5 md:px-12 md:py-6 bg-orange-accent text-white font-black uppercase tracking-widest hover:bg-white hover:text-navy transition-all shadow-2xl shadow-orange-500/20 text-sm md:text-base text-center"
              >
                Request Infrastructure Audit
              </Link>
              <Link
                href="/platform"
                className="px-8 py-5 md:px-12 md:py-6 border-2 border-white/20 text-white font-black uppercase tracking-widest hover:bg-white/5 transition-all flex items-center justify-center gap-3 text-sm md:text-base"
              >
                Explore InfraAlign™
                <ChevronRight size={20} />
              </Link>
            </div>
          </div>
        </div>

        {/* Ticker */}
        <div className="absolute bottom-0 left-0 w-full bg-white/5 border-t border-white/10 backdrop-blur-md py-4 overflow-hidden">
          <div className="flex whitespace-nowrap animate-marquee gap-12">
            {[...TICKER_SIGNALS, ...TICKER_SIGNALS].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 text-white/80 font-mono text-[11px] uppercase tracking-wider"
              >
                <span className="text-orange-accent">{' >> '}</span> {item.signal}
                <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY PROJECTS FAIL */}
      <section className="py-24 lg:py-40 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-start">
            <div className="space-y-10">
              <div className="section-label">The Problem</div>
              <h2 className="text-4xl md:text-7xl font-black text-navy uppercase tracking-tighter leading-none">
                Why Infrastructure <br />
                <span className="text-orange-accent">Projects Stall.</span>
              </h2>
              <p className="text-xl text-slate-500 font-light leading-relaxed">
                Most infrastructure failures occur long before construction begins. InfraX eliminates assumptions.
                Every deployment is validated against deliverable megawatts — not theoretical availability.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-px bg-slate-200 border border-slate-200">
              {[
                'Utility interconnection backlogs',
                'Overestimated grid headroom',
                'Cooling density misalignment',
                'Capital deployed before feasibility validation',
                'Permitting delays',
                'Operator capacity mismatches',
              ].map((item, i) => (
                <div key={i} className="bg-white p-8 space-y-4 group hover:bg-slate-50 transition-colors">
                  <div className="w-8 h-8 bg-navy text-white flex items-center justify-center text-xs font-bold">
                    0{i + 1}
                  </div>
                  <p className="font-black text-navy uppercase tracking-tight leading-tight">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* INTRODUCING INFRAALIGN™ */}
      <section className="py-24 lg:py-40 bg-navy text-white relative overflow-hidden">
        <div className="absolute inset-0 industrial-grid-dark opacity-10" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="relative">
              <div className="bg-white/5 p-4 rounded-t-xl border-x border-t border-white/10 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <div className="ml-4 text-[10px] font-mono text-white/40 uppercase tracking-widest">
                  InfraAlign™ // Modeling Engine
                </div>
              </div>
              <div className="border border-white/10 shadow-2xl overflow-hidden bg-navy/50 aspect-video relative group flex items-center justify-center">
                <div className="absolute inset-0 opacity-20">
                  <img
                    src="https://images.unsplash.com/photo-1551288049-bbbda536339a?q=80&w=2000"
                    className="w-full h-full object-cover"
                    alt="InfraAlign modeling engine"
                  />
                </div>
                <div className="relative z-10 text-center space-y-6 p-12">
                  <div className="text-6xl font-black text-orange-accent tracking-tighter">84.2</div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">
                    Feasibility Score // Region: NO_VA_01
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-[84%] h-full bg-orange-accent" />
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-10">
              <div className="section-label !text-orange-accent">The Engine</div>
              <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                InfraAlign™ <br />
                <span className="text-white/40">Infrastructure Modeled Before It Is Built.</span>
              </h2>
              <p className="text-xl text-white/60 font-light leading-relaxed">
                InfraAlign™ is the modeling engine behind every InfraX engagement. It ingests deployment requirements,
                simulates real-world constraints, and produces feasibility-ranked deployment scenarios — before capital
                is committed.
              </p>
              <div className="grid grid-cols-1 gap-4">
                {['No guessing.', 'No inventory bias.', 'No speculative underwriting.'].map((text, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-orange-accent" />
                    <span className="font-black uppercase tracking-widest text-sm">{text}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/platform"
                className="inline-block px-12 py-6 bg-white text-navy font-black uppercase tracking-widest hover:bg-orange-accent hover:text-white transition-all"
              >
                Explore the Engine
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* HOW WE OPERATE */}
      <section className="py-24 lg:py-40 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto mb-24 space-y-6">
            <div className="section-label mx-auto">Our Methodology</div>
            <h2 className="text-4xl md:text-7xl font-black text-navy uppercase tracking-tighter leading-none">
              Intelligence. Execution. <span className="text-orange-accent">Discipline.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { title: 'Intelligence', desc: 'Real-world modeling of power, cooling, and interconnection feasibility.' },
              { title: 'Execution', desc: 'Neutral sourcing and operator alignment driven by validated outputs.' },
              { title: 'Discipline', desc: 'Governance frameworks tied directly to modeled risk exposure.' },
            ].map((item, i) => (
              <div
                key={i}
                className="space-y-8 p-12 bg-slate-50 border border-slate-200 hover:border-orange-accent transition-all group"
              >
                <div className="w-16 h-16 bg-navy text-white flex items-center justify-center group-hover:bg-orange-accent transition-colors text-2xl font-black">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="text-2xl font-black text-navy uppercase tracking-tight">{item.title}</h3>
                <p className="text-slate-500 font-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO WE SERVE */}
      <section className="py-24 lg:py-40 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-10">
              <div className="section-label">Ecosystem</div>
              <h2 className="text-4xl md:text-7xl font-black text-navy uppercase tracking-tighter leading-none">
                Built For <span className="text-orange-accent">Scale.</span>
              </h2>
              <p className="text-xl text-slate-500 font-light leading-relaxed">
                If megawatts matter, alignment matters. We support the entities building the foundation of the AI
                economy.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  'Hyperscalers',
                  'AI-native companies',
                  'Private equity & capital',
                  'Colocation operators',
                  'Public sector',
                  'Sovereign deployments',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-white border border-slate-200">
                    <div className="w-1.5 h-1.5 bg-orange-accent" />
                    <span className="font-bold text-navy uppercase tracking-widest text-xs">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-square bg-navy overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1000"
                    className="w-full h-full object-cover opacity-40 grayscale"
                    alt="Data center"
                  />
                </div>
                <div className="aspect-[4/3] bg-orange-accent p-8 flex flex-col justify-end">
                  <div className="text-4xl font-black text-white uppercase tracking-tighter">100+ GW</div>
                  <div className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Global Expansion</div>
                </div>
              </div>
              <div className="space-y-4 pt-12">
                <div className="aspect-[4/3] bg-slate-200 p-8 flex flex-col justify-end">
                  <div className="text-4xl font-black text-navy uppercase tracking-tighter">14.1 GW</div>
                  <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">US Capacity</div>
                </div>
                <div className="aspect-square bg-navy overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000"
                    className="w-full h-full object-cover opacity-40 grayscale"
                    alt="Global network"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 md:py-32 lg:py-48 bg-navy text-white relative overflow-hidden text-center">
        <div className="absolute inset-0 industrial-grid-dark opacity-10" />
        <div className="container mx-auto px-6 relative z-10 space-y-8 md:space-y-12">
          <h2 className="text-4xl md:text-7xl lg:text-9xl font-black uppercase tracking-tighter leading-none">
            Model First. <br />
            <span className="text-orange-accent">Build Second.</span>
          </h2>
          <Link
            href="/contact"
            className="inline-block px-10 py-6 md:px-16 md:py-8 bg-orange-accent text-white font-black uppercase tracking-widest hover:bg-white hover:text-navy transition-all text-base md:text-xl shadow-2xl shadow-orange-500/20"
          >
            Request Infrastructure Audit
          </Link>
        </div>
      </section>
    </div>
  );
}
