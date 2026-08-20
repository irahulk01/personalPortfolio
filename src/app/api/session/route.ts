import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Session from '../../../models/Session';
import Visit from '../../../models/Visit';
import { Resend } from 'resend';

interface BrowserDetails {
  screenResolution?: string;
  viewportSize?: string;
  devicePixelRatio?: number;
  language?: string;
  timezone?: string;
  referrer?: string;
}

interface GeoLocation {
  city?: string;
  regionName?: string;
  country?: string;
  isp?: string;
  lat?: number;
  lon?: number;
}

function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return '0s';
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

const SITE_PAGES: { route: string; label: string }[] = [
  { route: '/', label: 'Home Page' },
  { route: '/about', label: 'About Page' },
  { route: '/work', label: 'Projects / Work Page' },
  { route: '/resume', label: 'Resume Page' },
  { route: '/contact', label: 'Contact Page' },
];

async function getIpGeoLocation(ip: string): Promise<GeoLocation | null> {
  try {
    const cleanIp = ip.split(',')[0].trim();
    if (!cleanIp || cleanIp === '127.0.0.1' || cleanIp === '::1') return null;

    const res = await fetch(
      `http://ip-api.com/json/${cleanIp}?fields=status,country,regionName,city,isp,lat,lon`,
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    if (data.status === 'success') {
      return {
        city: data.city,
        regionName: data.regionName,
        country: data.country,
        isp: data.isp,
        lat: data.lat,
        lon: data.lon,
      };
    }
  } catch (e) {
    console.error('[GeoIP] Error fetching IP details:', e);
  }
  return null;
}

function getDeviceInfo(viewportSize?: string, userAgent?: string | null) {
  const ua = (userAgent || '').toLowerCase();
  let viewportWidth = 1200;

  if (viewportSize) {
    const parts = viewportSize.split('x');
    if (parts.length > 0) {
      viewportWidth = parseInt(parts[0], 10) || 1200;
    }
  }

  let deviceType = 'Desktop / Laptop';
  let deviceIcon = 'https://img.icons8.com/fluency/96/laptop.png';

  if (ua.includes('mobile') || ua.includes('iphone') || ua.includes('android')) {
    if (ua.includes('ipad') || ua.includes('tablet')) {
      deviceType = 'Tablet / iPad';
      deviceIcon = 'https://img.icons8.com/fluency/96/ipad.png';
    } else {
      deviceType = 'Smartphone / Mobile';
      deviceIcon = 'https://img.icons8.com/fluency/96/iphone.png';
    }
  } else if (viewportWidth < 768) {
    deviceType = 'Smartphone / Mobile';
    deviceIcon = 'https://img.icons8.com/fluency/96/iphone.png';
  } else if (viewportWidth < 1024) {
    deviceType = 'Tablet / iPad';
    deviceIcon = 'https://img.icons8.com/fluency/96/ipad.png';
  } else if (viewportWidth >= 1920) {
    deviceType = 'Large Desktop / 4K Monitor';
    deviceIcon = 'https://img.icons8.com/fluency/96/monitor.png';
  }

  return { deviceType, deviceIcon };
}

async function sendCombinedSessionEmail({
  visitCount,
  totalDurationSeconds,
  topPage,
  pageBreakdown,
  downloadedResume,
  browserDetails,
  userAgent,
  ip,
}: {
  visitCount: number;
  totalDurationSeconds: number;
  topPage: string;
  pageBreakdown: Record<string, number>;
  downloadedResume?: boolean;
  browserDetails?: BrowserDetails;
  userAgent?: string | null;
  ip?: string | null;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  try {
    const resend = new Resend(apiKey);
    const recipient = process.env.CONTACT_NOTIFICATION_EMAIL || 'irahulkv@gmail.com';

    // Geo lookup
    const geo = ip ? await getIpGeoLocation(ip) : null;
    const locationStr = geo?.city
      ? `${geo.city}${geo.regionName ? ', ' + geo.regionName : ''}, ${geo.country}`
      : 'Local / Unknown';

    // Device detection
    const { deviceType } = getDeviceInfo(browserDetails?.viewportSize, userAgent);

    // Page rows — only show pages with time > 0, sorted descending
    const pageRowsHtml = SITE_PAGES
      .map(({ route, label }) => {
        const sec = pageBreakdown[route] || 0;
        const isTop = route === topPage && sec > 0;
        const isVisited = sec > 0;
        const bg = isTop ? '#1e3a5f' : '#1a2236';
        const timeColor = isTop ? '#60a5fa' : isVisited ? '#94a3b8' : '#475569';
        const routeColor = isTop ? '#e2e8f0' : isVisited ? '#cbd5e1' : '#475569';
        return `
          <tr>
            <td style="padding:10px 16px;border-bottom:1px solid #1e293b;background:${bg};color:${routeColor};font-size:13px;font-weight:${isTop ? '700' : '400'};">
              ${route} <span style="color:#64748b;font-size:11px;">(${label})</span>
              ${isTop ? ' <span style="color:#60a5fa;font-size:11px;font-weight:700;">★ TOP PAGE</span>' : ''}
            </td>
            <td style="padding:10px 16px;border-bottom:1px solid #1e293b;background:${bg};text-align:right;font-size:13px;font-weight:600;color:${timeColor};font-family:monospace;">
              ${isVisited ? formatDuration(sec) : '—'}
            </td>
          </tr>`;
      })
      .join('');

    const cvBadge = downloadedResume
      ? `<span style="background:#14532d;color:#86efac;border:1px solid #166534;padding:4px 12px;border-radius:6px;font-size:12px;font-weight:700;">✓ Downloaded</span>`
      : `<span style="background:#1e293b;color:#64748b;border:1px solid #334155;padding:4px 12px;border-radius:6px;font-size:12px;">✗ Not Downloaded</span>`;

    const mapHtml = geo?.lat && geo?.lon
      ? `<img src="https://staticmap.openstreetmap.de/staticmap.php?center=${geo.lat},${geo.lon}&zoom=10&size=540x160&maptype=mapnik&markers=${geo.lat},${geo.lon},ol-marker" alt="Location Map" style="width:100%;display:block;border-radius:0 0 8px 8px;" />`
      : '';

    await resend.emails.send({
      from: 'Portfolio Tracker <onboarding@resend.dev>',
      to: [recipient],
      subject: `${downloadedResume ? '📄 CV Downloaded · ' : ''}Visitor #${visitCount} — ${deviceType} · ${formatDuration(totalDurationSeconds)}`,
      html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:24px 8px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#0f172a;">

        <!-- HEADER -->
        <tr>
          <td style="padding:0 0 20px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#1e293b;border-radius:12px;border:1px solid #334155;">
              <tr>
                <td style="padding:20px 24px 16px 24px;border-bottom:1px solid #334155;">
                  <span style="background:#1d4ed8;color:#fff;font-size:11px;font-weight:700;padding:3px 10px;border-radius:4px;letter-spacing:0.5px;">VISITOR #${visitCount}</span>
                  <p style="margin:10px 0 0 0;font-size:20px;font-weight:700;color:#f1f5f9;">Portfolio Visitor Summary</p>
                  <p style="margin:4px 0 0 0;font-size:12px;color:#64748b;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
                </td>
              </tr>
              <!-- QUICK STATS ROW -->
              <tr>
                <td style="padding:16px 24px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="width:33%;text-align:center;padding:0 4px;">
                        <p style="margin:0;font-size:22px;font-weight:700;color:#60a5fa;">${formatDuration(totalDurationSeconds)}</p>
                        <p style="margin:4px 0 0 0;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Time on Site</p>
                      </td>
                      <td style="width:33%;text-align:center;padding:0 4px;border-left:1px solid #334155;border-right:1px solid #334155;">
                        <p style="margin:0;font-size:22px;font-weight:700;color:#a78bfa;">${deviceType.split('/')[0].trim()}</p>
                        <p style="margin:4px 0 0 0;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Device</p>
                      </td>
                      <td style="width:33%;text-align:center;padding:0 4px;">
                        <p style="margin:0;font-size:22px;font-weight:700;color:${downloadedResume ? '#4ade80' : '#94a3b8'};">${downloadedResume ? 'YES' : 'NO'}</p>
                        <p style="margin:4px 0 0 0;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">CV Download</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- DEVICE & BROWSER INFO -->
        <tr>
          <td style="padding:0 0 16px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:10px;overflow:hidden;border:1px solid #334155;">
              <tr><td style="background:#1e3a5f;padding:10px 16px;font-size:11px;font-weight:700;color:#93c5fd;letter-spacing:0.8px;text-transform:uppercase;">🖥 Device &amp; Browser</td></tr>
              <tr>
                <td style="background:#111827;padding:0;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding:10px 16px;font-size:12px;color:#94a3b8;width:120px;border-bottom:1px solid #1e293b;">Device</td>
                      <td style="padding:10px 16px;font-size:13px;color:#e2e8f0;font-weight:600;border-bottom:1px solid #1e293b;">${deviceType}</td>
                    </tr>
                    <tr>
                      <td style="padding:10px 16px;font-size:12px;color:#94a3b8;border-bottom:1px solid #1e293b;">Screen</td>
                      <td style="padding:10px 16px;font-size:13px;color:#e2e8f0;font-family:monospace;border-bottom:1px solid #1e293b;">${browserDetails?.screenResolution || 'N/A'} (${browserDetails?.devicePixelRatio || 1}x DPR)</td>
                    </tr>
                    <tr>
                      <td style="padding:10px 16px;font-size:12px;color:#94a3b8;border-bottom:1px solid #1e293b;">Viewport</td>
                      <td style="padding:10px 16px;font-size:13px;color:#e2e8f0;font-family:monospace;border-bottom:1px solid #1e293b;">${browserDetails?.viewportSize || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style="padding:10px 16px;font-size:12px;color:#94a3b8;border-bottom:1px solid #1e293b;">Language</td>
                      <td style="padding:10px 16px;font-size:13px;color:#e2e8f0;border-bottom:1px solid #1e293b;">${browserDetails?.language || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style="padding:10px 16px;font-size:12px;color:#94a3b8;border-bottom:1px solid #1e293b;">Timezone</td>
                      <td style="padding:10px 16px;font-size:13px;color:#e2e8f0;border-bottom:1px solid #1e293b;">${browserDetails?.timezone || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style="padding:10px 16px;font-size:12px;color:#94a3b8;border-bottom:1px solid #1e293b;">Traffic Source</td>
                      <td style="padding:10px 16px;font-size:13px;color:#e2e8f0;border-bottom:1px solid #1e293b;">${browserDetails?.referrer || 'Direct'}</td>
                    </tr>
                    ${ip ? `
                    <tr>
                      <td style="padding:10px 16px;font-size:12px;color:#94a3b8;">IP Address</td>
                      <td style="padding:10px 16px;font-size:13px;color:#60a5fa;font-family:monospace;">${ip.split(',')[0].trim()}</td>
                    </tr>` : ''}
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- LOCATION -->
        <tr>
          <td style="padding:0 0 16px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:10px;overflow:hidden;border:1px solid #334155;">
              <tr><td style="background:#1e3a5f;padding:10px 16px;font-size:11px;font-weight:700;color:#93c5fd;letter-spacing:0.8px;text-transform:uppercase;">📍 Location</td></tr>
              <tr>
                <td style="background:#111827;padding:14px 16px;font-size:14px;color:#e2e8f0;font-weight:600;">
                  ${locationStr}
                  ${geo?.isp ? `<span style="font-size:12px;color:#64748b;font-weight:400;"> · ${geo.isp}</span>` : ''}
                </td>
              </tr>
              ${mapHtml ? `<tr><td style="padding:0;">${mapHtml}</td></tr>` : ''}
            </table>
          </td>
        </tr>

        <!-- CV DOWNLOAD -->
        <tr>
          <td style="padding:0 0 16px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:10px;overflow:hidden;border:1px solid #334155;">
              <tr><td style="background:#1e3a5f;padding:10px 16px;font-size:11px;font-weight:700;color:#93c5fd;letter-spacing:0.8px;text-transform:uppercase;">📄 CV / Resume</td></tr>
              <tr>
                <td style="background:#111827;padding:14px 16px;">
                  ${cvBadge}
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- PAGE TIME BREAKDOWN -->
        <tr>
          <td style="padding:0 0 24px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:10px;overflow:hidden;border:1px solid #334155;">
              <tr><td style="background:#1e3a5f;padding:10px 16px;font-size:11px;font-weight:700;color:#93c5fd;letter-spacing:0.8px;text-transform:uppercase;">⏱ Time Per Page</td></tr>
              <tr>
                <td style="background:#1a2236;padding:0;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <th style="padding:8px 16px;text-align:left;font-size:11px;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;background:#111827;border-bottom:1px solid #1e293b;">Page</th>
                      <th style="padding:8px 16px;text-align:right;font-size:11px;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;background:#111827;border-bottom:1px solid #1e293b;">Duration</th>
                    </tr>
                    ${pageRowsHtml}
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="text-align:center;padding-bottom:16px;">
            <p style="margin:0;font-size:11px;color:#334155;">Auto-sent by your portfolio tracker · Session data saved to MongoDB</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
    });

    console.log(`[Session] Exit email sent for Visitor #${visitCount}`);
  } catch (err) {
    console.error('[Session] Failed to send email:', err);
  }
}




export async function GET() {
  try {
    await connectDB();
    const sessions = await Session.find().sort({ updatedAt: -1 }).limit(100).exec();

    let totalTime = 0;
    const pageCounts: Record<string, number> = {};
    let totalCvDownloads = 0;

    sessions.forEach((s) => {
      totalTime += s.totalDurationSeconds || 0;
      if (s.downloadedResume) totalCvDownloads += 1;
      if (s.topPage) {
        pageCounts[s.topPage] = (pageCounts[s.topPage] || 0) + 1;
      }
    });

    let topPageOverall = '/';
    let maxCount = 0;
    Object.entries(pageCounts).forEach(([page, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topPageOverall = page;
      }
    });

    const averageDuration = sessions.length > 0 ? Math.round(totalTime / sessions.length) : 0;

    return NextResponse.json({
      success: true,
      stats: {
        totalSessions: sessions.length,
        totalTimeSpentSeconds: totalTime,
        averageSessionTimeSeconds: averageDuration,
        totalCvDownloads,
        topPageOverall,
      },
      sessions,
    });
  } catch (err) {
    console.error('Get sessions error:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch sessions' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    let textBody = '';
    try {
      textBody = await req.text();
    } catch {
      // empty
    }

    if (!textBody) {
      return NextResponse.json({ success: false, error: 'No payload' }, { status: 400 });
    }

    const payload = JSON.parse(textBody);
    const { sessionId, visitorId, pageBreakdown, totalDurationSeconds, downloadedResume, _t, isFinal } = payload || {};

    if (!sessionId || !visitorId) {
      return NextResponse.json({ success: false, error: 'sessionId and visitorId required' }, { status: 400 });
    }

    // Decode _t obfuscated token payload
    let browserDetails: BrowserDetails | undefined;
    if (_t) {
      try {
        const decodedStr = decodeURIComponent(Buffer.from(_t, 'base64').toString('utf-8'));
        const parsed = JSON.parse(decodedStr);
        browserDetails = {
          screenResolution: parsed.sr,
          viewportSize: parsed.vp,
          devicePixelRatio: parsed.pr,
          language: parsed.lg,
          timezone: parsed.tz,
          referrer: parsed.rf,
        };
      } catch {
        // token corrupted
      }
    }

    // Determine top page from time spent per page
    let topPage = '/';
    let maxSec = -1;
    if (pageBreakdown && typeof pageBreakdown === 'object') {
      Object.entries(pageBreakdown).forEach(([page, sec]) => {
        if ((sec as number) > maxSec) {
          maxSec = sec as number;
          topPage = page;
        }
      });
    }

    // Extract IP and device info from request headers
    const userAgent = req.headers.get('user-agent');
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip');
    const { deviceType } = getDeviceInfo(browserDetails?.viewportSize, userAgent);

    // Upsert session — persist ip and deviceType on first write, update times and pages on subsequent calls
    const existingSession = await Session.findOne({ sessionId });
    const updatedSession = await Session.findOneAndUpdate(
      { sessionId },
      {
        $set: {
          sessionId,
          visitorId,
          totalDurationSeconds: Math.round(totalDurationSeconds || 0),
          topPage,
          pageBreakdown: pageBreakdown || {},
          downloadedResume: Boolean(downloadedResume),
          updatedAt: new Date(),
          // Only set ip and deviceType if not already stored
          ...(existingSession?.ip ? {} : { ip: ip || undefined }),
          ...(existingSession?.deviceType ? {} : { deviceType }),
        },
      },
      { upsert: true, returnDocument: 'after' }
    );

    // Fetch current visit count for the email
    let visitCount = 1;
    try {
      const visitObj = await Visit.findById('portfolio_visits');
      if (visitObj) visitCount = visitObj.count;
    } catch {
      // ignore
    }

    // Send exit email exactly once per session when visitor leaves
    if (isFinal && (totalDurationSeconds || 0) >= 2 && !existingSession?.emailSent) {
      // Mark email as sent before firing so concurrent final beacons don't double-send
      await Session.findOneAndUpdate({ sessionId }, { $set: { emailSent: true } });

      sendCombinedSessionEmail({
        visitCount,
        totalDurationSeconds: Math.round(totalDurationSeconds || 0),
        topPage,
        pageBreakdown: pageBreakdown || {},
        downloadedResume: Boolean(downloadedResume),
        browserDetails,
        userAgent,
        ip,
      }).catch((e) => console.error('[Session] Email error:', e));
    }

    return NextResponse.json({ success: true, session: updatedSession });
  } catch (err) {
    console.error('Save session error:', err);
    return NextResponse.json({ success: false, error: 'Failed to save session' }, { status: 500 });
  }
}

