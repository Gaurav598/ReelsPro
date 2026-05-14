"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { PlaySquare, User, LogOut, Upload, Search, Bell, LogIn } from "lucide-react";
import { useNotification } from "./Notification";

export default function Header() {
  const { data: session } = useSession();
  const { showNotification } = useNotification();

  const handleSignOut = async () => {
    try {
      await signOut();
      showNotification("Signed out successfully", "success");
    } catch (error) {
      showNotification("Failed to sign out", "error");
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-x-0 border-t-0 border-b border-[var(--glass-border)]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Mobile Logo (Sidebar handles desktop logo) */}
          <div className="md:hidden flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-premium flex items-center justify-center">
                <PlaySquare className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">ReelsPro</span>
            </Link>
          </div>

          {/* Search Bar - Center */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] group-focus-within:text-[var(--accent-primary)] transition-colors" />
            <input 
              type="text" 
              placeholder="Search for videos, creators, or hashtags..."
              className="premium-input pl-11 py-2.5 rounded-full text-sm bg-black/20"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
              <kbd className="hidden lg:inline-flex items-center justify-center rounded border border-[var(--glass-border)] bg-black/40 px-1.5 font-mono text-[10px] font-medium text-[var(--text-muted)] opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
          </div>

          {/* Right Navigation */}
          <div className="flex items-center gap-3 md:gap-5">
            {session ? (
              <>
                <button className="p-2 rounded-full hover:bg-white/10 transition-colors relative hidden sm:block">
                  <Bell className="w-5 h-5 text-[var(--text-primary)]" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-black"></span>
                </button>

                <Link
                  href="/upload"
                  className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-premium hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all transform hover:-translate-y-0.5"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload</span>
                </Link>

                <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-circle avatar border border-[var(--glass-border)] hover:border-[var(--accent-primary)] transition-all overflow-hidden"
                  >
                    <div className="w-10 rounded-full bg-black/40">
                      <img
                        alt="User profile"
                        src={session.user?.image || "https://i.pravatar.cc/150?u=a042581f4e29026024d"}
                      />
                    </div>
                  </div>
                  
                  {/* Premium Dropdown Menu */}
                  <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content mt-3 z-[1] p-2 glass-panel rounded-xl w-56 shadow-2xl"
                  >
                    <li className="px-3 py-2 border-b border-[var(--glass-border)] mb-1">
                      <span className="text-xs text-[var(--text-muted)]">Signed in as</span>
                      <p className="text-sm font-medium truncate text-white">
                        {session.user?.email}
                      </p>
                    </li>
                    <li>
                      <Link href="/profile" className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg transition-colors">
                        <User className="w-4 h-4" />
                        <span className="font-medium">Profile</span>
                      </Link>
                    </li>
                    <li className="md:hidden">
                      <Link href="/upload" className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg transition-colors">
                        <Upload className="w-4 h-4" />
                        <span className="font-medium">Upload</span>
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="font-medium">Sign Out</span>
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md transition-all"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
