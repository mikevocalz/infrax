import React, { useState } from 'react';
import { Cpu, Zap, Shield, BarChart3, Target, Layers, Network, Database, ChevronRight, ArrowRight, Gauge, Activity } from 'lucide-react';

const PlatformPage: React.FC = () => {
  return (
    <div className="pt-32 pb-24">
      {/* HERO */}
      <section className="container mx-auto px-6 mb-16 md:mb-24">
        <div className="max-w-4xl space-y-6 md:space-y-8">
          <div className="section-label">InfraAlign™</div>
          <h1 className="text-4xl md:text-8xl font-black text-navy uppercase tracking-tighter leading-[0.85]">
            The Infrastructure <br />
            <span className="text-orange-accent">Alignment Engine.</span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-500 font-light leading-relaxed max-w-2xl">
            Physics-first modeling for power-constrained markets.
          </p>
        </div>
      </section>

      {/* DASHBOARD PREVIEW / VISUAL */}
      <section className="container mx-auto px-6 mb-32">
        <div className="bg-navy p-4 rounded-t-xl border-x border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <div className="ml-4 text-[10px] font-mono text-white/40 uppercase tracking-widest">InfraAlign™ v1.0 // Active Modeling Environment</div>
          </div>
          <div className="text-[10px] font-mono text-orange-accent uppercase tracking-widest flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-accent animate-pulse" />
            Live Grid Telemetry
          </div>
        </div>
        <div className="border border-navy/10 shadow-2xl overflow-hidden bg-slate-50 grid lg:grid-cols-12 min-h-[600px]">
          {/* Sidebar */}
          <div className="lg:col-span-3 border-r border-slate-200 p-8 space-y-8 bg-white">
            <div className="space-y-4">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Scenario</div>
              <div className="p-4 bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-navy">NO_VA_HYPERSCALE_01</span>
                <ChevronRight size={14} className="text-slate-400" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Constraint Weights</div>
              <div className="space-y-3">
                {[
                  { label: "Power Deliverability", val: 40 },
                  { label: "Interconnect Timeline", val: 20 },
                  { label: "Cooling Feasibility", val: 15 },
                  { label: "Cost per kW", val: 15 },
                  { label: "Expansion Viability", val: 10 }
                ].map((item, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-[9px] font-bold uppercase tracking-tight">
                      <span>{item.label}</span>
                      <span>{item.val}%</span>
                    </div>
                    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-navy" style={{ width: `${item.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 p-12 space-y-12">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Feasibility Score</div>
                <div className="text-5xl font-black text-navy">84.2</div>
                <div className="text-[9px] font-bold text-[#00d87d] uppercase tracking-widest">Optimal Alignment</div>
              </div>
              <div className="p-8 bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time to Power</div>
                <div className="text-5xl font-black text-navy">18m</div>
                <div className="text-[9px] font-bold text-orange-accent uppercase tracking-widest">Grid Constrained</div>
              </div>
              <div className="p-8 bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CapEx Band</div>
                <div className="text-5xl font-black text-navy">$14k</div>
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Per kW / Tier III</div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Regional Shortlist</div>
              <div className="space-y-4">
                {[
                  { region: "Loudoun County, VA", score: 84.2, status: "Optimal", color: "bg-[#00d87d]" },
                  { region: "Columbus, OH", score: 76.5, status: "Viable", color: "bg-blue-500" },
                  { region: "Dallas, TX", score: 62.1, status: "Risk High", color: "bg-orange-accent" }
                ].map((item, i) => (
                  <div key={i} className="p-6 bg-white border border-slate-200 flex items-center justify-between group hover:border-navy transition-colors">
                    <div className="flex items-center gap-6">
                      <div className={`w-2 h-12 ${item.color}`} />
                      <div>
                        <div className="text-sm font-black text-navy uppercase tracking-tight">{item.region}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.status}</div>
                      </div>
                    </div>
                    <div className="text-2xl font-black text-navy">{item.score}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT IT DOES */}
      <section className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-10">
              <div className="section-label">Capabilities</div>
              <h2 className="text-4xl md:text-6xl font-black text-navy uppercase tracking-tighter leading-none">
                Modeled Across <br /><span className="text-orange-accent">Real Constraints.</span>
              </h2>
              <p className="text-xl text-slate-500 font-light leading-relaxed">
                InfraAlign™ ingests deployment requirements and models real-world constraints across the entire infrastructure stack. Every output is feasibility-ranked before capital deployment.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                "Utility interconnection queues",
                "Substation headroom",
                "Transformer lead times",
                "Cooling density thresholds",
                "Fiber route diversity",
                "Regional cost per kW bands",
                "Off-market site opportunities"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-6 bg-white border border-slate-200">
                  <div className="w-1.5 h-1.5 bg-orange-accent" />
                  <span className="font-bold text-navy uppercase tracking-widest text-[10px]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 lg:py-40">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto mb-24 space-y-6">
            <div className="section-label mx-auto">The Process</div>
            <h2 className="text-4xl md:text-7xl font-black text-navy uppercase tracking-tighter leading-none">
              From Requirements <br />To <span className="text-orange-accent">Intelligence.</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Input Layer",
                desc: "Deployment requirements are structured into MW demand, geography, cooling architecture, and capital envelope.",
                items: ["MW / GW Demand", "Geographic Preference", "Cooling Architecture", "Capital Envelope"]
              },
              {
                step: "02",
                title: "Constraint Modeling",
                desc: "InfraAlign™ simulates utility deliverability risk, interconnection timelines, and regional grid bottlenecks.",
                items: ["Utility Deliverability", "Interconnect Timelines", "Grid Bottlenecks", "Thermal Limitations"]
              },
              {
                step: "03",
                title: "Output Intelligence",
                desc: "Clients receive a feasibility score, ranked regional shortlist, and a risk-adjusted expansion roadmap.",
                items: ["Feasibility Score", "Ranked Shortlist", "Time-to-Power", "Risk Heat Map"]
              }
            ].map((item, i) => (
              <div key={i} className="space-y-8 p-12 bg-slate-50 border border-slate-200 relative overflow-hidden group hover:border-orange-accent transition-all">
                <div className="text-8xl font-black text-navy/5 absolute -top-4 -right-4">{item.step}</div>
                <h3 className="text-2xl font-black text-navy uppercase tracking-tight relative z-10">{item.title}</h3>
                <p className="text-slate-500 font-light leading-relaxed relative z-10">{item.desc}</p>
                <ul className="space-y-3 relative z-10">
                  {item.items.map((li, j) => (
                    <li key={j} className="flex items-center gap-3 text-[10px] font-bold text-navy uppercase tracking-widest">
                      <div className="w-1 h-1 bg-orange-accent" />
                      {li}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY IT MATTERS */}
      <section className="py-24 bg-navy text-white text-center">
        <div className="container mx-auto px-6 max-w-4xl space-y-12">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
            Infrastructure is no longer land-first. <br />
            <span className="text-orange-accent">It is power-first.</span>
          </h2>
          <p className="text-xl text-white/60 font-light leading-relaxed">
            InfraAlign™ reduces capital exposure by validating deliverable megawatts before acquisition, underwriting, or construction begins.
          </p>
        </div>
      </section>

      {/* ACCESS MODEL */}
      <section className="py-24 lg:py-40">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-10">
              <div className="section-label">Access Model</div>
              <h2 className="text-4xl md:text-6xl font-black text-navy uppercase tracking-tighter leading-none">
                Deployed Through <br /><span className="text-orange-accent">Strategic Mandates.</span>
              </h2>
              <p className="text-xl text-slate-500 font-light leading-relaxed">
                InfraAlign™ is not a standalone tool. It is the intelligence layer delivered through our structured engagements.
              </p>
              <div className="grid gap-4">
                {[
                  "Structured advisory engagements",
                  "Investor feasibility audits",
                  "Enterprise deployment modeling",
                  "Strategic infrastructure mandates"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-6 bg-slate-50 border border-slate-200">
                    <div className="w-1.5 h-1.5 bg-orange-accent" />
                    <span className="font-bold text-navy uppercase tracking-widest text-xs">{item}</span>
                  </div>
                ))}
              </div>
              <button className="px-12 py-6 bg-navy text-white font-black uppercase tracking-widest hover:bg-orange-accent transition-all">
                Initiate Technical Review
              </button>
            </div>
            <div className="relative">
              <div className="aspect-square bg-slate-100 p-12 flex items-center justify-center">
                <div className="relative w-full h-full border-2 border-dashed border-navy/10 rounded-full flex items-center justify-center animate-[spin_60s_linear_infinite]">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white border border-navy shadow-xl flex items-center justify-center">
                    <Zap size={24} className="text-orange-accent" />
                  </div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-16 h-16 bg-white border border-navy shadow-xl flex items-center justify-center">
                    <Shield size={24} className="text-navy" />
                  </div>
                  <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white border border-navy shadow-xl flex items-center justify-center">
                    <Target size={24} className="text-navy" />
                  </div>
                  <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white border border-navy shadow-xl flex items-center justify-center">
                    <BarChart3 size={24} className="text-navy" />
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-3xl font-black text-navy uppercase tracking-tighter text-center">
                    INFRA<br /><span className="text-orange-accent">ALIGN™</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PlatformPage;
