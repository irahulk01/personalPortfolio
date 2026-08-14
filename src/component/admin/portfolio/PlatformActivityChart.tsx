"use client";


import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface PlatformActivityChartProps {
  deviceData: { name: string; value: number }[];
  totalVisits: number;
}

export default function PlatformActivityChart({ deviceData, totalVisits }: PlatformActivityChartProps) {
  const PIE_COLORS = ['#a8a5ff', '#ff9f43', '#87888c', '#4a4a58'];

  return (
    <div className="bg-[#21222d] rounded-3xl p-6 flex flex-col shadow-xl border border-[#2b2b36]">
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="font-semibold text-lg text-white">Platform Activity</span>
          <p className="text-xs text-[#87888c] mt-0.5">Device type distribution</p>
        </div>
      </div>
      <div className="h-48 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={deviceData}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={85}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {deviceData.map((_: any, index: number) => (
                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#171821', border: 'none', borderRadius: '12px' }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-2xl font-bold text-white">+{totalVisits}</div>
          <div className="text-xs text-[#87888c]">Total Visits</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 mt-4 justify-center">
        {deviceData.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}></div>
            <span className="text-[#87888c]">{entry.name}</span>
            <span className="font-semibold text-white">{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
