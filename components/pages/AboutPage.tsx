import React from 'react';
import { LEADERSHIP } from '../../constants';
import { Mail, Linkedin, User, History, ShieldCheck } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="bg-white selection:bg-[#f37021]">
      <section className="relative h-[60vh] flex items-center bg-navy overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale"
          alt="Office"
        />
        <div className="container mx-auto px-6 relative z-10 pt-20">
          <div className="max-w-4xl space-y-8">
            <div className="flex items-center gap-4">
              <span className="w-12 h-px bg-orange-accent"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-orange-accent">Founding Principles</span>
            </div>
            <h1 
              className="text-white font-black uppercase tracking-tighter leading-none"
              style={{ fontSize: 'clamp(3rem, 12vw, 8rem)' }}
            >
              INFRAX <br /><span className="text-orange-accent">LEADERSHIP.</span>
            </h1>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-24 lg:py-40 space-y-32">
        {/* Leadership Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
           {LEADERSHIP.map((leader, i) => (
             <div key={i} className="relative bg-[#f8fafc] p-8 lg:p-16 border border-navy/5 flex flex-col group transition-all hover:shadow-2xl hover:-translate-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-10">
                  <div className="w-20 h-20 bg-navy flex items-center justify-center text-orange-accent flex-shrink-0">
                    <User size={40} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-navy uppercase tracking-tight leading-none mb-2">{leader.name}</h3>
                    <div className="text-[10px] font-bold text-orange-accent uppercase tracking-[0.2em]">{leader.role}</div>
                  </div>
                </div>
                <p className="text-lg text-slate-500 font-light leading-relaxed mb-10 flex-1">{leader.bio}</p>
                <div className="flex flex-wrap gap-2 mb-10">
                  {leader.expertise.map(exp => (
                    <span key={exp} className="px-3 py-1.5 bg-navy text-white text-[9px] font-bold uppercase tracking-widest">{exp}</span>
                  ))}
                </div>
                <div className="pt-8 border-t border-navy/10 flex gap-6">
                  <button className="text-navy hover:text-orange-accent transition-colors"><Linkedin size={20} /></button>
                  <button className="text-navy hover:text-orange-accent transition-colors"><Mail size={20} /></button>
                </div>
             </div>
           ))}
        </div>

        {/* Heritage Section - Centered content with left-aligned text */}
        <section className="relative p-8 sm:p-12 lg:p-24 bg-slate-50 overflow-hidden border border-navy/5 shadow-2xl">
          <img src="https://images.unsplash.com/photo-1518770660439-4636190af475" className="absolute inset-0 w-full h-full object-cover opacity-5 grayscale" alt="" />
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">
            <div className="space-y-8">
               <div className="section-label">Our Heritage</div>
               <h2 className="text-4xl md:text-7xl font-black text-navy uppercase tracking-tighter leading-none">Strategy <br />& Execution.</h2>
               <p className="text-lg sm:text-xl text-slate-500 font-light leading-relaxed max-w-xl">
                 InfraX is built on truth, not inventory. We combine proprietary intelligence with relationships to solve the fragmentation of the global grid.
               </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {[
                { val: "Signal", label: "Intelligence Focus" },
                { val: "Agnostic", label: "Market Advice" },
                { val: "Enforced", label: "SLA Accountability" },
                { val: "Direct", label: "Specialist Access" }
              ].map(stat => (
               <div key={stat.label} className="flex flex-col items-center justify-center p-10 bg-white border border-navy/10 aspect-square shadow-xl group hover:bg-navy transition-all duration-300 overflow-hidden">
                 <div className="text-left w-full max-w-fit mx-auto">
                    <div 
                      className="font-black text-navy group-hover:text-orange-accent tracking-tighter uppercase transition-colors duration-300 leading-none mb-3"
                      style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)' }}
                    >
                      {stat.val}
                    </div>
                    <div className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-[0.2em] group-hover:text-white/70 transition-colors duration-300 leading-tight">
                      {stat.label}
                    </div>
                 </div>
               </div>
             ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;