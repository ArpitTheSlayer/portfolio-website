import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import { isAuthenticated } from "@/lib/auth";

export async function PUT(req: Request) {
  try {
    const auth = await isAuthenticated();
    if (!auth) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { items } = body;

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { success: false, error: "Items array is required" },
        { status: 400 }
      );
    }

    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { success: true, message: "Order updated locally (no MongoDB URI configured)" }
      );
    }

    await connectToDatabase();

    // Perform bulk or parallel updates for all items that have a valid _id
    const updatePromises = items
      .filter((item: { id?: string; order: number }) => item.id)
      .map((item: { id?: string; order: number }) =>
        Project.findByIdAndUpdate(item.id, { order: item.order })
      );

    await Promise.all(updatePromises);

    return NextResponse.json({
      success: true,
      message: "Projects order reordered successfully",
    });
  } catch (error: unknown) {
    console.error("Error reordering projects:", error);
    const message = error instanceof Error ? error.message : "Failed to reorder projects";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
