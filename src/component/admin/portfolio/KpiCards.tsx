"use client";


import { FiUsers, FiClock, FiDownload, FiMessageSquare } from 'react-icons/fi';

interface KpiCardsProps {
  totalVisits: number;
  averageDuration: number;
  totalDownloads: number;
  totalContacts: number;
  pendingContactsCount: number;
}

export default function KpiCards({
  totalVisits,
  averageDuration,
  totalDownloads,
  totalContacts,
  pendingContactsCount,
}: KpiCardsProps) {
  const formatDuration = (seconds: number) => {
    const m = Math.floor((seconds || 0) / 60);
    const s = Math.floor((seconds || 0) % 60);
    return `${m}m ${s}s`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <div className="bg-[#21222d] p-5 rounded-3xl border border-[#2b2b36] shadow-xl flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-[#87888c] uppercase tracking-wider mb-1">Total Unique Visits</p>
          <h3 className="text-2xl font-bold text-white">{totalVisits.toLocaleString()}</h3>
          <span className="text-[11px] text-emerald-400 font-medium">+14% vs last week</span>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#a8a5ff]/15 text-[#a8a5ff] flex items-center justify-center text-xl">
          <FiUsers />
        </div>
      </div>

      <div className="bg-[#21222d] p-5 rounded-3xl border border-[#2b2b36] shadow-xl flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-[#87888c] uppercase tracking-wider mb-1">Avg Session Duration</p>
          <h3 className="text-2xl font-bold text-white">{formatDuration(averageDuration)}</h3>
          <span className="text-[11px] text-[#87888c]">Active engagement</span>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#ff9f43]/15 text-[#ff9f43] flex items-center justify-center text-xl">
          <FiClock />
        </div>
      </div>

      <div className="bg-[#21222d] p-5 rounded-3xl border border-[#2b2b36] shadow-xl flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-[#87888c] uppercase tracking-wider mb-1">Resume Downloads</p>
          <h3 className="text-2xl font-bold text-white">{totalDownloads}</h3>
          <span className="text-[11px] text-emerald-400 font-medium">Recruiter downloads</span>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center text-xl">
          <FiDownload />
        </div>
      </div>

      <div className="bg-[#21222d] p-5 rounded-3xl border border-[#2b2b36] shadow-xl flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-[#87888c] uppercase tracking-wider mb-1">Contact Inquiries</p>
          <h3 className="text-2xl font-bold text-white">{totalContacts}</h3>
          <span className="text-[11px] text-[#a8a5ff] font-medium">{pendingContactsCount} Pending</span>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#a8a5ff]/15 text-[#a8a5ff] flex items-center justify-center text-xl">
          <FiMessageSquare />
        </div>
      </div>
    </div>
  );
}
