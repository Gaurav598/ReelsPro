"use client";

/**
 * VideoComponent.tsx — Ek single video ka card
 *
 * Har video ek card mein dikhta hai jisme:
 * - Video player (ImageKit se stream hota hai)
 * - Title
 * - Description
 * - Upload date
 *
 * "use client" kyunki video player browser mein render hota hai (server pe nahi)
 */

import { IVideo } from "@/models/Video";
import { Calendar, Trash2 } from "lucide-react";
import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useNotification } from "./Notification";
import { apiClient } from "@/lib/api-client";
import { useRouter } from "next/navigation";

export default function VideoComponent({ video }: { video: IVideo }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { data: session } = useSession();
  const { showNotification } = useNotification();
  const router = useRouter();
  
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this video?")) return;
    
    setIsDeleting(true);
    try {
      if (video._id) {
        await apiClient.deleteVideo(video._id.toString());
        showNotification("Video deleted successfully", "success");
        router.refresh();
      }
    } catch (error) {
      showNotification("Failed to delete video", "error");
      setIsDeleting(false);
    }
  };

  // Format date — "2 Apr 2026" style
  const formatDate = (date?: Date | string) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Build ImageKit URL from video path
  const videoSrc = video.videoUrl.startsWith("http")
    ? video.videoUrl
    : `${process.env.NEXT_PUBLIC_URL_ENDPOINT}${video.videoUrl}`;

  const thumbnailSrc = video.thumbnailUrl
    ? (video.thumbnailUrl.startsWith("http")
      ? video.thumbnailUrl
      : `${process.env.NEXT_PUBLIC_URL_ENDPOINT}${video.thumbnailUrl}`)
    : undefined;

  return (
    <div className="video-card animate-fade-in">
      {/* Video Container */}
      <div
        className="relative group"
        style={{ aspectRatio: "9/16" }}
      >
        <video
          ref={videoRef}
          src={videoSrc}
          poster={thumbnailSrc}
          className="w-full h-full object-cover"
          loop
          controls // Added native html5 controls per request (speed, mute/unmute, fullscreen)
          playsInline
          preload="metadata"
        />

        {/* Delete Button (Only visible if owner) */}
        {session?.user?.id === video.userId?.toString() && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/60 shadow-lg border border-white/10
                       text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all z-10"
            title="Delete Video"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

        {/* Gradient overlay at bottom for text readability */}
        <div className="absolute bottom-0 left-0 right-0 h-24
                        bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
      </div>

      {/* Video Info */}
      <div className="p-4">
        <h3 className="font-semibold text-[var(--text-primary)] text-sm line-clamp-1 mb-1">
          {video.title}
        </h3>
        
        {video.description && (
          <p className="text-xs text-[var(--text-muted)] line-clamp-2 mb-2">
            {video.description}
          </p>
        )}

        {video.createdAt && (
          <div className="flex items-center gap-1 text-xs text-[var(--text-muted)] mt-2">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(video.createdAt)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
