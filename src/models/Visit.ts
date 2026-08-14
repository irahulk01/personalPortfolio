import mongoose from 'mongoose';

export interface IVisit extends mongoose.Document {
  _id: string | any;
  count: number;
  updatedAt: Date;
}

const VisitSchema = new mongoose.Schema<IVisit>({
  _id: { type: String, default: "portfolio_visits" },
  count: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Visit || mongoose.model<IVisit>("Visit", VisitSchema, "visits");
