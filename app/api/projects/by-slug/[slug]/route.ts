import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import { defaultProjects } from "@/lib/defaultProjects";
import { slugify } from "@/lib/slug";
import mongoose from "mongoose";

export async function GET(
  _req: Request,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await props.params;

    if (!slug) {
      return NextResponse.json({ success: false, error: "Slug is required" }, { status: 400 });
    }

    // First try finding in MongoDB if configured
    if (process.env.MONGODB_URI) {
      try {
        await connectToDatabase();
        const queries: Array<Record<string, unknown>> = [{ slug }];

        if (mongoose.Types.ObjectId.isValid(slug)) {
          queries.push({ _id: slug });
        }

        const project = await Project.findOne({ $or: queries });
        if (project) {
          return NextResponse.json({ success: true, project });
        }
      } catch (dbErr) {
        console.warn("Database lookup failed, falling back to default projects:", dbErr);
      }
    }

    // Fallback search in defaultProjects
    const fallbackProject = defaultProjects.find(
      (p) =>
        p.slug === slug ||
        p._id === slug ||
        slugify(p.name) === slug ||
        p.name.toLowerCase() === slug.toLowerCase()
    );

    if (fallbackProject) {
      return NextResponse.json({ success: true, project: fallbackProject, source: "default" });
    }

    return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
  } catch (error: unknown) {
    console.error("Error finding project by slug:", error);
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
