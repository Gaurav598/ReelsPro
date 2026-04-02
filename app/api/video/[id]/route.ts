import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // In Next.js 15+ App Router, params is a promise
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const { id } = await params;

    // Find the video
    const video = await Video.findById(id);

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Check ownership
    if (video.userId?.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "You are not authorized to delete this video" },
        { status: 403 }
      );
    }

    // Delete files from ImageKit
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    if (privateKey) {
      const basicAuth = Buffer.from(privateKey + ":").toString("base64");

      const deleteImageKitFile = async (fileId: string) => {
        try {
          const res = await fetch(`https://api.imagekit.io/v1/files/${fileId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Basic ${basicAuth}`,
            },
          });
          if (!res.ok) console.warn(`Failed to delete ImageKit file ${fileId}`);
        } catch (e) {
          console.warn(`Error deleting ImageKit file:`, e);
        }
      };

      if (video.videoFileId) await deleteImageKitFile(video.videoFileId);
      if (video.thumbnailFileId) await deleteImageKitFile(video.thumbnailFileId);
    }

    // Delete from Database
    await Video.findByIdAndDelete(id);

    return NextResponse.json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete video" },
      { status: 500 }
    );
  }
}
