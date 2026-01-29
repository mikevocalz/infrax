import React from 'react';
import { Radio, Zap, ShieldCheck, Users } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="pt-40 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto space-y-32">
          {/* Header Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-end">
            <div className="space-y-6">
              <div className="section-label">Our Heritage</div>
              <h1 className="text-5xl md:text-8xl font-black text-navy uppercase tracking-tighter leading-[0.85]">
                ABOUT <br /><span className="text-[#f37021]">INFRAX.</span>
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-[#64748b] font-light leading-relaxed">
              A strategic infrastructure advisory and delivery firm. We make infrastructure decisions predictable.
            </p>
          </div>
          
          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-navy/10 border border-navy/10">
             <div className="lg:col-span-7 bg-white p-12 lg:p-20 space-y-10">
                <div className="section-label">The InFraX Standard</div>
                <h4 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-navy leading-none">AI-Driven Intelligence <br />Disciplined Execution.</h4>
                <div className="space-y-6 text-lg text-slate-500 font-light leading-relaxed">
                  <p>
                    InFraX is built on a simple premise: infrastructure buyers deserve truth, not just inventory. We combine proprietary off-market intelligence with deep industry relationships to solve the fragmentation of the provider landscape.
                  </p>
                  <p>
                    We are not brokers. We do not push inventory or take fees that bias our advice. Instead, we enforce disciplined evaluation and stay accountable through the entire delivery lifecycle.
                  </p>
                </div>
                <button className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.3em] text-navy border-b-2 border-navy pb-1 hover:text-[#f37021] hover:border-[#f37021] transition-all">
                  Connect With Our Team
                </button>
             </div>
             <div className="lg:col-span-5 grid grid-cols-1 gap-px">
                <div className="p-16 bg-navy text-white h-full flex flex-col justify-between">
                  <Zap className="w-12 h-12 text-[#f37021] mb-8" />
                  <div>
                    <div className="text-3xl font-black uppercase tracking-tighter mb-2">Predictable</div>
                    <div className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Decision Modeling</div>
                  </div>
                </div>
                <div className="p-16 bg-[#f37021] text-white h-full flex flex-col justify-between">
                  <ShieldCheck className="w-12 h-12 text-white mb-8" />
                  <div>
                    <div className="text-3xl font-black uppercase tracking-tighter mb-2">Vendor Neutral</div>
                    <div className="text-[10px] text-white/60 font-bold uppercase tracking-widest">Zero Placement Bias</div>
                  </div>
                </div>
             </div>
          </div>

          {/* Core Values / Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 py-32 border-t border-navy/5">
             {[
               { val: "Signal", label: "Intelligence Focus" },
               { val: "Agnostic", label: "Market Advice" },
               { val: "Enforced", label: "SLA Accountability" },
               { val: "Direct", label: "Specialist Access" }
             ].map(stat => (
               <div key={stat.label} className="space-y-2">
                 <div className="text-5xl font-black text-navy tracking-tighter uppercase">{stat.val}</div>
                 <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;