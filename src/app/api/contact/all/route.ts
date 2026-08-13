import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Contact from '../../../../models/Contact';

export async function GET() {
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
