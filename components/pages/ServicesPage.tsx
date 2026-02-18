import React from 'react';
import { Search, Globe, ShieldAlert, BarChart3, ArrowUpRight } from 'lucide-react';

const ServicesPage: React.FC = () => {
  const capabilities = [
    {
      title: "Intelligent Matching",
      icon: <Search className="w-10 h-10 text-[#f37021]" />,
      features: ["Signal Ingestion", "Constraint Detection", "Off-Market Sourcing", "AI Constraint Mapping"],
      img: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=2070" // Fiber optics
    },
    {
      title: "Neutral Guidance",
      icon: <BarChart3 className="w-10 h-10 text-white" />,
      features: ["Vendor-Agnostic", "Unbiased Modeling", "Conflict-Free Advice", "Market Shortlisting"],
      img: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070" // Circuitry
    },
    {
      title: "Execution Discipline",
      icon: <ShieldAlert className="w-10 h-10 text-[#f37021]" />,
      features: ["Risk Management", "Timeline Accountability", "Implementation Lead", "Governance Support"],
      img: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070" // Industrial engineering
    }
  ];

  return (
    <div className="bg-white selection:bg-[#f37021]">
      {/* Hero Header with Background */}
      <section className="relative h-[60vh] flex items-center bg-navy overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=2500" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale contrast-125"
          alt="Data Center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/60 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl space-y-6">
            <div className="section-label !text-orange-accent">Engineering Capabilities</div>
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none text-white">
              No Guessing. <br /><span className="text-[#f37021]">No Noise.</span>
            </h1>
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-40 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-navy/10 border border-navy/10 shadow-2xl">
            {capabilities.map((item) => (
              <div key={item.title} className="relative group overflow-hidden">
                <div className="absolute inset-0 z-0">
                  <img src={item.img} className="w-full h-full object-cover opacity-0 group-hover:opacity-20 transition-opacity duration-700 grayscale" />
                </div>
                <div className="relative z-10 p-12 lg:p-16 bg-white group-hover:bg-transparent transition-colors duration-500">
                  <div className="mb-8">{item.icon}</div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 leading-none text-navy">{item.title}</h3>
                  <ul className="space-y-4 mb-12">
                    {item.features.map(f => (
                      <li key={f} className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-navy">
                        <div className="w-1.5 h-1.5 bg-[#f37021]" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-navy">
                    Explore Pillar <ArrowUpRight size={14} className="text-orange-accent" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Difference Section */}
      <section className="py-24 lg:py-40 bg-navy text-white relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2070" 
          className="absolute inset-0 w-full h-full object-cover opacity-10 grayscale"
          alt="Power Grid"
        />
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center relative z-10">
          <div className="space-y-10">
            <div className="section-label !text-[#f37021]">The InFraX Way</div>
            <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none">
              Strategic Sourcing <br />Simplified.
            </h2>
            <p className="text-lg text-white/60 font-light leading-relaxed">
              We are not brokers. We do not push inventory or take placement fees that bias advice. We filter ruthlessly, surface reality early, and stay accountable through delivery.
            </p>
          </div>
          <div className="relative p-1 bg-gradient-to-br from-[#f37021] to-navy">
            <div className="bg-navy p-12 lg:p-20 space-y-8 relative overflow-hidden">
              <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070" className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale" />
              <div className="relative z-10 space-y-6">
                <h4 className="text-2xl font-black uppercase tracking-tighter">Global Grid Presence</h4>
                <p className="text-white/60 font-light leading-relaxed">Across data centers, power, cloud, equipment, and connectivity. One unified model for multi-pillar decisions.</p>
                <div className="h-1 w-full bg-white/5 overflow-hidden">
                  <div className="h-full bg-[#f37021] w-3/4 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;