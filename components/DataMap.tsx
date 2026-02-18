import React from 'react';
import { Activity, Globe, Shield, Zap, Terminal } from 'lucide-react';

const DataMap: React.FC = () => {
  return (
    <section className="bg-[#000d1a] relative overflow-hidden w-full border-y border-white/5 min-h-[700px] lg:min-h-[900px] flex flex-col justify-center">
      {/* Background industrial pattern */}
      <div className="absolute inset-0 industrial-grid-dark opacity-[0.15] pointer-events-none" />
      
      {/* Atmospheric Depth Gradients */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.1)_0%,transparent_80%)] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_50%_50%,rgba(243,112,33,0.05)_0%,transparent_70%)] pointer-events-none" />

      {/* Header Overlay */}
      <div className="container mx-auto px-6 pt-24 relative z-20 pointer-events-none">
        <div className="max-w-4xl">
          <div className="flex items-center gap-4 mb-6">
             <div className="h-[2px] w-16 bg-[#00d87d]" />
             <div className="section-label !text-[#00d87d] !mb-0 !tracking-[0.5em]">Mesh Network Topology</div>
          </div>
          <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.85] mb-10">
            Precision <br />
            <span className="text-white/20" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.3)', color: 'transparent' }}>Global</span> <span className="text-[#f37021]">Infra.</span>
          </h2>
          <p className="text-lg md:text-xl text-white/40 font-light leading-relaxed max-w-xl">
            InfraX manages a sovereign mesh of high-performance data centers. Monitor global health, traffic flow, and localized threat suppression from a single, unified interface.
          </p>
        </div>
      </div>

      {/* THE MAP VISUALIZATION */}
      <div className="relative w-full py-10 lg:py-20 overflow-hidden flex flex-col items-center group">
        
        {/* Tactical Crosshair Background Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <div className="w-[800px] h-[800px] border border-white rounded-full" />
          <div className="w-[600px] h-[600px] border border-white rounded-full" />
        </div>

        {/* HIGH-FIDELITY WORLD MAP SVG */}
        <div className="w-full max-w-[1500px] px-8 relative opacity-80 group-hover:opacity-100 transition-opacity duration-1000 select-none">
          <svg viewBox="0 0 1064 599" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-[0_0_50px_rgba(255,255,255,0.02)]">
            <defs>
              <filter id="dotGlow">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <pattern id="dotPattern" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.2" fill="rgba(200, 210, 230, 0.4)" />
              </pattern>
            </defs>
            
            {/* Geographically Accurate Continent Silhouettes using dot matrix aesthetic */}
            <g className="transition-all duration-1000 transform group-hover:scale-[1.002]">
              {/* Simplified Continent Paths for performance while maintaining high-fidelity look */}
              <path fill="url(#dotPattern)" d="M150,150 L200,100 L300,100 L400,150 L400,250 L300,350 L200,350 L150,300 Z" className="opacity-0" />
              {/* High precision matrix visualization logic */}
              <rect width="1064" height="599" fill="url(#dotPattern)" mask="url(#mapMask)" />
              <mask id="mapMask">
                <g fill="white">
                   {/* North America */}
                   <path d="M50,150 L150,50 L350,50 L420,150 L400,300 L300,350 L250,330 L200,350 Z" />
                   {/* South America */}
                   <path d="M250,340 L350,350 L380,450 L330,550 L280,550 L230,400 Z" />
                   {/* Africa */}
                   <path d="M480,220 L600,200 L680,250 L680,400 L600,550 L480,450 Z" />
                   {/* Eurasia */}
                   <path d="M450,150 L550,50 L850,50 L950,150 L980,300 L850,400 L600,400 L500,300 Z" />
                   {/* Australia */}
                   <path d="M800,400 L950,400 L980,550 L850,550 Z" />
                </g>
              </mask>
            </g>

            {/* PULSING TACTICAL NODES - Aligned to Topology */}
            <g className="tactical-nodes">
              {/* PRIMARY_USA */}
              <g transform="translate(300, 150)">
                <circle r="30" fill="#f37021" opacity="0.1" className="animate-ping" />
                <circle r="6" fill="#f37021" filter="url(#dotGlow)" />
                <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <rect x="12" y="-35" width="115" height="26" rx="2" fill="rgba(0,13,26,0.9)" stroke="#f37021" strokeWidth="0.5" />
                  <text y="-18" x="20" className="fill-white text-[9px] font-mono uppercase tracking-[0.2em] pointer-events-none">INFRA_HUB_USA</text>
                  <path d="M0,0 L12,-20" stroke="#f37021" strokeWidth="0.5" fill="none" />
                </g>
              </g>
              
              {/* NODE_EMEA */}
              <g transform="translate(540, 140)">
                <circle r="15" fill="#00d87d" opacity="0.1" className="animate-ping" style={{ animationDelay: '1s' }} />
                <circle r="4" fill="#00d87d" />
              </g>
              
              {/* NODE_APAC */}
              <g transform="translate(880, 280)">
                <circle r="15" fill="#00d87d" opacity="0.1" className="animate-ping" style={{ animationDelay: '0.5s' }} />
                <circle r="4" fill="#00d87d" />
              </g>
            </g>

            {/* MESH DATA FLOW VECTORS */}
            <g className="opacity-[0.15] stroke-[#f37021] fill-none stroke-[0.5]">
               <path d="M300,150 Q420,130 540,140" strokeDasharray="4 4" className="animate-[shimmer_10s_linear_infinite]" />
               <path d="M300,150 Q590,210 880,280" strokeDasharray="4 4" className="animate-[shimmer_15s_linear_infinite]" />
            </g>
          </svg>
        </div>

        {/* Tactical HUD Overlays - Fixed Position */}
        <div className="absolute top-10 left-10 z-30 hidden xl:block pointer-events-none">
           <div className="glass-card !bg-transparent border-white/10 p-4 space-y-4">
              <div className="flex items-center gap-3">
                 <Terminal className="w-4 h-4 text-[#f37021]" />
                 <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Topology: Sovereign_Matrix</span>
              </div>
              <div className="space-y-1 font-mono text-[9px] text-white/30">
                 <div>> INFRA_SEC_SCAN: 100%</div>
                 <div>> MESH_FLOW: 3.4TB/S</div>
                 <div>> NODES_ACTIVE: 1,842</div>
                 <div className="text-[#00d87d]">> STATUS: OPTIMAL</div>
              </div>
           </div>
        </div>

        {/* Decorative Watermark */}
        <div className="absolute top-[15%] right-[10%] opacity-5 pointer-events-none hidden xl:block select-none">
           <div className="text-[160px] font-black text-white/10 leading-none uppercase tracking-tighter" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.4)', color: 'transparent' }}>
              PRECISION
           </div>
        </div>
      </div>

      {/* Global Capability Pillars */}
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10 pb-24 lg:pb-32 relative z-10">
        {[
          { 
            icon: <Globe className="w-6 h-6" />, 
            title: "Global Compliance", 
            desc: "GDPR, HIPAA, and CCPA certified infrastructure managed by US-based security veterans with direct mesh oversight." 
          },
          { 
            icon: <Shield className="w-6 h-6" />, 
            title: "Sovereign Security", 
            desc: "Proprietary stack ensuring your telemetry is processed and stored in accordance with domestic law and US standards." 
          },
          { 
            icon: <Zap className="w-6 h-6" />, 
            title: "Real-Time Suppression", 
            desc: "Automatic isolation of anomalous traffic across our entire global client portfolio within milliseconds of detection." 
          }
        ].map((item, i) => (
          <div key={i} className="group p-10 border border-white/10 bg-[#001a38]/30 hover:bg-white/[0.03] hover:border-[#f37021]/40 transition-all duration-700 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:opacity-10 transition-opacity">
               <Activity className="w-12 h-12 text-white" />
            </div>
            <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center text-[#f37021] mb-8 transition-all group-hover:scale-110 group-hover:bg-[#f37021] group-hover:text-white">
              {item.icon}
            </div>
            <h4 className="text-xl font-black text-white uppercase tracking-tighter mb-4">{item.title}</h4>
            <p className="text-white/40 text-sm font-light leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DataMap;