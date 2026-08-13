import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Contact from '../../../models/Contact';

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

    return NextResponse.json({ success: true, contact: newContact }, { status: 201 });
  } catch (err) {
    console.error('submitContact error:', err);
    return NextResponse.json(
      { success: false, error: 'Unable to save contact to database' },
      { status: 500 }
    );
  }
}
