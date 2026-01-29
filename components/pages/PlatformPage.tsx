import React from 'react';
import { Cpu, Search, Activity, Zap, BarChart3, Database } from 'lucide-react';

const PlatformPage: React.FC = () => {
  return (
    <div className="pt-40 bg-white selection:bg-[#f37021]">
      <div className="container mx-auto px-6 space-y-32 mb-32">
        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-20 items-end max-w-6xl mx-auto">
          <div className="space-y-6">
            <div className="section-label">Proprietary Technology</div>
            <h1 className="text-5xl md:text-8xl font-black text-navy uppercase tracking-tighter leading-[0.85]">
              INFRA<span className="text-[#f37021]">ALIGN™</span>
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-[#64748b] font-light leading-relaxed">
            Unlock the power of intelligent infrastructure matching. We ingest fragmented datasets to surface viable off-market options.
          </p>
        </div>

        {/* Workflow */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-navy/10 border border-navy/10">
          {[
            { step: "01", title: "Signal Ingestion", desc: "Public datasets + power indicators + carrier mapping + off-market availability.", icon: <Database /> },
            { step: "02", title: "AI Analysis", desc: "Requirement matching, constraint detection, and tradeoff modeling.", icon: <Cpu /> },
            { step: "03", title: "Curated Output", desc: "Shortlist of viable options with clear comparison and risk scoring.", icon: <BarChart3 /> },
            { step: "04", title: "Guided Delivery", desc: "InFraX leads the final decision and implementation process.", icon: <Zap /> },
          ].map((item, i) => (
            <div key={i} className="p-12 bg-white hover:bg-slate-50 transition-colors group">
              <div className="text-[10px] font-mono text-[#f37021] mb-6">STEP_{item.step}</div>
              <div className="w-12 h-12 text-navy mb-8 group-hover:scale-110 transition-transform">
                {React.cloneElement(item.icon as React.ReactElement<any>, { className: "w-8 h-8" })}
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-navy mb-4">{item.title}</h3>
              <p className="text-slate-500 text-sm font-light leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </section>

        {/* Off-Market Importance */}
        <section className="bg-navy p-12 lg:p-24 relative overflow-hidden text-white industrial-grid-dark">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10">
              <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter">Why Off-Market Intelligence Matters</h2>
              <p className="text-xl text-white/60 font-light leading-relaxed">The best infrastructure is rarely listed. InfraAlign™ identifies capacity held for strategic buyers before public announcements.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="p-6 border border-white/10 bg-white/5">
                  <div className="text-[#f37021] font-black text-xl">Quiet Expansions</div>
                  <p className="text-white/40 text-xs mt-2 uppercase">Unlisted site growth</p>
                </div>
                <div className="p-6 border border-white/10 bg-white/5">
                  <div className="text-[#f37021] font-black text-xl">Transitional Assets</div>
                  <p className="text-white/40 text-xs mt-2 uppercase">Short-term availability</p>
                </div>
              </div>
            </div>
            <div className="aspect-video bg-white/5 border border-white/10 flex items-center justify-center relative">
              <div className="absolute inset-0 opacity-20 industrial-grid-dark" />
              <Activity className="w-24 h-24 text-[#f37021] animate-pulse" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PlatformPage;