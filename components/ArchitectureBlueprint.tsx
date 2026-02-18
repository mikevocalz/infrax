import React from 'react';
import { Database, Search, Cpu, CheckCircle, ArrowRight, Network, Server, Shield } from 'lucide-react';

const ArchitectureBlueprint: React.FC = () => {
  return (
    <div className="relative py-24 lg:py-40 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-20 lg:gap-32 items-center">
          <div className="lg:w-2/5 space-y-10">
            <div className="section-label">System Architecture</div>
            <h2 className="text-5xl lg:text-7xl font-black text-navy uppercase tracking-tighter leading-[0.9]">
              The <span className="text-orange-accent">Governance</span> <br />Engine.
            </h2>
            <p className="text-xl text-slate-500 font-light leading-relaxed">
              We replace fragmented sourcing with a unified technical engine. Every step is governed by engineering validation, ensuring your deployment remains aligned with operational reality.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6">
              {[
                { label: "Signal Ingestion", sub: "Market telemetry" },
                { label: "Asset Modeling", sub: "Constraint mapping" },
                { label: "Mesh Filtering", sub: "Agnostic selection" },
                { label: "Audit Loop", sub: "Governance cycle" }
              ].map((step, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-[1px] bg-orange-accent" />
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-navy">{step.label}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest ml-9">{step.sub}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:w-3/5 w-full bg-navy p-12 lg:p-24 relative overflow-hidden group shadow-[0_50px_100px_-20px_rgba(0,13,26,0.5)]">
            {/* TECHNICAL BLUEPRINT SVG */}
            <svg viewBox="0 0 800 500" className="w-full h-auto relative z-10 drop-shadow-2xl">
              {/* Circuit Grid Background */}
              <defs>
                <pattern id="blueprintGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="800" height="500" fill="url(#blueprintGrid)" />

              {/* Central Architecture Path */}
              <path d="M 100 250 Q 400 250 700 250" stroke="rgba(243, 112, 33, 0.2)" strokeWidth="1" fill="none" strokeDasharray="5,5" />
              
              {/* Nodes with Tech Icons */}
              {[
                { x: 100, y: 250, icon: <Database />, label: "INGEST" },
                { x: 300, y: 250, icon: <Network />, label: "MESH" },
                { x: 500, y: 250, icon: <Server />, label: "MODEL" },
                { x: 700, y: 250, icon: <Shield />, label: "ENFORCE" }
              ].map((node, i) => (
                <g key={i}>
                  <circle cx={node.x} cy={node.y} r="35" fill="#000d1a" stroke="#f37021" strokeWidth="1.5" />
                  <circle cx={node.x} cy={node.y} r="45" fill="none" stroke="rgba(243, 112, 33, 0.1)" strokeWidth="1">
                    <animate attributeName="r" values="45;55;45" dur={`${3 + i}s`} repeatCount="indefinite" />
                  </circle>
                  <foreignObject x={node.x - 15} y={node.y - 15} width="30" height="30">
                    <div className="text-orange-accent flex items-center justify-center h-full">
                      {React.cloneElement(node.icon as React.ReactElement<any>, { size: 20 })}
                    </div>
                  </foreignObject>
                  <text x={node.x} y={node.y + 70} textAnchor="middle" className="fill-white/30 text-[9px] font-bold uppercase tracking-[0.4em]">{node.label}</text>
                </g>
              ))}

              {/* Connectors */}
              <path d="M 135 250 L 265 250" stroke="#f37021" strokeWidth="1" />
              <path d="M 335 250 L 465 250" stroke="#f37021" strokeWidth="1" />
              <path d="M 535 250 L 665 250" stroke="#f37021" strokeWidth="1" />
              
              {/* Signal Pulses */}
              <circle r="4" fill="#f37021">
                <animateMotion path="M 100 250 L 700 250" dur="4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0;1" dur="4s" repeatCount="indefinite" />
              </circle>
            </svg>
            
            {/* HUD Decoration */}
            <div className="absolute bottom-8 right-8 text-right space-y-2 pointer-events-none">
              <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest">ARCH_PROTOCOL: SECURE_MESH_v4</div>
              <div className="text-[8px] font-mono text-orange-accent/40 uppercase tracking-[0.3em]">INTEGRITY_CHECK: PASS</div>
            </div>
            
            <div className="absolute inset-0 border border-white/5 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureBlueprint;