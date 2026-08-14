import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Visit from '../../../models/Visit';

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

export async function POST() {
  if (!process.env.MONGO_URI) {
    return NextResponse.json({ error: 'MONGO_URI not configured' }, { status: 500 });
  }

  try {
    await connectDB();

    const visit = await Visit.findByIdAndUpdate(
      "portfolio_visits",
      {
        $inc: { count: 1 },
        $set: { updatedAt: new Date() },
      },
      { upsert: true, new: true }
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
