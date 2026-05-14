"use client";

import { IVideo } from "@/models/Video";
import VideoComponent from "./VideoComponent";
import { Film, Upload } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

interface VideoFeedProps {
  videos: IVideo[];
}

export default function VideoFeed({ videos }: VideoFeedProps) {
  const { data: session } = useSession();

  // Container variants for staggered child animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  // Empty state — jab koi video nahi hai
  if (videos.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-24 glass-panel rounded-3xl"
      >
        <div className="w-24 h-24 rounded-full bg-gradient-premium flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(139,92,246,0.3)]">
          <Film className="w-12 h-12 text-white" />
        </div>

        <h2 className="text-3xl font-bold text-white mb-3">No videos yet</h2>
        <p className="text-[var(--text-muted)] text-center max-w-md mb-8 text-lg">
          Be the first to share a video! Upload your reels, short clips, or creative content.
        </p>

        {session ? (
          <Link href="/upload" className="px-8 py-3.5 rounded-full bg-white text-black font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            <Upload className="w-5 h-5" />
            Upload First Video
          </Link>
        ) : (
          <Link href="/login" className="px-8 py-3.5 rounded-full bg-gradient-premium text-white font-bold hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all">
            Sign In to Upload
          </Link>
        )}
      </motion.div>
    );
  }

  // Premium Masonry Video Grid
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
    >
      {videos.map((video) => (
        <motion.div key={video._id?.toString()} variants={itemVariants} className="break-inside-avoid">
          <VideoComponent video={video} />
        </motion.div>
      ))}
    </motion.div>
  );
}
