import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMessage extends Document {
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

const MessageSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Message: Model<IMessage> =
  mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);

export default Message;
