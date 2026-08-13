import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
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

async function sendVisitNotification(
  count: number,
  userAgent?: string | null,
  ip?: string | null,
  browserDetails?: BrowserDetails
) {
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

    await resend.emails.send({
      from: 'Portfolio Visitor Alert <onboarding@resend.dev>',
      to: [recipient],
      subject: `👀 New Visitor! (#${count}) - ${deviceType} from ${geo?.city || 'Your Site'}`,
      html: `
        <div style="background-color: #edf1fd; padding: 30px 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 24px; border: 1.5px solid rgba(210, 218, 240, 0.8); box-shadow: 0 16px 40px rgba(62, 67, 85, 0.08); padding: 28px; overflow: hidden;">
            
            <!-- Portfolio Themed Header -->
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; border-bottom: 2px solid #edf1fd; padding-bottom: 18px;">
              <div>
                <span style="display: inline-block; background-color: #ff033e; color: #ffffff; padding: 5px 16px; border-radius: 9999px; font-weight: 700; font-size: 13px; letter-spacing: 0.5px; box-shadow: 0 6px 16px rgba(255, 3, 62, 0.28);">VISIT #${count}</span>
                <h2 style="color: #3e4355; margin: 12px 0 0 0; font-size: 22px; font-weight: 800;">🚀 New Portfolio Visitor!</h2>
              </div>
              <img src="${deviceIcon}" alt="${deviceType}" style="width: 54px; height: 54px;" />
            </div>

            <p style="font-size: 15px; color: #4e5463; line-height: 1.6; margin-bottom: 20px;">Hello Rahul, someone just landed on your personal portfolio website!</p>
            
            <!-- Device Card (Portfolio Glass Style) -->
            <div style="background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(237, 241, 253, 0.65) 100%); border: 1.5px solid rgba(210, 218, 240, 0.8); border-radius: 18px; padding: 16px 20px; margin-bottom: 20px;">
              <div style="display: flex; align-items: center; gap: 14px;">
                <img src="${deviceIcon}" alt="Device" style="width: 36px; height: 36px;" />
                <div>
                  <div style="font-size: 16px; font-weight: 700; color: #3e4355;">${deviceType}</div>
                  <div style="font-size: 13px; color: #8c90aa; margin-top: 2px;">Viewport: <strong style="color: #3e4355;">${browserDetails?.viewportSize || 'N/A'}</strong> • Resolution: <strong style="color: #3e4355;">${browserDetails?.screenResolution || 'N/A'}</strong></div>
                </div>
              </div>
            </div>

            <!-- Location & Map Section -->
            ${
              mapImageUrl
                ? `
                <div style="border: 1.5px solid rgba(210, 218, 240, 0.8); border-radius: 18px; overflow: hidden; margin-bottom: 20px;">
                  <div style="padding: 12px 18px; background: rgba(237, 241, 253, 0.6); font-weight: 700; color: #3e4355; font-size: 14px; border-bottom: 1px solid rgba(210, 218, 240, 0.8);">
                    📍 Visitor Location: <span style="color: #ff033e;">${locationStr}</span> ${geo?.isp ? `(${geo.isp})` : ''}
                  </div>
                  <img src="${mapImageUrl}" alt="Location Map" style="width: 100%; height: 180px; object-fit: cover; display: block;" />
                </div>
                `
                : `
                <div style="background: rgba(237, 241, 253, 0.6); border: 1.5px solid rgba(210, 218, 240, 0.8); border-radius: 18px; padding: 14px 18px; margin-bottom: 20px; font-size: 14px; color: #3e4355;">
                  <strong>📍 Location:</strong> <span style="color: #3e4355; font-weight: 600;">${locationStr}</span>
                </div>
                `
            }

            <!-- Portfolio Styled Metrics Table -->
            <div style="border: 1.5px solid rgba(210, 218, 240, 0.8); border-radius: 18px; overflow: hidden; margin-bottom: 24px;">
              <table style="width: 100%; border-collapse: collapse; font-size: 13.5px;">
                <tr style="border-bottom: 1px solid #edf1fd;">
                  <td style="padding: 12px 18px; font-weight: 600; color: #8c90aa; width: 140px; background-color: #ffffff;">🕒 Time (IST):</td>
                  <td style="padding: 12px 18px; color: #3e4355; font-weight: 700; background-color: #ffffff;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
                </tr>
                <tr style="border-bottom: 1px solid #edf1fd;">
                  <td style="padding: 12px 18px; font-weight: 600; color: #8c90aa; background-color: rgba(237, 241, 253, 0.4);">🖥️ Screen Size:</td>
                  <td style="padding: 12px 18px; color: #3e4355; background-color: rgba(237, 241, 253, 0.4);">${browserDetails?.screenResolution || 'N/A'} (Retina: ${browserDetails?.devicePixelRatio || 1}x)</td>
                </tr>
                <tr style="border-bottom: 1px solid #edf1fd;">
                  <td style="padding: 12px 18px; font-weight: 600; color: #8c90aa; background-color: #ffffff;">📐 Viewport:</td>
                  <td style="padding: 12px 18px; color: #3e4355; background-color: #ffffff;">${browserDetails?.viewportSize || 'N/A'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #edf1fd;">
                  <td style="padding: 12px 18px; font-weight: 600; color: #8c90aa; background-color: rgba(237, 241, 253, 0.4);">🌍 Timezone:</td>
                  <td style="padding: 12px 18px; color: #3e4355; background-color: rgba(237, 241, 253, 0.4);">${browserDetails?.timezone || 'N/A'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #edf1fd;">
                  <td style="padding: 12px 18px; font-weight: 600; color: #8c90aa; background-color: #ffffff;">🗣️ Language:</td>
                  <td style="padding: 12px 18px; color: #3e4355; background-color: #ffffff;">${browserDetails?.language || 'N/A'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #edf1fd;">
                  <td style="padding: 12px 18px; font-weight: 600; color: #8c90aa; background-color: rgba(237, 241, 253, 0.4);">🔗 Traffic Source:</td>
                  <td style="padding: 12px 18px; color: #3e4355; font-weight: 700; background-color: rgba(237, 241, 253, 0.4);">${browserDetails?.referrer || 'Direct / Bookmark'}</td>
                </tr>
                ${
                  ip
                    ? `
                <tr>
                  <td style="padding: 12px 18px; font-weight: 600; color: #8c90aa; background-color: #ffffff;">🌐 IP Address:</td>
                  <td style="padding: 12px 18px; color: #3e4355; font-family: monospace; background-color: #ffffff;">${ip}</td>
                </tr>
                  `
                    : ''
                }
              </table>
            </div>

            <!-- Footer -->
            <div style="font-size: 12px; color: #8c90aa; text-align: center; border-top: 1.5px solid #edf1fd; padding-top: 18px;">
              Sent automatically from your portfolio website visitor tracking system.
            </div>
          </div>
        </div>
      `,
    });
    console.log(`[Resend] Portfolio-themed visit notification sent for count #${count}`);
  } catch (err) {
    console.error('[Resend] Failed to send visit notification:', err);
  }
}

