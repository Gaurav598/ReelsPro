/**
 * Home Page (/) — Main landing page
 *
 * Yeh ek SERVER COMPONENT hai (kyunki "use client" nahi likha).
 *
 * IMPORTANT: `dynamic = "force-dynamic"` ka matlab hai ki yeh page
 * HAR REQUEST pe fresh render hoga (build time pe nahi).
 * Kyunki: MongoDB connection build time pe available nahi hota (deploy ke waqt),
 * isliye runtime pe hi fetch karna padta hai.
 *
 * Flow:
 * 1. User page open karta hai → Server pe request aati hai
 * 2. Server MongoDB se videos fetch karta hai
 * 3. Ready-made HTML browser ko bhejta hai
 */

import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";
import VideoFeed from "./components/VideoFeed";

// Force this page to render on EVERY request (not cached at build time)
// "force-dynamic" = SSR (Server-Side Rendering) on each request
export const dynamic = "force-dynamic";

export default async function Home() {
  let serializedVideos = [];

  try {
    await connectToDatabase();
    const videos = await Video.find({}).sort({ createdAt: -1 }).lean();

    // Serialize — MongoDB ObjectId aur Date ko JSON-safe strings mein convert karo
    serializedVideos = JSON.parse(JSON.stringify(videos));
  } catch (error) {
    console.error("Failed to fetch videos:", error);
    // If DB connection fails, show empty state (better than crashing!)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page heading */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold gradient-text mb-2">
          Discover Videos
        </h1>
        <p className="text-white/40">
          Watch, share, and upload amazing short videos
        </p>
      </div>

      {/* Video grid or empty state */}
      <VideoFeed videos={serializedVideos} />
    </div>
  );
}
