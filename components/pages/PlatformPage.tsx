import React from 'react';
import { Cpu, Activity, Database, Network, ShieldCheck } from 'lucide-react';

const PlatformPage: React.FC = () => {
  return (
    <div className="bg-white selection:bg-orange-accent">
      <section className="relative h-[70vh] flex items-center bg-navy overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1591453089816-0fbb971b454c?q=80&w=2070" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale contrast-150 brightness-75"
          alt="AI Processors"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/90 via-navy/40 to-navy" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto text-center space-y-8">
            <div className="section-label !text-orange-accent">Infrastructure OS</div>
            <h1 className="text-6xl md:text-[10rem] font-black text-white uppercase tracking-tighter leading-[0.8]">
              INFRA<span className="text-orange-accent">ALIGN™</span>
            </h1>
            <p className="text-xl md:text-3xl text-white/60 font-light max-w-3xl mx-auto">
              Mapping the global grid with engineering precision.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-32 space-y-32">
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-navy/10 border border-navy/10 shadow-2xl">
          {[
            { step: "01", title: "Data Ingestion", desc: "Aggregating utility metrics and fiber path density.", icon: <Database />, img: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8" },
            { step: "02", title: "Thermal Modeling", desc: "Analyzing power-density and cooling caps.", icon: <Cpu />, img: "https://images.unsplash.com/photo-1518770660439-4636190af475" },
            { step: "03", title: "Mesh Validation", desc: "Agnostic verification of provider claims.", icon: <Network />, img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa" },
            { step: "04", title: "SLA Governance", desc: "Post-deployment operational health monitoring.", icon: <ShieldCheck />, img: "https://images.unsplash.com/photo-1563986768609-322da13575f3" },
          ].map((item, i) => (
            <div key={i} className="group relative h-96 overflow-hidden">
              <img src={item.img} className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-40 transition-opacity duration-1000 grayscale brightness-50" />
              <div className="relative z-10 p-12 h-full flex flex-col justify-between bg-white group-hover:bg-navy/80 transition-colors duration-500">
                <div>
                  <div className="text-[10px] font-mono text-orange-accent mb-6">MODULE_{item.step}</div>
                  <div className="w-10 h-10 text-navy group-hover:text-white mb-6">
                    {React.cloneElement(item.icon as React.ReactElement<any>, { size: 28 })}
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-navy group-hover:text-white mb-4">{item.title}</h3>
                  <p className="text-slate-500 group-hover:text-white/60 text-sm font-light leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="bg-navy p-12 lg:p-24 relative overflow-hidden text-white shadow-2xl">
          <img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc51" className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale brightness-50" />
          <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10">
            <div className="space-y-12">
              <h2 className="text-4xl lg:text-7xl font-black uppercase tracking-tighter leading-none">Physics-First <br />Simulations.</h2>
              <p className="text-xl text-white/60 font-light leading-relaxed">We model the physics of your deployment—power, heat, and light—before a single contract is signed.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="p-8 border border-white/10 bg-white/5 backdrop-blur-md">
                  <div className="text-orange-accent font-black text-2xl uppercase tracking-tighter">MW Modeling</div>
                  <p className="text-white/40 text-[10px] mt-2 uppercase tracking-widest font-bold">Real-time utility capacity telemetry</p>
                </div>
                <div className="p-8 border border-white/10 bg-white/5 backdrop-blur-md">
                  <div className="text-orange-accent font-black text-2xl uppercase tracking-tighter">Path Audits</div>
                  <p className="text-white/40 text-[10px] mt-2 uppercase tracking-widest font-bold">Independent fiber diversity mapping</p>
                </div>
              </div>
            </div>
            <div className="relative aspect-video bg-black/40 border border-white/10 overflow-hidden group">
               <img src="https://images.unsplash.com/photo-1518770660439-4636190af475" className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-1000" />
               <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-24 h-24 border border-orange-accent/30 rounded-full flex items-center justify-center animate-pulse">
                   <Activity className="w-12 h-12 text-orange-accent" />
                 </div>
               </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PlatformPage;