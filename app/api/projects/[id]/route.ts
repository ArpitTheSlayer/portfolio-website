import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import { isAuthenticated } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const auth = await isAuthenticated();
    if (!auth) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    await connectToDatabase();
    if (body.tags && typeof body.tags === "string") {
      body.tags = body.tags.split(",").map((t: string) => t.trim()).filter(Boolean);
    }
    if (body.screenshots && typeof body.screenshots === "string") {
      body.screenshots = body.screenshots.split(",").map((t: string) => t.trim()).filter(Boolean);
    }
    if (body.videos && typeof body.videos === "string") {
      body.videos = body.videos.split(",").map((t: string) => t.trim()).filter(Boolean);
    }
    if (body.name && !body.slug) {
      const { slugify } = await import("@/lib/slug");
      body.slug = slugify(body.name);
    }

    const updated = await Project.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, project: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update project";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const auth = await isAuthenticated();
    if (!auth) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectToDatabase();

    const deleted = await Project.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Project deleted successfully" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete project";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
