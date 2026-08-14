import axios from "axios";

const ADMIN_API_BASE = "/api/admin";

export interface VisitorSession {
  _id: string;
  sessionId: string;
  visitorId: string;
  totalDurationSeconds: number;
  topPage: string;
  pageBreakdown?: Record<string, number>;
  downloadedResume: boolean;
  ip?: string;
  location?: string;
  deviceType?: string;
  createdAt: string;
}

export interface AnalyticsData {
  totalVisits: number;
  totalContacts: number;
  totalDownloads: number;
  averageDuration: number;
  deviceData: { name: string; value: number }[];
  pageData: { name: string; value: number }[];
  trendData: { date: string; visits: number }[];
  recentVisitors: VisitorSession[];
}

/**
 * Fetch Admin Analytics Telemetry & Trend Data
 */
export const getAdminAnalytics = async (): Promise<AnalyticsData> => {
  const res = await axios.get(`${ADMIN_API_BASE}/analytics`);
  return res.data;
};

/**
 * Fetch All Submitted Contact Inquiries (Admin)
 */
export const getAdminContacts = async () => {
  const res = await axios.get(`${ADMIN_API_BASE}/contacts`);
  return res.data;
};

/**
 * Delete a Contact Inquiry by ID (Admin)
 */
export const deleteAdminContact = async (id: string) => {
  const res = await axios.delete(`${ADMIN_API_BASE}/contacts?id=${id}`);
  return res.data;
};

/**
 * Update Contact Inquiry Status (Admin)
 */
export const updateAdminContactStatus = async (id: string, status: string) => {
  const res = await axios.patch(`${ADMIN_API_BASE}/contacts`, { id, status });
  return res.data;
};

/**
 * Authenticate Admin User
 */
export const loginAdmin = async (email: string, password: string) => {
  const res = await axios.post(`${ADMIN_API_BASE}/login`, { email, password });
  return res.data;
};
