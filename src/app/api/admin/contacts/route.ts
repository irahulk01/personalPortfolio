import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Contact from '../../../../models/Contact';
import { cookies } from 'next/headers';

async function checkAuth() {
  const cookieStore = cookies();
  let authCookie;
  
  if (typeof (cookieStore as any).then === 'function') {
    const store = await (cookieStore as any);
    authCookie = store.get('admin_auth');
  } else {
    authCookie = (cookieStore as any).get('admin_auth');
  }
  
  return authCookie && authCookie.value === 'true';
}

export async function GET() {
  if (!(await checkAuth())) {
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

export async function DELETE(req: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Contact ID is required' }, { status: 400 });
    }

    await connectDB();
    await Contact.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Contact deleted successfully' });
  } catch (err) {
    console.error('deleteContact error:', err);
    return NextResponse.json({ success: false, error: 'Failed to delete contact' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: 'ID and status are required' }, { status: 400 });
    }

    await connectDB();
    const updated = await Contact.findByIdAndUpdate(id, { status }, { new: true });
    return NextResponse.json({ success: true, contact: updated });
  } catch (err) {
    console.error('updateContact error:', err);
    return NextResponse.json({ success: false, error: 'Failed to update contact status' }, { status: 500 });
  }
}
