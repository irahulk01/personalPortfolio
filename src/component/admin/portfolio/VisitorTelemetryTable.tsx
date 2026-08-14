"use client";


import { FiMonitor, FiClock, FiDownload, FiMapPin } from 'react-icons/fi';
import { VisitorSession } from '../../../api/admin';

interface VisitorTelemetryTableProps {
  recentVisitors: VisitorSession[];
}

export default function VisitorTelemetryTable({ recentVisitors }: VisitorTelemetryTableProps) {
  const formatDuration = (seconds: number) => {
    const m = Math.floor((seconds || 0) / 60);
    const s = Math.floor((seconds || 0) % 60);
    return `${m}m ${s}s`;
  };

  return (
    <div className="bg-[#21222d] rounded-3xl p-6 flex flex-col shadow-xl border border-[#2b2b36]">
      <div className="flex justify-between items-center mb-5">
        <div>
          <span className="font-semibold text-lg text-white">Live Visitor Telemetry</span>
          <p className="text-xs text-[#87888c] mt-0.5">Real-time session records for the 5 most recent portfolio visitors</p>
        </div>
        <span className="text-xs font-semibold text-[#a8a5ff] bg-[#a8a5ff]/10 px-3 py-1.5 rounded-xl border border-[#a8a5ff]/20 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Live Stream
        </span>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#2b2b36] text-[#87888c] text-xs font-medium uppercase tracking-wider">
              <th className="py-3 px-3">Platform</th>
              <th className="py-3 px-3">Time (Local / IST)</th>
              <th className="py-3 px-3">Duration</th>
              <th className="py-3 px-3">Top Route</th>
              <th className="py-3 px-3">Resume Downloaded</th>
              <th className="py-3 px-3">Location / IP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2b2b36]/30">
            {recentVisitors?.map((session, i) => (
              <tr key={session._id || i} className="hover:bg-[#2b2b36]/30 transition-colors text-sm">
                <td className="py-3.5 px-3">
                  <div className="flex items-center gap-2">
                    <FiMonitor className="text-[#a8a5ff] text-sm" />
                    <span className="text-xs font-medium text-white px-2.5 py-1 rounded-lg bg-[#171821]">
                      {session.deviceType || 'Desktop'}
                    </span>
                  </div>
                </td>
                <td className="py-3.5 px-3 text-[#87888c] text-xs font-medium">
                  {new Date(session.createdAt).toLocaleString('en-IN', {
                    day: 'numeric',
                    month: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                  })}
                </td>
                <td className="py-3.5 px-3 text-white text-xs font-medium">
                  <div className="flex items-center gap-1.5">
                    <FiClock className="text-[#87888c] text-xs" />
                    {formatDuration(session.totalDurationSeconds)}
                  </div>
                </td>
                <td className="py-3.5 px-3 text-[#a8a5ff] text-xs font-mono font-medium">{session.topPage || '/'}</td>
                <td className="py-3.5 px-3">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold ${
                    session.downloadedResume ? 'bg-emerald-500/15 text-emerald-400' : 'bg-gray-500/15 text-gray-400'
                  }`}>
                    <FiDownload className="text-xs" />
                    {session.downloadedResume ? 'Downloaded' : 'No'}
                  </span>
                </td>
                <td className="py-3.5 px-3 text-[#87888c] text-xs font-mono">
                  <div className="flex items-center gap-1.5">
                    <FiMapPin className="text-xs text-[#87888c]" />
                    {session.ip || '::1 (Local / Internal)'}
                  </div>
                </td>
              </tr>
            ))}
            {(!recentVisitors || recentVisitors.length === 0) && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-[#87888c] text-xs">No recent visitor sessions recorded yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
