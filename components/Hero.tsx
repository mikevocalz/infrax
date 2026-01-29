import React, { useEffect, useRef } from 'react';
import { ArrowRight, Cpu, ShieldCheck, Zap } from 'lucide-react';

interface HeroProps {
  onNavigate?: (path: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      video.setAttribute('muted', ''); 
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-24 overflow-hidden bg-[#000d1a]">
      {/* 1. HIGH-PERFORMANCE VIDEO BACKGROUND */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-black">
        <video 
          ref={videoRef}
          autoPlay
          muted 
          loop 
          playsInline
          preload="auto"
          src="https://img1.wsimg.com/isteam/videos/uA41GmyyG8IMaxXdb"
          className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none"
          style={{ filter: 'contrast(1.2) brightness(0.8)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#000d1a]/80 via-[#000d1a]/10 to-[#000d1a]/90 z-10" />
      </div>

      {/* 2. Tactical UI Elements Layer */}
      <div className="absolute inset-0 industrial-grid-dark opacity-10 pointer-events-none z-10" />
      
      <div className="container mx-auto px-6 relative z-20">
        <div className="max-w-6xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-[2px] w-12 bg-[#f37021]" />
            <div className="section-label !mb-0 !text-[#f37021] tracking-[0.4em] drop-shadow-sm font-black">Strategic Infrastructure Advisory</div>
          </div>
          
          <h1 className="headline-lg mb-10 text-white leading-[0.85] drop-shadow-2xl">
            Smarter Infrastructure <br />
            <span className="text-[#f37021]" style={{ WebkitTextStroke: '1.5px #f37021', color: 'transparent' }}>Decisions</span> Start Here
          </h1>
          
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start mb-16">
            <p className="text-xl md:text-2xl text-white font-light leading-relaxed drop-shadow-lg opacity-90">
              AI-powered infrastructure matching combined with disciplined, vendor-agnostic execution across data centers, power, cloud, equipment, and connectivity.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 pt-2">
              <button
                onClick={() => onNavigate?.('contact')}
                className="px-10 py-6 bg-[#f37021] text-white font-black uppercase tracking-widest flex items-center justify-center gap-3 group transition-all hover:bg-white hover:text-[#000d1a] shadow-[0_0_30px_rgba(243,112,33,0.3)]"
              >
                Request an InfraAlign™ Match
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </button>
              <button
                onClick={() => onNavigate?.('intelligence')}
                className="px-10 py-6 border border-white/30 text-white font-black uppercase tracking-widest transition-all hover:bg-white/10 backdrop-blur-sm"
              >
                View Market Intelligence
              </button>
            </div>
            <div className="text-xs text-white/60 font-mono uppercase tracking-[0.3em]">
              Primary CTA: Request an InfraAlign™ Match • Secondary CTA: View Market Intelligence
            </div>
          </div>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10 shadow-2xl backdrop-blur-md">
          {[
            { icon: <Cpu />, val: "Intelligent", label: "Signal Matching" },
            { icon: <ShieldCheck />, val: "Neutral", label: "Vendor-Agnostic" },
            { icon: <Zap />, val: "Disciplined", label: "Risk Mitigation" }
          ].map((item, idx) => (
            <div key={idx} className="p-10 bg-[#000d1a]/50 hover:bg-white/[0.05] transition-all group border-b lg:border-b-0 border-white/5">
              <div className="w-10 h-10 flex items-center justify-center text-[#f37021] mb-8 transition-transform group-hover:scale-110">
                {React.cloneElement(item.icon as React.ReactElement<any>, { className: "w-6 h-6" })}
              </div>
              <div className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">{item.val}</div>
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Interface Visualizers */}
      <div className="hidden xl:flex absolute right-10 top-1/2 -translate-y-1/2 flex-col gap-12 pointer-events-none z-20">
        <div className="rotate-90 origin-right flex items-center gap-4">
           <div className="w-2 h-2 bg-[#00d87d] rounded-full animate-pulse shadow-[0_0_10px_#00d87d]" />
           <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.5em] whitespace-nowrap">PLATFORM_STATUS: ONLINE</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
