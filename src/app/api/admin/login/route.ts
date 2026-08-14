import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (email === 'irahulkv@gmail.com' && password === 'Edition@123') {
      const cookieStore = cookies();
      
      const cookieOptions = {
        name: 'admin_auth',
        value: 'true',
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7,
      };

      // Support for Next.js 15+ promise-based cookies
      if (typeof (cookieStore as any).then === 'function') {
        const store = await (cookieStore as any);
        store.set(cookieOptions);
      } else {
        (cookieStore as any).set(cookieOptions);
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
