import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Media from "@/models/Media";
import mongoose from "mongoose";

export async function GET(
  _req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return new NextResponse("Invalid image ID", { status: 400 });
    }

    await connectToDatabase();
    const media = await Media.findById(id);

    if (!media || !media.data) {
      return new NextResponse("Image not found", { status: 404 });
    }

    return new NextResponse(new Uint8Array(media.data), {
      headers: {
        "Content-Type": media.contentType || "image/png",
        "Content-Length": media.data.length.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error: unknown) {
    console.error("Error serving image:", error);
    return new NextResponse("Error serving image", { status: 500 });
  }
}
