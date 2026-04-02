"use client";

/**
 * Upload Page (/upload)
 *
 * Protected page — sirf logged-in users ke liye.
 * useSession() se check karte hain ki user logged in hai ya nahi.
 *
 * Agar logged in nahi hai → login page pe redirect
 * Agar logged in hai → VideoUploadForm dikhao
 */

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import VideoUploadForm from "../components/VideoUploadForm";
import { Clapperboard, Loader2 } from "lucide-react";

export default function VideoUploadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Loading state jab session check ho raha hai
  if (status === "loading") {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    );
  }

  // Not logged in
  if (!session) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-xl mx-auto">
        {/* Page Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(124, 58, 237, 0.15)", border: "1px solid rgba(124, 58, 237, 0.2)" }}
            >
              <Clapperboard className="w-5 h-5 text-purple-400" />
            </div>
            <h1 className="text-2xl font-bold gradient-text">Upload New Reel</h1>
          </div>
          <p className="text-white/40 text-sm ml-[52px]">
            Share your video with the world
          </p>
        </div>

        {/* Upload Form in a glass card */}
        <div className="glass-card p-6 animate-slide-up">
          <VideoUploadForm />
        </div>
      </div>
    </div>
  );
}
