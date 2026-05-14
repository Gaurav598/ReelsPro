"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, TrendingUp, Compass, PlaySquare, Bookmark, BarChart2, Settings, LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const SIDEBAR_LINKS = [
  { name: "Home", href: "/", icon: Home },
  { name: "Trending", href: "/trending", icon: TrendingUp },
  { name: "Explore", href: "/explore", icon: Compass },
  { name: "Following", href: "/following", icon: PlaySquare },
  { name: "Saved", href: "/saved", icon: Bookmark },
  { name: "Analytics", href: "/analytics", icon: BarChart2 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <motion.aside
      animate={{ width: isExpanded ? 240 : 80 }}
      className="hidden md:flex flex-col sticky top-0 h-screen glass-panel border-r border-t-0 border-l-0 border-b-0 z-40 transition-all duration-300"
    >
      <div className="flex items-center p-4 justify-between">
        {isExpanded && (
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-premium flex items-center justify-center">
              <PlaySquare className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">ReelsPro</span>
          </Link>
        )}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors text-[var(--text-muted)]"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
        {SIDEBAR_LINKS.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          
          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex items-center gap-4 px-3 py-3 rounded-xl transition-all relative overflow-hidden group",
                isActive ? "text-white" : "text-[var(--text-muted)] hover:text-white"
              )}
              title={!isExpanded ? link.name : ""}
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav"
                  className="absolute inset-0 bg-white/10"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              <Icon className={cn("w-5 h-5 relative z-10", isActive && "text-[var(--accent-primary)]")} />
              
              {isExpanded && (
                <span className="relative z-10 font-medium tracking-wide">
                  {link.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      
      {/* Mini Profile Section at Bottom */}
      <div className="p-4 border-t border-[var(--glass-border)]">
        <button className="flex items-center gap-4 px-3 py-2 w-full rounded-xl hover:bg-white/5 text-[var(--text-muted)] hover:text-white transition-colors">
          <LogOut className="w-5 h-5" />
          {isExpanded && <span className="font-medium tracking-wide">Log Out</span>}
        </button>
      </div>
    </motion.aside>
  );
}
