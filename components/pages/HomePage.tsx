import React from 'react';
import Hero from '../Hero';
import DataMap from '../DataMap';
import ArchitectureBlueprint from '../ArchitectureBlueprint';
import { ArrowUpRight, ArrowRight, ShieldCheck, Zap, Server, Activity, AlertTriangle } from 'lucide-react';
import { FAIL_POINTS, TICKER_SIGNALS } from '../../constants';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <>
      <Hero onNavigate={onNavigate} />
      
      {/* INFRAX LIVE TICKER */}
      <div className="bg-[#000d1a] border-y border-white/10 py-4 relative overflow-hidden group">
        <div className="container mx-auto px-6 mb-2">
           <div className="flex items-center gap-2 text-orange-accent font-black text-[9px] uppercase tracking-[0.4em]">
             <Activity size={12} className="animate-pulse" /> InfraX Live Market Intelligence
           </div>
        </div>
        <div className="flex gap-16 animate-[shimmer_60s_linear_infinite] whitespace-nowrap px-6">
          {/* Fix mapping of TICKER_SIGNALS which are now objects with category and signal properties */}
          {[...TICKER_SIGNALS, ...TICKER_SIGNALS].map((item, i) => (
            <div key={i} className="flex items-center gap-4 text-white/80 font-mono text-[11px] uppercase tracking-wider">
              <span className="text-orange-accent">>></span> {item.signal}
              <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* WHY DATA CENTER PROJECTS FAIL */}
      <section className="py-24 lg:py-40 bg-slate-50 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mb-24 space-y-4">
            <div className="section-label">Operational Diagnostics</div>
            <h2 className="text-4xl md:text-6xl font-black text-navy uppercase tracking-tighter leading-none">
              Why Infrastructure <br /><span className="text-orange-accent">Projects Fail.</span>
            </h2>
            <p className="text-xl text-slate-500 font-light leading-relaxed max-w-2xl">
              AI expansion is not constrained by imagination. It is constrained by power, land, permitting, and time. We evaluate these risks before capital is exposed.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FAIL_POINTS.map((item, i) => (
              <div key={i} className="p-10 bg-white border border-navy/5 shadow-sm hover:border-orange-accent/30 hover:shadow-xl transition-all group">
                <div className="w-12 h-12 flex items-center justify-center bg-navy/5 mb-8 text-navy group-hover:bg-orange-accent group-hover:text-white transition-colors">
                  <AlertTriangle size={24} />
                </div>
                <h3 className="text-xl font-black text-navy uppercase tracking-tight mb-4">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STRATEGIC PILLARS */}
      <section className="py-24 bg-navy relative overflow-hidden industrial-grid-dark">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-10">
               <div className="section-label !text-orange-accent">Capital & Investor Strategy</div>
               <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-[0.9]">
                 Infrastructure <br />Requires Discipline.
               </h2>
               <p className="text-lg text-white/60 font-light leading-relaxed">
                 Underwriting today requires a deeper understanding of power rights, interconnect timelines, and regulatory exposure. InfraX supports institutional capital with technical diligence grounded in grid reality.
               </p>
               <div className="grid sm:grid-cols-2 gap-6">
                 {['Technical Diligence', 'MW Verification', 'Asset Modeling', 'Risk Assessment'].map(f => (
                   <div key={f} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white">
                     <Zap size={14} className="text-orange-accent" /> {f}
                   </div>
                 ))}
               </div>
               <button onClick={() => onNavigate('platform')} className="px-10 py-6 btn-primary flex items-center gap-4">
                 Request Diligence Framework
                 <ArrowUpRight size={20} />
               </button>
            </div>
            <div className="relative aspect-video bg-black/40 border border-white/10 overflow-hidden group shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070" 
                className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-[2000ms]"
              />
              <div className="absolute inset-0 bg-navy/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 border border-orange-accent/20 rounded-full flex items-center justify-center animate-pulse">
                  <ShieldCheck size={32} className="text-orange-accent" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ArchitectureBlueprint />

      {/* EXPLAINER VIDEO CTA */}
      <section className="py-24 bg-white border-y border-navy/5">
        <div className="container mx-auto px-6 text-center">
           <div className="max-w-3xl mx-auto space-y-10">
             <div className="section-label">90-Second Explainer</div>
             <h2 className="text-4xl md:text-5xl font-black text-navy uppercase tracking-tighter">How InfraX Works.</h2>
             <div className="aspect-video bg-[#000d1a] relative overflow-hidden group cursor-pointer shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072" 
                  className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-orange-accent rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                     <div className="ml-1 w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent" />
                  </div>
                </div>
             </div>
             <p className="text-slate-500 text-lg font-light leading-relaxed">
               AI infrastructure decisions are too expensive and too visible to rely on assumption. InfraX brings clarity to power availability, site feasibility, and long-term economic alignment.
             </p>
           </div>
        </div>
      </section>

      <DataMap />
    </>
  );
};

export default HomePage;