import React, { useState, useEffect } from 'react';
import { AlertCircle, TrendingUp, Zap, Globe, Search, Filter, ArrowUpRight, Clock, ShieldCheck, Database } from 'lucide-react';
import { TICKER_SIGNALS } from '../../constants';
import { MarketSignal } from '../../types';

const IntelligencePage: React.FC = () => {
  const [signals, setSignals] = useState<MarketSignal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        const response = await fetch('/api/v1/intel/signals');
        const data = await response.json();
        setSignals(data);
      } catch (error) {
        console.error('Error fetching signals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSignals();
  }, []);

  return (
    <div className="pt-32 pb-24">
      {/* HERO */}
      <section className="container mx-auto px-6 mb-16 md:mb-24">
        <div className="max-w-4xl space-y-6 md:space-y-8">
          <div className="section-label flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-accent animate-pulse" />
            Live Infrastructure Signals
          </div>
          <h1 className="text-4xl md:text-8xl font-black text-navy uppercase tracking-tighter leading-[0.85]">
            Market <br />
            <span className="text-orange-accent">Intelligence.</span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-500 font-light leading-relaxed max-w-2xl">
            InfraX aggregates and curates infrastructure intelligence across utility filings, interconnection queues, and operator disclosures.
          </p>
        </div>
      </section>

      {/* SIGNAL FEED */}
      <section className="container mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Sidebar Filters */}
          <div className="lg:col-span-3 space-y-8">
            <div className="p-8 bg-slate-50 border border-slate-200 space-y-6">
              <div className="text-[10px] font-black text-navy uppercase tracking-widest flex items-center gap-2">
                <Filter size={14} /> Filter Signals
              </div>
              <div className="space-y-2">
                {['All Signals', 'Utility Filings', 'Interconnect Queues', 'Operator Disclosures', 'Supply Chain', 'Pricing'].map((filter, i) => (
                  <button key={i} className={`w-full text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors ${i === 0 ? 'bg-navy text-white' : 'bg-white text-navy hover:bg-slate-100 border border-slate-200'}`}>
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-8 bg-navy text-white space-y-6">
              <div className="text-[10px] font-black text-orange-accent uppercase tracking-widest">Signal Source</div>
              <p className="text-xs text-white/40 leading-relaxed">
                Signals are derived from real-world grid and operator data — not static inventory lists.
              </p>
              <div className="space-y-4">
                {[
                  { label: "Confidence", val: "94%" },
                  { label: "Latency", val: "240ms" },
                  { label: "Nodes", val: "1,842" }
                ].map((stat, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">{stat.label}</span>
                    <span className="text-xs font-black">{stat.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-9 space-y-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-6">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Intelligence Stream</div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-[10px] font-bold text-navy uppercase tracking-widest">
                  <Clock size={14} /> Last Update: Just Now
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="py-24 flex flex-col items-center justify-center space-y-6">
                <div className="w-12 h-12 border-4 border-navy border-t-orange-accent rounded-full animate-spin" />
                <div className="text-[10px] font-black text-navy uppercase tracking-widest animate-pulse">Processing Grid Telemetry...</div>
              </div>
            ) : (
              <div className="grid gap-6">
                {signals.map((signal, i) => (
                  <div key={i} className="bg-white border border-slate-200 p-8 group hover:border-orange-accent transition-all hover:shadow-xl relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-1 h-full ${
                      signal.severity === 'High' ? 'bg-red-500' : 
                      signal.severity === 'Medium' ? 'bg-orange-accent' : 'bg-blue-500'
                    }`} />
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-4">
                          <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest text-white ${
                            signal.severity === 'High' ? 'bg-red-500' : 
                            signal.severity === 'Medium' ? 'bg-orange-accent' : 'bg-blue-500'
                          }`}>
                            {signal.category}
                          </span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{signal.timestamp}</span>
                        </div>
                        <h3 className="text-xl font-black text-navy uppercase tracking-tight">{signal.signal}</h3>
                        <p className="text-sm text-slate-500 font-light leading-relaxed max-w-2xl">
                          {signal.impact}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-4">
                        <button className="flex items-center gap-2 px-6 py-3 bg-navy text-white text-[10px] font-black uppercase tracking-widest hover:bg-orange-accent transition-colors">
                          Analyze <ArrowUpRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Market Stats Grid */}
            <div className="grid md:grid-cols-2 gap-8 pt-12">
              <div className="p-10 bg-slate-50 border border-slate-200 space-y-6">
                <div className="flex items-center gap-4">
                  <Database size={24} className="text-orange-accent" />
                  <h4 className="text-lg font-black text-navy uppercase tracking-tight">Regional Pricing</h4>
                </div>
                <div className="space-y-4">
                  {[
                    { market: "Northern Virginia", price: "$145-165", trend: "+4.2%" },
                    { market: "Columbus, OH", price: "$125-140", trend: "+2.8%" },
                    { market: "Dallas, TX", price: "$130-150", trend: "+3.5%" }
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-slate-200 pb-3">
                      <span className="text-xs font-bold text-navy">{item.market}</span>
                      <div className="text-right">
                        <div className="text-xs font-black text-navy">{item.price}</div>
                        <div className="text-[9px] font-bold text-red-500">{item.trend}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-10 bg-slate-50 border border-slate-200 space-y-6">
                <div className="flex items-center gap-4">
                  <ShieldCheck size={24} className="text-orange-accent" />
                  <h4 className="text-lg font-black text-navy uppercase tracking-tight">Grid Stability</h4>
                </div>
                <div className="space-y-4">
                  {[
                    { market: "PJM Interconnect", status: "Critical", risk: "High" },
                    { market: "ERCOT", status: "Stable", risk: "Medium" },
                    { market: "CAISO", status: "Constrained", risk: "High" }
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-slate-200 pb-3">
                      <span className="text-xs font-bold text-navy">{item.market}</span>
                      <div className="text-right">
                        <div className={`text-xs font-black ${item.status === 'Critical' ? 'text-red-500' : 'text-navy'}`}>{item.status}</div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Risk: {item.risk}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default IntelligencePage;
