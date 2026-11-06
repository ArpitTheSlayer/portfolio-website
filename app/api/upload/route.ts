import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Media from "@/models/Media";
import { isAuthenticated } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const auth = await isAuthenticated();
    if (!auth) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/svg+xml",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Only image files (PNG, JPG, WEBP, SVG, GIF) are allowed" },
        { status: 400 }
      );
    }

    // Limit to 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "Image file exceeds 10MB limit" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const media = await Media.create({
      filename: file.name || "upload.png",
      contentType: file.type,
      data: buffer,
      size: file.size,
    });

    return NextResponse.json({
      success: true,
      url: `/api/images/${media._id}`,
      id: media._id,
      filename: media.filename,
    });
  } catch (error: unknown) {
    console.error("Error uploading image:", error);
    const message = error instanceof Error ? error.message : "Failed to upload image";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
