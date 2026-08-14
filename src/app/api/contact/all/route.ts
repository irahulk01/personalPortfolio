import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
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
    const contacts = await Contact.find().sort({ createdAt: -1 }).lean().exec();
    return NextResponse.json({ success: true, count: contacts.length, contacts });
  } catch (err) {
    console.error('getContacts error:', err);
    return NextResponse.json(
      { success: false, error: 'Unable to fetch contacts from database' },
      { status: 500 }
    );
  }
}
