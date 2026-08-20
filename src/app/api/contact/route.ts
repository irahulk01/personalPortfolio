import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Contact from '../../../models/Contact';
import { Resend } from 'resend';

async function sendEmailNotification(data: {
  name: string;
  email: string;
  phoneNumber: string;
  description: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[Resend] RESEND_API_KEY is missing. Skipping email notification.');
    return;
  }

  const resend = new Resend(apiKey);
  const recipient = process.env.CONTACT_NOTIFICATION_EMAIL || 'irahulkv@gmail.com';

  const { data: emailData, error } = await resend.emails.send({
    from: 'Portfolio Contact Form <onboarding@resend.dev>',
    to: [recipient],
    replyTo: data.email,
    subject: `📩 New Contact Request from ${data.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
        <h2 style="color: #ff033e; border-bottom: 2px solid #ff033e; padding-bottom: 10px; margin-top: 0;">New Portfolio Inquiry</h2>
        <p style="font-size: 15px; color: #333;">You received a new message from your portfolio website:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr>
            <td style="padding: 10px; font-weight: bold; width: 120px; color: #555; border-bottom: 1px solid #eee;">Name:</td>
            <td style="padding: 10px; color: #111; border-bottom: 1px solid #eee;">${data.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; color: #555; border-bottom: 1px solid #eee;">Email:</td>
            <td style="padding: 10px; color: #111; border-bottom: 1px solid #eee;"><a href="mailto:${data.email}" style="color: #ff033e; text-decoration: none;">${data.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; color: #555; border-bottom: 1px solid #eee;">Phone:</td>
            <td style="padding: 10px; color: #111; border-bottom: 1px solid #eee;">${data.phoneNumber}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; vertical-align: top; color: #555;">Message:</td>
            <td style="padding: 10px; color: #111; line-height: 1.5;">${data.description || 'No description provided.'}</td>
          </tr>
        </table>
        
        <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #777; text-align: center;">
          Sent automatically from your portfolio website via Resend.
        </div>
      </div>
    `,
  });

  if (error) {
    console.error('[Resend] Error sending email:', error);
  } else {
    console.log('[Resend] Email notification sent successfully:', emailData?.id);
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, phoneNumber, description } = body || {};

    if (!name || !email || !phoneNumber) {
      return NextResponse.json(
        { success: false, error: 'name, email and phoneNumber are required' },
        { status: 400 }
      );
    }

    const existing = await Contact.findOne({ email }).exec();
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Contact with this email already exists' },
        { status: 409 }
      );
    }

    const newContact = await Contact.create({
      name,
      email,
      phoneNumber,
      description: description || '',
    });

    // Send email notification via Resend asynchronously
    try {
      await sendEmailNotification({
        name,
        email,
        phoneNumber,
        description: description || '',
      });
    } catch (emailError) {
      console.error('[Resend] Failed to send email notification:', emailError);
    }

    return NextResponse.json({ success: true, contact: newContact }, { status: 201 });
  } catch (err) {
    console.error('submitContact error:', err);
    return NextResponse.json(
      { success: false, error: 'Unable to save contact to database' },
      { status: 500 }
    );
  }
}
