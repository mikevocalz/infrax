
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SECURITY_STATS } from '../constants';

const Stats: React.FC = () => {
  return (
    <section className="py-24 bg-slate-50 border-y border-slate-100" id="intelligence">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-3 gap-12 items-center">
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-3xl font-black text-navy">Real-Time Threat Intelligence</h2>
            <p className="text-slate-600 leading-relaxed">
              Our SOC analysts process thousands of indicators of compromise daily. We don't just alert; we respond and remediate.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-3xl font-bold text-blue-600">24/7</div>
                <div className="text-xs font-bold text-slate-500 uppercase">Coverage</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-blue-600">100%</div>
                <div className="text-xs font-bold text-slate-500 uppercase">Transparency</div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2 bg-white rounded-2xl p-8 border border-slate-200 shadow-lg">
            <div className="flex justify-between items-center mb-8">
              <h4 className="font-bold text-navy">Threat Mitigation Trends (Weekly)</h4>
              <div className="flex gap-4 text-xs font-bold">
                <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-blue-600" /> MITIGATED</span>
                <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-slate-200" /> DETECTED</span>
              </div>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={SECURITY_STATS}>
                  <defs>
                    <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} axisLine={false} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="mitigated" 
                    stroke="#2563eb" 
                    fillOpacity={1} 
                    fill="url(#colorBlue)" 
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