export async function GET() {
  if (!process.env.MONGO_URI) {
    return NextResponse.json({ count: 0, warning: "no mongo uri configured" }, { status: 200 });
  }

  try {
    await connectDB();
    let visit = await Visit.findById("portfolio_visits");

    if (!visit) {
      visit = await Visit.create({
        _id: "portfolio_visits",
        count: 0,
      });
    }

    return NextResponse.json({
      count: visit.count,
      updatedAt: visit.updatedAt,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to get visit count' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!process.env.MONGO_URI) {
    return NextResponse.json({ error: 'MONGO_URI not configured' }, { status: 500 });
  }

  try {
    await connectDB();
    
    let browserDetails: BrowserDetails | undefined;
    try {
      const body = await req.json();
      browserDetails = body?.browserDetails;
    } catch {
      // Body empty or invalid JSON
    }

    const visit = await Visit.findByIdAndUpdate(
      "portfolio_visits",
      {
        $inc: { count: 1 },
        $set: { updatedAt: new Date() },
      },
      { upsert: true, new: true }
    );

    // Extract headers for device/IP details
    const userAgent = req.headers.get('user-agent');
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip');

    // Send email notification asynchronously with rich telemetry
    sendVisitNotification(visit.count, userAgent, ip, browserDetails).catch((err) =>
      console.error('sendVisitNotification async error:', err)
    );

    return NextResponse.json({
      count: visit.count,
      updatedAt: visit.updatedAt,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update visit count' }, { status: 500 });
  }
}
