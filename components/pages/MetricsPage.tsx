import React from 'react';
import { METRICS } from '../../constants';
import { CheckCircle2 } from 'lucide-react';

const MetricsPage: React.FC = () => {
  return (
    <div className="pt-40 bg-white selection:bg-[#f37021]">
      <div className="container mx-auto px-6 space-y-32 mb-32">
        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-20 items-end max-w-6xl mx-auto">
          <div className="space-y-6">
            <div className="section-label">NEW: METRICS & MARKET EDUCATION PAGE</div>
            <h1 className="text-5xl md:text-8xl font-black text-navy uppercase tracking-tighter leading-[0.85]">
              VITAL <br /><span className="text-[#f37021]">METRICS.</span>
            </h1>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#f37021]">Purpose: Educate buyers while quietly qualifying them.</p>
          </div>
          <p className="text-xl md:text-2xl text-[#64748b] font-light leading-relaxed">
            Infrastructure Metrics That Actually Matter. Informed buyers make better decisions. Better decisions lead to faster cycles, fewer surprises, and better outcomes.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {METRICS.map((m, i) => (
            <div key={i} className="p-12 border border-navy/5 bg-slate-50 group hover:bg-navy hover:text-white transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <CheckCircle2 className="w-32 h-32" />
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">{m.category}</h3>
              <p className="text-slate-500 group-hover:text-white/60 mb-8 font-light">{m.description}</p>
              <ul className="space-y-4">
                {m.items.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-4 text-xs font-black uppercase tracking-widest">
                    <div className="w-1.5 h-1.5 bg-[#f37021]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Why We Publish This */}
        <section className="bg-navy text-white p-16 lg:p-24 text-center space-y-10 industrial-grid-dark">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl font-black uppercase tracking-tighter">Why We Publish This</h2>
            <p className="text-xl text-white/60 font-light leading-relaxed">
              Informed buyers make better decisions. Better decisions lead to faster cycles, fewer surprises, and better outcomes. This page separates serious operators from tire-kickers.
            </p>
            <div className="grid grid-cols-3 gap-8 pt-10 border-t border-white/10">
              <div className="space-y-2">
                <div className="text-3xl font-black text-[#f37021]">Faster</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">Evaluation Cycles</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-black text-[#f37021]">Fewer</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">Surprises</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-black text-[#f37021]">Better</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">Outcomes</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MetricsPage;
