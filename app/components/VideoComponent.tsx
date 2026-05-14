"use client";

import { IVideo } from "@/models/Video";
import { Calendar, Trash2, Play } from "lucide-react";
import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useNotification } from "./Notification";
import { apiClient } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

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

  const formatDate = (date?: Date | string) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    });
  };

  const videoSrc = video.videoUrl.startsWith("http")
    ? video.videoUrl
    : `${process.env.NEXT_PUBLIC_URL_ENDPOINT}${video.videoUrl}`;

  const thumbnailSrc = video.thumbnailUrl
    ? (video.thumbnailUrl.startsWith("http")
      ? video.thumbnailUrl
      : `${process.env.NEXT_PUBLIC_URL_ENDPOINT}${video.thumbnailUrl}`)
    : undefined;

  // Handle hover to play preview
  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div className="cinematic-card group cursor-pointer" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {/* Video Container */}
      <div className="relative overflow-hidden bg-black" style={{ aspectRatio: "9/16" }}>
        <video
          ref={videoRef}
          src={videoSrc}
          poster={thumbnailSrc}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loop
          muted
          playsInline
          preload="metadata"
        />

        {/* Play Icon Overlay (Fades out on hover) */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:opacity-0 transition-opacity duration-300">
          <div className="w-12 h-12 rounded-full glass-panel flex items-center justify-center">
            <Play className="w-5 h-5 text-white ml-1" />
          </div>
        </div>

        {/* Action Buttons */}
        {session?.user?.id === video.userId?.toString() && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            disabled={isDeleting}
            className="absolute top-3 right-3 p-2.5 rounded-full glass-panel hover:bg-red-500/80 text-red-100 transition-all z-20 opacity-0 group-hover:opacity-100"
            title="Delete Video"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

        {/* Gradient overlay at bottom for text readability */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none" />
        
        {/* Absolute Bottom Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
          <h3 className="font-bold text-white text-base leading-tight mb-1 drop-shadow-md">
            {video.title}
          </h3>
          {video.description && (
            <p className="text-xs text-white/80 line-clamp-1 drop-shadow-sm">
              {video.description}
            </p>
          )}
        </div>
      </div>

      {/* Meta Bar below video */}
      <div className="px-4 py-3 bg-[var(--bg-secondary)] flex items-center justify-between border-t border-[var(--glass-border)]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-premium border border-[var(--glass-border)]" />
          <span className="text-xs font-medium text-[var(--text-primary)]">Creator</span>
        </div>
        {video.createdAt && (
          <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)]">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(video.createdAt)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
