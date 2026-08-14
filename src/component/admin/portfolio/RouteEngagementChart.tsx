"use client";


import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface RouteEngagementChartProps {
  pageData: { name: string; value: number }[];
}

export default function RouteEngagementChart({ pageData }: RouteEngagementChartProps) {
  return (
    <div className="bg-[#21222d] rounded-3xl p-6 flex flex-col shadow-xl border border-[#2b2b36]">
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="font-semibold text-lg text-white">Route Engagement</span>
          <p className="text-xs text-[#87888c] mt-0.5">Time spent per page (seconds)</p>
        </div>
      </div>
      <div className="h-56 w-full mt-auto">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={pageData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" stroke="#87888c" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#87888c" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              contentStyle={{ backgroundColor: '#171821', border: 'none', borderRadius: '12px' }}
            />
            <Bar dataKey="value" fill="#87888c" radius={[4, 4, 4, 4]} barSize={14} activeBar={<Cell fill="#ff9f43" />} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
