"use client";

/**
 * VideoFeed.tsx — Videos ka grid display
 *
 * Props mein videos array aata hai, har video ko VideoComponent mein render karta hai.
 * Agar videos empty hai → beautiful empty state dikhata hai with CTA to upload.
 *
 * "stagger-children" class se videos ek-ek karke animate hote hain (slide-up effect)
 */

import { IVideo } from "@/models/Video";
import VideoComponent from "./VideoComponent";
import { Film, Upload } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface VideoFeedProps {
  videos: IVideo[];
}

export default function VideoFeed({ videos }: VideoFeedProps) {
  const { data: session } = useSession();

  // Empty state — jab koi video nahi hai
  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        {/* Animated icon */}
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 animate-float"
             style={{ background: "rgba(124, 58, 237, 0.1)", border: "1px solid rgba(124, 58, 237, 0.2)" }}>
          <Film className="w-10 h-10 text-purple-400/60" />
        </div>

        <h2 className="text-2xl font-bold text-white/80 mb-2">No videos yet</h2>
        <p className="text-white/40 text-center max-w-md mb-8">
          Be the first to share a video! Upload your reels, short clips, or creative content.
        </p>

        {session ? (
          <Link href="/upload" className="gradient-btn">
            <Upload className="w-4 h-4" />
            Upload First Video
          </Link>
        ) : (
          <Link href="/login" className="gradient-btn">
            Sign In to Upload
          </Link>
        )}
      </div>
    );
  }

  // Video grid — responsive columns
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 stagger-children">
      {videos.map((video) => (
        <VideoComponent key={video._id?.toString()} video={video} />
      ))}
    </div>
  );
}
