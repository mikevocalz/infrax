import React from 'react';
import { METRICS } from '../../constants';
import { CheckCircle2 } from 'lucide-react';

const MetricsPage: React.FC = () => {
  return (
    <div className="bg-white selection:bg-[#f37021]">
      <section className="relative h-[50vh] flex items-center bg-[#000d1a] overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale"
          alt="Analytics Grid"
        />
        <div className="container mx-auto px-6 relative z-10 pt-20">
          <div className="max-w-4xl space-y-6">
            <div className="section-label !text-[#f37021]">Education & Data</div>
            <h1 className="text-5xl md:text-9xl font-black text-white uppercase tracking-tighter leading-none">
              VITAL <br /><span className="text-[#f37021]">METRICS.</span>
            </h1>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-32 space-y-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#000d1a]/10 border border-[#000d1a]/10 shadow-2xl">
          {METRICS.map((m, i) => (
            <div key={i} className="relative p-12 sm:p-16 bg-white group hover:bg-[#000d1a] transition-all duration-300 overflow-hidden flex flex-col items-center justify-center min-h-[500px]">
              <div className="absolute top-0 right-0 p-8 sm:p-12 opacity-5 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none">
                <CheckCircle2 size={160} className="text-[#000d1a] group-hover:text-white" />
              </div>
              <div className="relative z-10 w-full max-w-md text-left">
                <h3 
                  className="font-black uppercase tracking-tighter mb-6 text-[#000d1a] group-hover:text-[#f37021] transition-colors duration-300 leading-tight"
                  style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
                >
                  {m.category}
                </h3>
                <p className="text-slate-500 group-hover:text-white/90 mb-10 font-light text-lg leading-relaxed transition-colors duration-300">
                  {m.description}
                </p>
                <div className="space-y-5">
                  {m.items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4 text-xs font-black uppercase tracking-widest text-slate-600 group-hover:text-white transition-colors duration-300">
                      <div className="w-1.5 h-1.5 bg-[#f37021] mt-1 flex-shrink-0" />
                      <span className="leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <section className="bg-[#000d1a] p-12 lg:p-32 text-center space-y-12 shadow-2xl relative overflow-hidden">
          <img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc51" className="absolute inset-0 w-full h-full object-cover opacity-10 grayscale" alt="" />
          <div className="max-w-4xl mx-auto space-y-8 relative z-10">
            <h2 className="text-4xl lg:text-7xl font-black uppercase tracking-tighter text-white">Why Metrics Matter</h2>
            <p className="text-xl text-white/60 font-light leading-relaxed">
              Better decisions lead to faster cycles, fewer surprises, and better outcomes. This data separates serious operators from tire-kickers.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-16 border-t border-white/10">
              {[
                { label: "Evaluation Cycles", val: "Faster", color: "orange" },
                { label: "Surprises", val: "Fewer", color: "white" },
                { label: "Outcomes", val: "Better", color: "orange" }
              ].map(stat => (
                <div key={stat.label} className="space-y-2">
                  <div className={`text-5xl font-black ${stat.color === 'orange' ? 'text-[#f37021]' : 'text-white'}`}>{stat.val}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MetricsPage;