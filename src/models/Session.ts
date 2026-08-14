import mongoose, { Schema, Document } from 'mongoose';

export interface ISession extends Document {
  sessionId: string;
  visitorId: string;
  totalDurationSeconds: number;
  topPage: string;
  pageBreakdown: Record<string, number>;
  downloadedResume: boolean;
  ip?: string;
  location?: string;
  deviceType?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema = new Schema<ISession>(
  {
    sessionId: { type: String, required: true, unique: true },
    visitorId: { type: String, required: true },
    totalDurationSeconds: { type: Number, default: 0 },
    topPage: { type: String, default: '/' },
    pageBreakdown: { type: Schema.Types.Mixed, default: {} },
    downloadedResume: { type: Boolean, default: false },
    ip: { type: String },
    location: { type: String },
    deviceType: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Session || mongoose.model<ISession>('Session', SessionSchema, 'sessions');
