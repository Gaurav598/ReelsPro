"use client";

import { motion } from "framer-motion";
import { Play, TrendingUp, Star, Award } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <div className="relative w-full overflow-hidden rounded-3xl glass-panel mb-12 border-0">
      {/* Background Gradient & Glows */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-primary)] via-transparent to-[var(--bg-secondary)] opacity-90 z-10" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-premium opacity-20 blur-[100px] z-0" />
      
      {/* Content */}
      <div className="relative z-20 px-8 py-16 md:py-24 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel border-[var(--accent-primary)]/30 text-[var(--accent-primary)] text-sm font-semibold mb-6">
            <Star className="w-4 h-4" />
            <span>Premium Creator Platform</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight">
            Discover, Share, and <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              Go Viral Globally.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-[var(--text-muted)] mb-8 max-w-2xl font-medium">
            Join thousands of creators producing high-quality short reels. 
            Upload your masterpiece today and reach millions.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link 
              href="/upload" 
              className="px-8 py-3.5 rounded-full bg-white text-black font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              <Play className="w-5 h-5 fill-current" />
              Start Uploading
            </Link>
            <Link 
              href="/explore" 
              className="px-8 py-3.5 rounded-full glass-panel text-white font-bold flex items-center gap-2 hover:bg-white/10 transition-colors"
            >
              <TrendingUp className="w-5 h-5" />
              Explore Trending
            </Link>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-12 pt-8 border-t border-[var(--glass-border)] flex gap-8 md:gap-16"
        >
          <div>
            <h4 className="text-3xl font-bold text-white mb-1">2M+</h4>
            <p className="text-sm text-[var(--text-muted)] font-medium">Active Creators</p>
          </div>
          <div>
            <h4 className="text-3xl font-bold text-white mb-1">50M+</h4>
            <p className="text-sm text-[var(--text-muted)] font-medium">Daily Views</p>
          </div>
          <div className="hidden sm:block">
            <h4 className="text-3xl font-bold text-white mb-1">Top #1</h4>
            <p className="text-sm text-[var(--text-muted)] font-medium flex items-center gap-1">
              <Award className="w-4 h-4" /> Rated Platform
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
