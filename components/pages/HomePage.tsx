import React from 'react';
import Hero from '../Hero';
import DataMap from '../DataMap';
import { ArrowUpRight, CheckCircle2, Search, Zap, ShieldAlert } from 'lucide-react';
import { PILLARS } from '../../constants';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <>
      <Hero onNavigate={onNavigate} />
      
      {/* Straight Talk Section */}
      <section className="bg-white py-24 lg:py-32 overflow-hidden border-t border-[#002b5c]/5">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-center">
            <div className="space-y-10 order-2 lg:order-1">
              <div className="section-label">Straight Talk</div>
              <h2 className="text-4xl md:text-6xl font-black text-[#002b5c] uppercase tracking-tighter leading-none">
                Built for Signal, <br />
                <span className="text-[#f37021]">Not Noise.</span>
              </h2>
              <p className="text-xl text-[#64748b] font-light leading-relaxed">
                Most infrastructure decisions fail because buyers see too much inventory and too little truth. InFraX fixes that by filtering the market before sales conversations begin.
              </p>
              
              <div className="space-y-6 py-10 border-y border-[#002b5c]/10">
                <div className="flex items-start gap-4">
                  <Search className="w-6 h-6 text-[#f37021] mt-1" />
                  <p className="text-navy font-bold uppercase tracking-tight">Filtering the market before sales conversations begin</p>
                </div>
                <div className="flex items-start gap-4">
                  <Zap className="w-6 h-6 text-[#f37021] mt-1" />
                  <p className="text-navy font-bold uppercase tracking-tight">Surfacing off-market capacity and real constraints</p>
                </div>
                <div className="flex items-start gap-4">
                  <ShieldAlert className="w-6 h-6 text-[#f37021] mt-1" />
                  <p className="text-navy font-bold uppercase tracking-tight">Leading evaluation with discipline through delivery</p>
                </div>
              </div>
              
              <button 
                onClick={() => onNavigate('platform')} 
                className="px-10 py-5 btn-primary group flex items-center gap-3 w-full sm:w-auto justify-center"
              >
                Explore InfraAlign™
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>

            <div className="relative order-1 lg:order-2">
               <div className="relative aspect-square bg-[#002b5c] overflow-hidden group">
                  <img 
                    src="https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=2000&auto=format&fit=crop" 
                    alt="Data Center Infrastructure" 
                    className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#002b5c] via-transparent to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8 p-8 glass-card border-white/20">
                    <CheckCircle2 className="w-8 h-8 text-[#f37021] mb-4" />
                    <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">No Guessing. No Noise.</h3>
                    <p className="text-sm text-white/80 font-light">We identify transitional assets and power availability ahead of public announcements.</p>
                  </div>
               </div>
               <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#f37021] -z-10" />
               <div className="absolute -bottom-6 -left-6 w-32 h-32 border-2 border-[#002b5c] -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Three Pillars Section */}
      <section className="py-24 bg-[#f8fafc] border-y border-[#002b5c]/5 industrial-grid">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20 space-y-4">
            <div className="section-label">The Core Model</div>
            <h2 className="text-4xl md:text-5xl font-black text-navy uppercase tracking-tighter">Three Pillars of InFraX</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {PILLARS.map((p, i) => (
              <div key={i} className="space-y-6 p-10 bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-shadow group">
                <div className="w-16 h-16 bg-navy text-[#f37021] flex items-center justify-center transition-transform group-hover:scale-110">
                  {p.icon}
                </div>
                <h3 className="text-2xl font-black text-navy uppercase tracking-tight">{p.title}</h3>
                <p className="text-slate-600 font-light leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proof of Difference */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-navy p-12 lg:p-20 text-white relative overflow-hidden">
            <div className="absolute inset-0 industrial-grid-dark opacity-10" />
            <div className="relative z-10 space-y-12">
              <h2 className="text-4xl font-black uppercase tracking-tighter">Proof of Difference</h2>
              <div className="grid sm:grid-cols-3 gap-10">
                <div className="space-y-2">
                  <div className="text-[#f37021] font-black text-2xl uppercase tracking-tighter">Off-Market</div>
                  <p className="text-white/50 text-xs font-bold uppercase tracking-widest">Deals others never see</p>
                </div>
                <div className="space-y-2">
                  <div className="text-[#f37021] font-black text-2xl uppercase tracking-tighter">AI-Driven</div>
                  <p className="text-white/50 text-xs font-bold uppercase tracking-widest">Curated shortlists, not blasts</p>
                </div>
                <div className="space-y-2">
                  <div className="text-[#f37021] font-black text-2xl uppercase tracking-tighter">Governance</div>
                  <p className="text-white/50 text-xs font-bold uppercase tracking-widest">Disciplined delivery cycles</p>
                </div>
              </div>
              <button 
                onClick={() => onNavigate('about')}
                className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f37021] border-b-2 border-[#f37021] pb-1 hover:text-white hover:border-white transition-all"
              >
                Why InFraX Is Different
              </button>
            </div>
          </div>
        </div>
      </section>

      <DataMap />
    </>
  );
};

export default HomePage;