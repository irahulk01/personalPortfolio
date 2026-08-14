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

    // Fetch IP Geolocation
    const geo = ip ? await getIpGeoLocation(ip) : null;
    const locationStr = geo?.city
      ? `${geo.city}, ${geo.regionName ? geo.regionName + ', ' : ''}${geo.country}`
      : 'Local / Internal Visit';

    // Device Category Detection
    const { deviceType, deviceIcon } = getDeviceInfo(browserDetails?.viewportSize, userAgent);

    // Static Map Image URL
    const mapImageUrl = geo?.lat && geo?.lon
      ? `https://staticmap.openstreetmap.de/staticmap.php?center=${geo.lat},${geo.lon}&zoom=10&size=540x180&maptype=mapnik&markers=${geo.lat},${geo.lon},ol-marker`
      : null;

    // Build Page Breakdown Rows for all 5 site pages
    const pageRows = SITE_PAGES.map(({ route, label }) => {
      const sec = pageBreakdown[route] || 0;
      const isTop = route === topPage && sec > 0;
      const isVisited = sec > 0;

      return `
        <tr style="border-bottom: 1px solid #edf1fd;">
          <td style="padding: 10px 16px; font-weight: 600; color: #3e4355;">
            ${route} <span style="font-size: 12px; color: #8c90aa; font-weight: normal;">(${label})</span>
            ${isTop ? '<span style="color: #ff033e; font-size: 11px; font-weight: bold; margin-left: 6px;">★ HIGHEST INTEREST</span>' : ''}
          </td>
          <td style="padding: 10px 16px; text-align: right; font-weight: 700; color: ${isVisited ? '#3e4355' : '#8c90aa'};">
            ${isVisited ? formatDuration(sec) : '<span style="color: #a0a5b8; font-weight: normal;">0s (Not Visited)</span>'}
          </td>
        </tr>
      `;
    }).join('');

    const resumeBadgeHtml = downloadedResume
      ? `<span style="color: #2e7d32; background-color: #e8f5e9; border: 1px solid #a5d6a7; font-weight: 800; font-size: 12px; padding: 4px 12px; border-radius: 9999px; display: inline-block;">📥 YES — Downloaded CV (Rahul_Kumar_CV.pdf)</span>`
      : `<span style="color: #8c90aa; background-color: #f4f5f8; border: 1px solid #e0e2ec; font-weight: 600; font-size: 12px; padding: 4px 12px; border-radius: 9999px; display: inline-block;">❌ NO — Did Not Download CV</span>`;

    await resend.emails.send({
      from: 'Portfolio Visitor Alert <onboarding@resend.dev>',
      to: [recipient],
      subject: `${downloadedResume ? '📄 CV DOWNLOADED! • ' : ''}Visitor Summary (#${visitCount}) - ${deviceType} (${formatDuration(totalDurationSeconds)} on site)`,
      html: `
        <div style="background-color: #edf1fd; padding: 30px 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 24px; border: 1.5px solid rgba(210, 218, 240, 0.8); box-shadow: 0 16px 40px rgba(62, 67, 85, 0.08); padding: 28px; overflow: hidden;">
            
            <!-- Combined Header -->
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 22px; border-bottom: 2px solid #edf1fd; padding-bottom: 18px;">
              <div>
                <span style="display: inline-block; background-color: #ff033e; color: #ffffff; padding: 5px 16px; border-radius: 9999px; font-weight: 700; font-size: 13px; letter-spacing: 0.5px; box-shadow: 0 6px 16px rgba(255, 3, 62, 0.28);">VISITOR #${visitCount}</span>
                <h2 style="color: #3e4355; margin: 12px 0 0 0; font-size: 22px; font-weight: 800;">🚀 Visitor Exit & Activity Summary</h2>
              </div>
              <img src="${deviceIcon}" alt="${deviceType}" style="width: 54px; height: 54px;" />
            </div>

            <!-- Device & Total Duration Summary Card -->
            <div style="background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(237, 241, 253, 0.65) 100%); border: 1.5px solid rgba(210, 218, 240, 0.8); border-radius: 18px; padding: 16px 20px; margin-bottom: 20px;">
              <div style="display: flex; align-items: center; gap: 14px;">
                <img src="${deviceIcon}" alt="Device" style="width: 36px; height: 36px;" />
                <div>
                  <div style="font-size: 16px; font-weight: 700; color: #3e4355;">${deviceType}</div>
                  <div style="font-size: 13px; color: #8c90aa; margin-top: 2px;">
                    Viewport: <strong style="color: #3e4355;">${browserDetails?.viewportSize || 'N/A'}</strong> • Resolution: <strong style="color: #3e4355;">${browserDetails?.screenResolution || 'N/A'}</strong>
                  </div>
                  <div style="font-size: 14px; font-weight: 700; color: #ff033e; margin-top: 6px;">
                    ⏱️ Total Time Spent: ${formatDuration(totalDurationSeconds)}
                  </div>
                </div>
              </div>
            </div>

            <!-- Resume Download Action Card -->
            <div style="background: #ffffff; border: 1.5px solid rgba(210, 218, 240, 0.8); border-radius: 18px; padding: 14px 18px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between;">
              <span style="font-weight: 700; font-size: 14px; color: #3e4355;">📄 Resume / CV Downloaded:</span>
              ${resumeBadgeHtml}
            </div>

            <!-- Visitor Device & Telemetry Table -->
            <div style="border: 1.5px solid rgba(210, 218, 240, 0.8); border-radius: 18px; overflow: hidden; margin-bottom: 20px;">
              <div style="padding: 10px 16px; background: #3e4355; color: #ffffff; font-weight: 700; font-size: 13px;">
                🖥️ VISITOR & DEVICE INFORMATION
              </div>
              <table style="width: 100%; border-collapse: collapse; font-size: 13.5px;">
                <tr style="border-bottom: 1px solid #edf1fd;">
                  <td style="padding: 10px 16px; font-weight: 600; color: #8c90aa; width: 140px; background-color: #ffffff;">🕒 Time (IST):</td>
                  <td style="padding: 10px 16px; color: #3e4355; font-weight: 700; background-color: #ffffff;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
                </tr>
                <tr style="border-bottom: 1px solid #edf1fd;">
                  <td style="padding: 10px 16px; font-weight: 600; color: #8c90aa; background-color: rgba(237, 241, 253, 0.4);">🖥️ Screen Size:</td>
                  <td style="padding: 10px 16px; color: #3e4355; background-color: rgba(237, 241, 253, 0.4);">${browserDetails?.screenResolution || 'N/A'} (Retina: ${browserDetails?.devicePixelRatio || 1}x)</td>
                </tr>
                <tr style="border-bottom: 1px solid #edf1fd;">
                  <td style="padding: 10px 16px; font-weight: 600; color: #8c90aa; background-color: #ffffff;">📐 Viewport:</td>
                  <td style="padding: 10px 16px; color: #3e4355; background-color: #ffffff;">${browserDetails?.viewportSize || 'N/A'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #edf1fd;">
                  <td style="padding: 10px 16px; font-weight: 600; color: #8c90aa; background-color: rgba(237, 241, 253, 0.4);">🌍 Timezone:</td>
                  <td style="padding: 10px 16px; color: #3e4355; background-color: rgba(237, 241, 253, 0.4);">${browserDetails?.timezone || 'N/A'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #edf1fd;">
                  <td style="padding: 10px 16px; font-weight: 600; color: #8c90aa; background-color: #ffffff;">🗣️ Language:</td>
                  <td style="padding: 10px 16px; color: #3e4355; background-color: #ffffff;">${browserDetails?.language || 'N/A'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #edf1fd;">
                  <td style="padding: 10px 16px; font-weight: 600; color: #8c90aa; background-color: rgba(237, 241, 253, 0.4);">🔗 Traffic Source:</td>
                  <td style="padding: 10px 16px; color: #3e4355; font-weight: 700; background-color: rgba(237, 241, 253, 0.4);">${browserDetails?.referrer || 'Direct / Bookmark'}</td>
                </tr>
                ${
                  ip
                    ? `
                <tr>
                  <td style="padding: 10px 16px; font-weight: 600; color: #8c90aa; background-color: #ffffff;">🌐 IP Address:</td>
                  <td style="padding: 10px 16px; color: #3e4355; font-family: monospace; background-color: #ffffff;">${ip}</td>
                </tr>
                  `
                    : ''
                }
              </table>
            </div>

            <!-- Location & Map Section -->
            ${
              mapImageUrl
                ? `
                <div style="border: 1.5px solid rgba(210, 218, 240, 0.8); border-radius: 18px; overflow: hidden; margin-bottom: 20px;">
                  <div style="padding: 10px 16px; background: rgba(237, 241, 253, 0.6); font-weight: 700; color: #3e4355; font-size: 13.5px; border-bottom: 1px solid rgba(210, 218, 240, 0.8);">
                    📍 Visitor Location: <span style="color: #ff033e;">${locationStr}</span> ${geo?.isp ? `(${geo.isp})` : ''}
                  </div>
                  <img src="${mapImageUrl}" alt="Location Map" style="width: 100%; height: 170px; object-fit: cover; display: block;" />
                </div>
                `
                : `
                <div style="background: rgba(237, 241, 253, 0.6); border: 1.5px solid rgba(210, 218, 240, 0.8); border-radius: 18px; padding: 12px 16px; margin-bottom: 20px; font-size: 13.5px; color: #3e4355;">
                  <strong>📍 Location:</strong> <span style="color: #3e4355; font-weight: 600;">${locationStr}</span>
                </div>
                `
            }

            <!-- Page Time & Interest Breakdown Table -->
            <div style="border: 1.5px solid rgba(210, 218, 240, 0.8); border-radius: 18px; overflow: hidden; margin-bottom: 20px;">
              <div style="padding: 10px 16px; background: #3e4355; color: #ffffff; font-weight: 700; font-size: 13px;">
                ⏱️ PAGE TIME & INTEREST BREAKDOWN
              </div>
              <table style="width: 100%; border-collapse: collapse; font-size: 13.5px;">
                <thead>
                  <tr style="background-color: rgba(237, 241, 253, 0.8); color: #3e4355; border-bottom: 1px solid #edf1fd;">
                    <th style="padding: 8px 16px; text-align: left; font-size: 12px;">PAGE</th>
                    <th style="padding: 8px 16px; text-align: right; font-size: 12px;">TIME SPENT</th>
                  </tr>
                </thead>
                <tbody>
                  ${pageRows}
                </tbody>
              </table>
            </div>

            <!-- Footer -->
            <div style="font-size: 12px; color: #8c90aa; text-align: center; border-top: 1.5px solid #edf1fd; padding-top: 16px;">
              Sent automatically from your portfolio website visitor tracking system. Saved to MongoDB Atlas.
            </div>
          </div>
        </div>
      `,
    });
    console.log(`[Resend] Combined visitor exit email sent for Visit #${visitCount}`);
  } catch (err) {
    console.error('[Resend] Failed to send combined email:', err);
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

    // Determine top page
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

    // Upsert session in MongoDB including downloadedResume flag
    const updatedSession = await Session.findOneAndUpdate(
      { sessionId },
      {
        sessionId,
        visitorId,
        totalDurationSeconds: Math.round(totalDurationSeconds || 0),
        topPage,
        pageBreakdown: pageBreakdown || {},
        downloadedResume: Boolean(downloadedResume),
        updatedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    // Fetch visit count
    let visitCount = 1;
    try {
      const visitObj = await Visit.findById("portfolio_visits");
      if (visitObj) visitCount = visitObj.count;
    } catch {
      // ignore
    }

    // Extract headers for device/IP details
    const userAgent = req.headers.get('user-agent');
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip');

    // Send ONE SINGLE COMBINED EMAIL when visitor leaves site
    if (isFinal && (totalDurationSeconds || 0) >= 2) {
      sendCombinedSessionEmail({
        visitCount,
        totalDurationSeconds: Math.round(totalDurationSeconds || 0),
        topPage,
        pageBreakdown: pageBreakdown || {},
        downloadedResume: Boolean(downloadedResume),
        browserDetails,
        userAgent,
        ip,
      }).catch((e) => console.error(e));
    }

    return NextResponse.json({ success: true, session: updatedSession });
  } catch (err) {
    console.error('Save session error:', err);
    return NextResponse.json({ success: false, error: 'Failed to save session' }, { status: 500 });
  }
}
