import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMedia extends Document {
  filename: string;
  contentType: string;
  data: Buffer;
  size: number;
  createdAt: Date;
}

const MediaSchema: Schema = new Schema(
  {
    filename: {
      type: String,
      required: true,
      trim: true,
    },
    contentType: {
      type: String,
      required: true,
      trim: true,
    },
    data: {
      type: Buffer,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Media: Model<IMedia> =
  mongoose.models.Media || mongoose.model<IMedia>("Media", MediaSchema);

export default Media;
