'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PRICING_TREND } from '@/lib/mock-data';

export default function TrendChart() {
  return (
    <div className="bg-white border border-slate-200 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-black text-navy uppercase tracking-tight">Colocation Pricing Trend</div>
          <div className="text-[10px] text-slate-400">$/kW/month — last 7 months</div>
        </div>
        <div className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-widest">
          <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-[#f37021]" />NOVA</span>
          <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-blue-500" />CMH</span>
          <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-emerald-500" />DFW</span>
        </div>
      </div>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={PRICING_TREND} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              {[
                { id: 'nova', color: '#f37021' },
                { id: 'cmh', color: '#3b82f6' },
                { id: 'dfw', color: '#10b981' },
              ].map(({ id, color }) => (
                <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
            <Tooltip
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: 0, fontSize: 12 }}
              formatter={(val: number | undefined) => [`$${val ?? ''}/kW`, '']}
            />
            <Area type="monotone" dataKey="nova" stroke="#f37021" strokeWidth={2} fill="url(#nova)" />
            <Area type="monotone" dataKey="cmh" stroke="#3b82f6" strokeWidth={2} fill="url(#cmh)" />
            <Area type="monotone" dataKey="dfw" stroke="#10b981" strokeWidth={2} fill="url(#dfw)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
