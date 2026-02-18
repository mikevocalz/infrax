import React from 'react';
import { ShieldCheck, Zap, Target, Search } from 'lucide-react';

const WhyInfraXPage: React.FC = () => {
  return (
    <div className="bg-white selection:bg-[#f37021]">
      <section className="relative h-[60vh] flex items-center bg-navy overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale contrast-125"
          alt="Execution Discipline"
        />
        <div className="container mx-auto px-6 relative z-10 pt-20">
          <div className="max-w-4xl space-y-6">
            <div className="section-label !text-[#f37021]">The InfraX Difference</div>
            <h1 className="text-5xl md:text-[8rem] font-black text-white uppercase tracking-tighter leading-none">
              STRATEGY <br /><span className="text-[#f37021]">FIRST.</span>
            </h1>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-32 space-y-32">
        {/* Core Differences */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-px bg-navy/10 border border-navy/10 shadow-2xl overflow-hidden">
          <div className="relative p-16 bg-navy text-white space-y-8 group overflow-hidden">
            <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070" className="absolute inset-0 w-full h-full object-cover opacity-10 grayscale group-hover:opacity-20 transition-opacity" />
            <div className="relative z-10 space-y-8">
              <ShieldCheck className="w-16 h-16 text-[#f37021]" />
              <h3 className="text-4xl font-black uppercase tracking-tighter">We Are Not Brokers</h3>
              <p className="text-white/60 font-light text-lg">Most infrastructure companies are incentivized to push specific inventory. We don't take placement fees that bias our advice.</p>
              <ul className="space-y-4">
                {['No Placement Fees', 'Zero Inventory Bias', 'Ruthless Filtering'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#f37021]">
                    <div className="w-2 h-2 bg-[#f37021]" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="relative p-16 bg-white space-y-8 group overflow-hidden">
            <img src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070" className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-10 transition-opacity grayscale" />
            <div className="relative z-10 space-y-8">
              <Zap className="w-16 h-16 text-navy" />
              <h3 className="text-4xl font-black uppercase tracking-tighter text-navy">Disciplined Delivery</h3>
              <p className="text-slate-500 font-light text-lg">Our job doesn't end with a shortlist. We manage risk, timelines, and accountability from matching through final implementation.</p>
              <ul className="space-y-4">
                {['Market Filtering Early', 'Reality-First Evaluation', 'Enforced Accountability'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-navy">
                    <div className="w-2 h-2 bg-navy" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Straight Talk Block */}
        <section className="bg-navy p-12 lg:p-32 text-white text-center relative overflow-hidden shadow-2xl">
          <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa" className="absolute inset-0 w-full h-full object-cover opacity-10 grayscale brightness-50" />
          <div className="max-w-4xl mx-auto space-y-12 relative z-10">
            <h2 className="text-5xl lg:text-8xl font-black uppercase tracking-tighter leading-none">Straight Talk. <br /><span className="text-orange-accent">Serious Results.</span></h2>
            <div className="grid md:grid-cols-3 gap-12 text-left pt-12">
               {[
                 { title: "No Guessing", icon: <Target className="text-[#f37021]" /> },
                 { title: "No Noise", icon: <Search className="text-[#f37021]" /> },
                 { title: "No Friction", icon: <ShieldCheck className="text-[#f37021]" /> }
               ].map((item, i) => (
                 <div key={i} className="space-y-4 p-8 bg-white/5 border border-white/10">
                   <div className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10">{item.icon}</div>
                   <div className="text-2xl font-black uppercase tracking-tight">{item.title}</div>
                 </div>
               ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default WhyInfraXPage;