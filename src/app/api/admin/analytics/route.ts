import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Visit from '../../../../models/Visit';
import Session from '../../../../models/Session';
import Contact from '../../../../models/Contact';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = cookies();
  let authCookie;

  if (typeof (cookieStore as any).then === 'function') {
    const store = await (cookieStore as any);
    authCookie = store.get('admin_auth');
  } else {
    authCookie = (cookieStore as any).get('admin_auth');
  }

  if (!authCookie || authCookie.value !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();

    const visitData = await Visit.findById("portfolio_visits").lean();
    const totalVisits = visitData?.count || 0;

    const totalContacts = await Contact.countDocuments();

    // Aggregate Session Data
    const sessions = await Session.find({}).sort({ createdAt: 1 }).lean();

    let totalDuration = 0;
    let totalDownloads = 0;
    const deviceBreakdown: Record<string, number> = { Desktop: 0, Mobile: 0, Tablet: 0, Unknown: 0 };
    const pageViews: Record<string, number> = {};
    const dateCounts: Record<string, { date: string; timestamp: number; visits: number }> = {};

    sessions.forEach(session => {
      totalDuration += session.totalDurationSeconds || 0;
      if (session.downloadedResume) totalDownloads++;

      const device = session.deviceType || 'Unknown';
      deviceBreakdown[device] = (deviceBreakdown[device] || 0) + 1;

      if (session.pageBreakdown) {
        Object.entries(session.pageBreakdown).forEach(([page, duration]) => {
          pageViews[page] = (pageViews[page] || 0) + (duration as number);
        });
      }

      // Group by date ONLY for days with data
      if (session.createdAt) {
        const d = new Date(session.createdAt);
        const dateKey = d.toISOString().split('T')[0]; // YYYY-MM-DD
        const formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        if (!dateCounts[dateKey]) {
          dateCounts[dateKey] = {
            date: formattedDate,
            timestamp: d.getTime(),
            visits: 0
          };
        }
        dateCounts[dateKey].visits += 1;
      }
    });

    const averageDuration = sessions.length > 0 ? totalDuration / sessions.length : 0;

    const deviceData = Object.entries(deviceBreakdown)
      .filter(([_, val]) => val > 0)
      .map(([name, value]) => ({ name, value }));

    // Sort trendData chronologically and filter days with > 0 visits
    const trendData = Object.values(dateCounts)
      .sort((a, b) => a.timestamp - b.timestamp)
      .filter(item => item.visits > 0)
      .map(item => ({ date: item.date, visits: item.visits }));

    // Sort pages by most viewed (time spent)
    const pageData = Object.entries(pageViews)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // top 5 pages

    // Fetch 5 most recent visitor sessions
    const recentVisitors = await Session.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return NextResponse.json({
      totalVisits,
      totalContacts,
      totalDownloads,
      averageDuration,
      deviceData,
      pageData,
      trendData,
      recentVisitors
    });
  } catch (error) {
    console.error('Analytics Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
