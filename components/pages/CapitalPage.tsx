import React from 'react';
import { Landmark, ShieldAlert, BarChart3, ArrowRight } from 'lucide-react';

const CapitalPage: React.FC = () => {
  return (
    <div className="pt-32 pb-24">
      {/* HERO */}
      <section className="container mx-auto px-6 mb-16 md:mb-24">
        <div className="max-w-4xl space-y-6 md:space-y-8">
          <div className="section-label">Capital</div>
          <h1 className="text-4xl md:text-8xl font-black text-navy uppercase tracking-tighter leading-[0.85]">
            Capital <br />
            Requires <br />
            <span className="text-orange-accent">Validation.</span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-500 font-light leading-relaxed max-w-2xl">
            Infrastructure capital deployed without grid validation carries systemic risk. We validate feasibility before capital is exposed.
          </p>
        </div>
      </section>

      {/* RISK SECTION */}
      <section className="py-24 bg-navy text-white relative overflow-hidden">
        <div className="absolute inset-0 industrial-grid-dark opacity-10" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-8">
              <div className="w-20 h-20 bg-orange-accent flex items-center justify-center">
                <ShieldAlert size={40} className="text-white" />
              </div>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                Eliminate <br />
                <span className="text-orange-accent">Systemic Risk.</span>
              </h2>
              <p className="text-xl text-white/60 font-light leading-relaxed">
                The gap between "theoretical capacity" and "deliverable megawatts" is the single greatest threat to infrastructure investment today.
              </p>
            </div>
            <div className="grid gap-6">
              {[
                { title: "Private Equity", desc: "Due diligence backed by real-world grid constraints." },
                { title: "Infrastructure Funds", desc: "Long-term asset validation and expansion modeling." },
                { title: "Hyperscale Capital", desc: "Strategic deployment alignment for sovereign-scale projects." },
                { title: "Sovereign Entities", desc: "National-level infrastructure planning and risk mitigation." }
              ].map((item, i) => (
                <div key={i} className="p-8 border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                  <h4 className="text-lg font-black uppercase tracking-tight mb-2">{item.title}</h4>
                  <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mb-16">
            <h2 className="text-3xl font-black text-navy uppercase tracking-tight mb-6">Capital Advisory Services</h2>
            <p className="text-lg text-slate-500 font-light">
              We provide the technical intelligence required to underwrite high-density infrastructure with confidence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Pre-acquisition Modeling", desc: "Validate site feasibility before the LOI is signed." },
              { title: "Interconnection Risk Analysis", desc: "Deep-dive into utility queues and substation capacity." },
              { title: "Value-Creation Identification", desc: "Finding hidden capacity in existing infrastructure footprints." },
              { title: "Expansion Viability Audits", desc: "Ensuring Phase 2 and 3 are physically possible." },
              { title: "Off-Market Due Diligence", desc: "Technical validation of non-public asset opportunities." }
            ].map((item, i) => (
              <div key={i} className="p-10 border border-slate-200 hover:border-orange-accent transition-all group">
                <div className="w-12 h-12 bg-slate-100 flex items-center justify-center text-navy mb-8 group-hover:bg-orange-accent group-hover:text-white transition-colors">
                  <BarChart3 size={24} />
                </div>
                <h4 className="text-xl font-black text-navy uppercase tracking-tight mb-4">{item.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed mb-8">{item.desc}</p>
                <div className="flex items-center gap-2 text-orange-accent font-bold text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn More <ArrowRight size={14} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-24 p-12 bg-slate-50 border border-slate-200 text-center space-y-8">
            <h3 className="text-3xl font-black text-navy uppercase tracking-tight">Request Capital Feasibility Review</h3>
            <button className="px-12 py-6 bg-navy text-white font-black uppercase tracking-widest hover:bg-orange-accent transition-all">
              Initiate Review
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CapitalPage;
