"use client";


import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface TrafficTrendChartProps {
  trendData: { date: string; visits: number }[];
}

export default function TrafficTrendChart({ trendData }: TrafficTrendChartProps) {
  return (
    <div className="bg-[#21222d] rounded-3xl p-6 flex flex-col shadow-xl border border-[#2b2b36] md:col-span-2">
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="font-semibold text-lg text-white">Traffic Trend</span>
          <p className="text-xs text-[#87888c] mt-0.5">Visitor volume grouped by active days</p>
        </div>
      </div>
      <div className="h-56 w-full mt-auto">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a8a5ff" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#a8a5ff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="date" stroke="#87888c" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#87888c" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#171821', border: 'none', borderRadius: '12px' }}
            />
            <Area type="monotone" dataKey="visits" stroke="#a8a5ff" strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
