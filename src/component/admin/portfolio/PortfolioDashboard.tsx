"use client";

import { useEffect, useState } from 'react';
import KpiCards from './KpiCards';
import VisitorTelemetryTable from './VisitorTelemetryTable';
import RecentContactsInbox from './RecentContactsInbox';
import PlatformActivityChart from './PlatformActivityChart';
import TrafficTrendChart from './TrafficTrendChart';
import RouteEngagementChart from './RouteEngagementChart';
import { getAdminAnalytics, getAdminContacts, deleteAdminContact, updateAdminContactStatus } from '../../../api/admin';

export default function PortfolioDashboard() {
  const [data, setData] = useState<any>(null);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [analyticsData, contactsData] = await Promise.all([
        getAdminAnalytics(),
        getAdminContacts()
      ]);
      setData(analyticsData);
      if (contactsData.contacts) {
        setContacts(contactsData.contacts);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteContact = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact submission?')) return;
    try {
      setContacts(prev => prev.filter(c => c._id !== id));
      await deleteAdminContact(id);
    } catch (err) {
      console.error('Failed to delete contact:', err);
      fetchDashboardData();
    }
  };

  const handleToggleStatus = async (id: string, currentStatus?: string) => {
    const nextStatus = currentStatus === 'Contacted' ? 'New' : 'Contacted';
    try {
      setContacts(prev => prev.map(c => c._id === id ? { ...c, status: nextStatus } : c));
      await updateAdminContactStatus(id, nextStatus);
    } catch (err) {
      console.error('Failed to update status:', err);
      fetchDashboardData();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a8a5ff]"></div>
      </div>
    );
  }

  if (!data || data.error) {
    return <div className="p-8 text-center text-[#ff9f43]">Failed to load analytics data.</div>;
  }

  const pendingContactsCount = contacts.filter(c => c.status === 'New' || !c.status).length;

  return (
    <div className="space-y-8 pb-10">
      {/* Priority 1: Top KPI Cards */}
      <KpiCards
        totalVisits={data.totalVisits}
        averageDuration={data.averageDuration}
        totalDownloads={data.totalDownloads}
        totalContacts={data.totalContacts}
        pendingContactsCount={pendingContactsCount}
      />

      {/* Priority 2: Live Visitor Telemetry Feed */}
      <VisitorTelemetryTable recentVisitors={data.recentVisitors || []} />

      {/* Priority 3: Contacts Inbox & Activity Chart */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RecentContactsInbox
          contacts={contacts}
          onDeleteContact={handleDeleteContact}
          onToggleStatus={handleToggleStatus}
        />
        <PlatformActivityChart
          deviceData={data.deviceData || []}
          totalVisits={data.totalVisits}
        />
      </div>

      {/* Priority 4: Traffic Trend & Route Engagement */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TrafficTrendChart trendData={data.trendData || []} />
        <RouteEngagementChart pageData={data.pageData || []} />
      </div>
    </div>
  );
}
