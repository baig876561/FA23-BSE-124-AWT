import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const filename = searchParams.get("file");

  if (!filename) {
    return new NextResponse("Filename required", { status: 400 });
  }

  // Sanitize to prevent path traversal
  const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "");
  const uploadDir = join(process.cwd(), "public", "uploads");
  const filepath = join(uploadDir, safeFilename);

  try {
    const fileBuffer = await readFile(filepath);
    
    // Determine basic mime type
    let contentType = "image/jpeg";
    if (safeFilename.endsWith(".png")) contentType = "image/png";
    if (safeFilename.endsWith(".webp")) contentType = "image/webp";
    if (safeFilename.endsWith(".gif")) contentType = "image/gif";

    return new NextResponse(fileBuffer, {
       headers: {
         "Content-Type": contentType,
         "Cache-Control": "public, max-age=3600"
       }
    });
  } catch (error) {
    // If cache mapping fails, send a robust 404
    return new NextResponse("Media not found on disk cache.", { status: 404 });
  }
}
