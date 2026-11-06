import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProject extends Document {
  name: string;
  slug?: string;
  description: string;
  readme?: string;
  src: string;
  alt?: string;
  github?: string;
  liveLink?: string;
  screenshots?: string[];
  videos?: string[];
  tags?: string[];
  order?: number;
  createdAt: Date;
}

const ProjectSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Project description is required"],
      trim: true,
    },
    readme: {
      type: String,
      default: "",
    },
    src: {
      type: String,
      required: [true, "Project image URL is required"],
      trim: true,
    },
    alt: {
      type: String,
      default: "",
    },
    github: {
      type: String,
      default: "",
      trim: true,
    },
    liveLink: {
      type: String,
      default: "",
      trim: true,
    },
    screenshots: {
      type: [String],
      default: [],
    },
    videos: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
