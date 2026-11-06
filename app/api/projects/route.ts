import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import { isAuthenticated } from "@/lib/auth";
import { defaultProjects } from "@/lib/defaultProjects";

export async function GET() {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({
        success: true,
        source: "fallback",
        projects: defaultProjects,
      });
    }

    await connectToDatabase();
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });

    if (!projects || projects.length === 0) {
      return NextResponse.json({
        success: true,
        source: "default",
        projects: defaultProjects,
      });
    }

    return NextResponse.json({
      success: true,
      source: "database",
      projects,
    });
  } catch (error: unknown) {
    console.error("Error fetching projects:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch projects";
    return NextResponse.json({
      success: true,
      source: "fallback_on_error",
      projects: defaultProjects,
      error: message,
    });
  }
}

export async function POST(req: Request) {
  try {
    const auth = await isAuthenticated();
    if (!auth) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, slug, description, readme, src, alt, github, liveLink, screenshots, videos, tags, order } = body;

    if (!name || !description || !src) {
      return NextResponse.json(
        { success: false, error: "Project name, description, and image URL are required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const { slugify } = await import("@/lib/slug");
    const finalSlug = slug ? slugify(slug) : slugify(name);

    const project = await Project.create({
      name,
      slug: finalSlug,
      description,
      readme: readme || "",
      src,
      alt: alt || `${name} screenshot`,
      github: github || "",
      liveLink: liveLink || "",
      screenshots: Array.isArray(screenshots)
        ? screenshots
        : typeof screenshots === "string"
        ? screenshots.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      videos: Array.isArray(videos)
        ? videos
        : typeof videos === "string"
        ? videos.split(",").map((v) => v.trim()).filter(Boolean)
        : [],
      tags: Array.isArray(tags)
        ? tags
        : typeof tags === "string"
        ? tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
      order: typeof order === "number" ? order : 0,
    });

    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating project:", error);
    const message = error instanceof Error ? error.message : "Failed to create project";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
