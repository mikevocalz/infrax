import React from 'react';
import { Search, Globe, ShieldAlert, BarChart3, ArrowUpRight, CheckCircle2 } from 'lucide-react';

const ServicesPage: React.FC = () => {
  const capabilities = [
    {
      title: "Intelligent Matching",
      icon: <Search className="w-10 h-10 text-[#f37021]" />,
      features: ["Signal Ingestion", "Constraint Detection", "Off-Market Sourcing", "AI Constraint Mapping"]
    },
    {
      title: "Neutral Guidance",
      icon: <BarChart3 className="w-10 h-10 text-[#002b5c]" />,
      features: ["Vendor-Agnostic", "Unbiased Modeling", "Conflict-Free Advice", "Market Shortlisting"]
    },
    {
      title: "Execution Discipline",
      icon: <ShieldAlert className="w-10 h-10 text-[#f37021]" />,
      features: ["Risk Management", "Timeline Accountability", "Implementation Lead", "Governance Support"]
    }
  ];

  return (
    <div className="pt-24 bg-white selection:bg-[#f37021]">
      <section className="py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-24 space-y-6">
            <div className="section-label">Capabilities</div>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none text-navy">
              No Guessing. <br /><span className="text-[#f37021]">No Noise.</span>
            </h2>
            <p className="text-xl text-slate-600 font-light leading-relaxed max-w-2xl mx-auto">
              We lead evaluation with discipline through delivery. Surfacing off-market capacity and real constraints that others miss.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-navy/10 border border-navy/10">
            {capabilities.map((item) => (
              <div key={item.title} className="p-12 bg-white hover:bg-slate-50 transition-colors group">
                <div className="mb-8">{item.icon}</div>
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 leading-none text-navy">{item.title}</h3>
                <ul className="space-y-4">
                  {item.features.map(f => (
                    <li key={f} className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                      <div className="w-1.5 h-1.5 bg-[#f37021]" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Difference Section */}
      <section className="py-24 lg:py-32 bg-navy text-white relative overflow-hidden industrial-grid-dark">
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
          <div className="space-y-10">
            <div className="section-label !text-[#f37021]">The InFraX Way</div>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
              Strategic Sourcing <br />Simplified.
            </h2>
            <p className="text-lg text-white/60 font-light leading-relaxed">
              We are not brokers. We do not push inventory or take placement fees that bias advice. We filter ruthlessly, surface reality early, and stay accountable through delivery.
            </p>
            <div className="flex flex-wrap gap-4">
              {['Filter', 'Surface', 'Enforce', 'Stay Accountable'].map(item => (
                <div key={item} className="px-6 py-4 bg-white/5 border border-white/10 text-[#f37021] font-black text-xs tracking-widest uppercase">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="relative p-1 bg-gradient-to-br from-[#f37021] to-navy">
            <div className="bg-navy p-12 space-y-6">
               <Globe className="w-12 h-12 text-[#f37021]" />
               <h4 className="text-2xl font-black uppercase tracking-tighter">Global Grid Presence</h4>
               <p className="text-white/60 font-light leading-relaxed">Across data centers, power, cloud, equipment, and connectivity. One unified model for multi-pillar decisions.</p>
               <div className="h-1 w-full bg-white/5 overflow-hidden">
                 <div className="h-full bg-[#f37021] w-3/4" />
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;