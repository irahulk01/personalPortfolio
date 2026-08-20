/**
 * Migration: Backfill isReturningVisitor on all existing sessions
 *
 * Logic:
 *   - Sort all sessions by createdAt ASC
 *   - For each visitorId, the FIRST session → isReturningVisitor: false
 *   - All SUBSEQUENT sessions for that visitorId → isReturningVisitor: true
 *
 * Run once: node scripts/migrate-returning-visitor.mjs
 */

import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('❌ MONGO_URI not found in .env.local');
  process.exit(1);
}

await mongoose.connect(MONGO_URI);
console.log('✅ Connected to MongoDB');

const Session = mongoose.model(
  'Session',
  new mongoose.Schema({}, { strict: false }),
  'sessions'
);

// Fetch all sessions sorted oldest-first
const sessions = await Session.find({}).sort({ createdAt: 1 }).lean();
console.log(`📦 Total sessions: ${sessions.length}`);

const seenVisitors = new Set();
const bulkOps = [];

for (const session of sessions) {
  const visitorId = session.visitorId;
  if (!visitorId) continue;

  const isReturningVisitor = seenVisitors.has(visitorId);
  seenVisitors.add(visitorId);

  bulkOps.push({
    updateOne: {
      filter: { _id: session._id },
      update: { $set: { isReturningVisitor } },
    },
  });
}

if (bulkOps.length === 0) {
  console.log('⚠️  No sessions to update.');
} else {
  const result = await Session.bulkWrite(bulkOps);
  console.log(`✅ Updated ${result.modifiedCount} sessions`);

  const returningCount = bulkOps.filter(op => op.updateOne.update.$set.isReturningVisitor).length;
  const newCount = bulkOps.length - returningCount;
  console.log(`   → ${newCount} first-time visitors (isReturningVisitor: false)`);
  console.log(`   → ${returningCount} returning visitors (isReturningVisitor: true)`);
}

await mongoose.disconnect();
console.log('👋 Done.');
