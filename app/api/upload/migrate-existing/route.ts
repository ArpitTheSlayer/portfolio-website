import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { connectToDatabase } from "@/lib/mongodb";
import Media from "@/models/Media";
import Project from "@/models/Project";
import { isAuthenticated } from "@/lib/auth";

export async function POST() {
  try {
    const auth = await isAuthenticated();
    if (!auth) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const imagesDir = path.join(process.cwd(), "assets", "images", "project-images");
    if (!fs.existsSync(imagesDir)) {
      return NextResponse.json({ success: false, error: "Project images directory not found" }, { status: 404 });
    }

    const files = fs.readdirSync(imagesDir);
    const results: Array<{ filename: string; mediaId: string; url: string }> = [];

    for (const file of files) {
      const filePath = path.join(imagesDir, file);
      const stat = fs.statSync(filePath);
      if (!stat.isFile()) continue;

      // Check if already in Media collection
      let media = await Media.findOne({ filename: file });
      if (!media) {
        const data = fs.readFileSync(filePath);
        const ext = path.extname(file).toLowerCase();
        const contentType =
          ext === ".png"
            ? "image/png"
            : ext === ".jpg" || ext === ".jpeg"
            ? "image/jpeg"
            : ext === ".webp"
            ? "image/webp"
            : ext === ".svg"
            ? "image/svg+xml"
            : "application/octet-stream";

        media = await Media.create({
          filename: file,
          contentType,
          data,
          size: stat.size,
        });
      }

      const mediaUrl = `/api/images/${media._id}`;
      results.push({
        filename: file,
        mediaId: media._id.toString(),
        url: mediaUrl,
      });

      // Update any existing Project in database that referenced this image by name
      const baseName = path.parse(file).name;
      await Project.updateMany(
        {
          $or: [
            { src: { $regex: file, $options: "i" } },
            { src: { $regex: baseName, $options: "i" } },
          ],
        },
        { $set: { src: mediaUrl } }
      );
    }

    return NextResponse.json({
      success: true,
      migratedCount: results.length,
      images: results,
      message: `Successfully processed ${results.length} images into database`,
    });
  } catch (error: unknown) {
    console.error("Migration error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Migration failed" },
      { status: 500 }
    );
  }
}
