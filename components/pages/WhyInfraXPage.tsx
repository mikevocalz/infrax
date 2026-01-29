import React from 'react';
import { ShieldCheck, ArrowRight, Zap, Target, Search } from 'lucide-react';

const WhyInfraXPage: React.FC = () => {
  return (
    <div className="pt-40 bg-white selection:bg-[#f37021]">
      <div className="container mx-auto px-6 space-y-32 mb-32">
        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-20 items-end max-w-6xl mx-auto">
          <div className="space-y-6">
            <div className="section-label">WHY INFrax (UNCHANGED, STRONG)</div>
            <h1 className="text-5xl md:text-8xl font-black text-navy uppercase tracking-tighter leading-[0.85]">
              WHY <br /><span className="text-[#f37021]">INFRAX.</span>
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-[#64748b] font-light leading-relaxed">
            We are not brokers. We do not push inventory, take placement fees that bias advice, or flood inboxes with vendor decks. We filter ruthlessly, surface reality early, enforce disciplined evaluation, and stay accountable through delivery.
          </p>
        </div>

        {/* Core Differences */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="p-16 bg-navy text-white space-y-8 group hover:bg-[#001a38] transition-colors">
            <ShieldCheck className="w-16 h-16 text-[#f37021]" />
            <h3 className="text-4xl font-black uppercase tracking-tighter">We Are Not Brokers</h3>
            <div className="space-y-6 text-white/60 font-light leading-relaxed">
              <p>We do not:</p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#f37021]">
                  <div className="w-2 h-2 bg-[#f37021]" />
                  Push inventory
                </li>
                <li className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#f37021]">
                  <div className="w-2 h-2 bg-[#f37021]" />
                  Take placement fees that bias advice
                </li>
                <li className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#f37021]">
                  <div className="w-2 h-2 bg-[#f37021]" />
                  Flood inboxes with vendor decks
                </li>
              </ul>
            </div>
          </div>

          <div className="p-16 bg-slate-50 border border-navy/5 space-y-8 group hover:border-[#f37021]/30 transition-all">
            <Zap className="w-16 h-16 text-navy" />
            <h3 className="text-4xl font-black uppercase tracking-tighter text-navy">Disciplined Delivery</h3>
            <div className="space-y-6 text-slate-500 font-light leading-relaxed">
              <p>We do:</p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-navy">
                  <div className="w-2 h-2 bg-navy" />
                  Filter ruthlessly
                </li>
                <li className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-navy">
                  <div className="w-2 h-2 bg-navy" />
                  Surface reality early
                </li>
                <li className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-navy">
                  <div className="w-2 h-2 bg-navy" />
                  Enforce disciplined evaluation
                </li>
                <li className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-navy">
                  <div className="w-2 h-2 bg-navy" />
                  Stay accountable through delivery
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Straight Talk Block */}
        <section className="bg-navy p-12 lg:p-24 text-white text-center relative overflow-hidden industrial-grid-dark">
          <div className="max-w-4xl mx-auto space-y-12 relative z-10">
            <h2 className="text-4xl lg:text-7xl font-black uppercase tracking-tighter leading-none">Straight Talk <br />for Serious Buyers.</h2>
            <div className="grid md:grid-cols-3 gap-12 text-left pt-12">
               {[
                 { title: "No Guessing", icon: <Target className="text-[#f37021]" /> },
                 { title: "No Noise", icon: <Search className="text-[#f37021]" /> },
                 { title: "No Misalignment", icon: <ShieldCheck className="text-[#f37021]" /> }
               ].map((item, i) => (
                 <div key={i} className="space-y-4">
                   <div className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10">{item.icon}</div>
                   <div className="text-2xl font-black uppercase tracking-tight">{item.title}</div>
                 </div>
               ))}
            </div>
            <p className="text-xl text-white/40 font-light leading-relaxed">
              We separate serious operators from tire-kickers by providing truth through intelligence.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default WhyInfraXPage;
