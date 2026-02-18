import React from 'react';
import { ArrowRight, ChevronRight, Server, Shield, Zap } from 'lucide-react';

interface HeroProps {
  onNavigate?: (path: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-navy">
      {/* Background with mesh and image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=2500" 
          alt="Infrastructure"
          className="w-full h-full object-cover opacity-20 grayscale brightness-50"
        />
        <div className="absolute inset-0 mesh-bg opacity-60" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl space-y-10">
          <div className="space-y-4 animate-in slide-in-from-left duration-700">
            <div className="section-label !text-orange-accent">Strategic Infrastructure</div>
            <h1 className="text-white font-black uppercase tracking-tighter leading-[0.9]" style={{ fontSize: 'clamp(3rem, 10vw, 7.5rem)' }}>
              The New <br />
              Standard <br />
              <span className="text-orange-accent">For Scale.</span>
            </h1>
          </div>
          
          <p className="text-xl md:text-3xl text-white/60 font-light leading-relaxed max-w-3xl animate-in fade-in duration-1000 delay-300">
            Aligning power, site selection, and strategy so enterprises can make defensible data center decisions.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 pt-6 animate-in slide-in-from-bottom duration-1000 delay-500">
            <button 
              onClick={() => onNavigate?.('contact')}
              className="px-12 py-6 bg-orange-accent text-white font-black uppercase tracking-widest hover:bg-white hover:text-navy transition-all shadow-2xl shadow-orange-500/20"
            >
              Request Audit
            </button>
            <button 
              onClick={() => onNavigate?.('intelligence')}
              className="px-12 py-6 border-2 border-white/20 text-white font-black uppercase tracking-widest hover:bg-white/5 transition-all flex items-center justify-center gap-3"
            >
              Market Intelligence
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Floating Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 mt-24 border border-white/10 backdrop-blur-md animate-in slide-in-from-bottom duration-1000 delay-700">
          {[
            { label: "Active Nodes", val: "577", icon: <Server size={14} /> },
            { label: "Planned Capacity", val: "184 GW", icon: <Zap size={14} /> },
            { label: "SLA Standard", val: "99.999%", icon: <Shield size={14} /> },
            { label: "System Health", val: "Optimal", icon: <Zap size={14} /> }
          ].map((item, i) => (
            <div key={i} className="p-8 bg-navy/40 hover:bg-orange-accent/5 transition-colors group">
              <div className="flex items-center gap-3 text-white/30 mb-4">
                {item.icon}
                <span className="text-[9px] font-bold uppercase tracking-[0.3em]">{item.label}</span>
              </div>
              <div className="text-2xl font-black text-white tracking-tighter uppercase group-hover:text-orange-accent transition-colors">
                {item.val}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;