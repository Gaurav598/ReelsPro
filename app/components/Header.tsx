"use client";

/**
 * Header.tsx — App ka Navigation Bar
 *
 * Yeh component har page ke top pe dikhta hai (kyunki layout.tsx mein hai).
 * Features:
 * - Brand logo with gradient text
 * - Upload button (sirf logged-in users ke liye)
 * - User dropdown menu (profile, logout)
 * - Login button (jab user logged in nahi hai)
 *
 * DaisyUI classes used: navbar, btn, btn-ghost, dropdown, dropdown-content, etc.
 */

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Home, User, Upload, LogOut, LogIn } from "lucide-react";
import { useNotification } from "./Notification";

export default function Header() {
  // useSession() — NextAuth ka hook, batata hai ki user logged in hai ya nahi
  const { data: session } = useSession();
  const { showNotification } = useNotification();

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: "/" });
      showNotification("Signed out successfully", "success");
    } catch {
      showNotification("Failed to sign out", "error");
    }
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-white/5"
         style={{ background: "rgba(10, 10, 26, 0.8)", backdropFilter: "blur(12px)" }}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Left side — Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                 style={{ background: "var(--gradient-primary)" }}>
              <Home className="w-4 h-4 text-white" />
            </div>
            <span className="gradient-text">ReelsPro</span>
          </Link>

          {/* Right side — Actions */}
          <div className="flex items-center gap-3">
            {session ? (
              <>
                {/* Upload Button — sirf logged-in users */}
                <Link
                  href="/upload"
                  className="gradient-btn !py-2 !px-4 !text-sm"
                >
                  <Upload className="w-4 h-4" />
                  <span className="hidden sm:inline">Upload</span>
                </Link>

                {/* User Dropdown */}
                <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer
                               border border-white/10 hover:border-purple-500/30 transition-colors"
                    style={{ background: "rgba(124, 58, 237, 0.15)" }}
                  >
                    <User className="w-4 h-4 text-purple-300" />
                  </div>

                  {/* Dropdown Menu */}
                  <ul
                    tabIndex={0}
                    className="dropdown-content z-[50] mt-3 p-2 w-56 rounded-xl shadow-2xl"
                    style={{
                      background: "rgba(20, 20, 50, 0.95)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {/* User email */}
                    <li className="px-3 py-2">
                      <span className="text-xs text-white/40">Signed in as</span>
                      <p className="text-sm text-white/80 truncate">
                        {session.user?.email}
                      </p>
                    </li>

                    <div className="border-t border-white/5 my-1"></div>

                    {/* Upload link */}
                    <li>
                      <Link
                        href="/upload"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/70
                                   hover:bg-white/5 hover:text-white transition-colors w-full"
                      >
                        <Upload className="w-4 h-4" />
                        Upload Video
                      </Link>
                    </li>

                    {/* Sign out */}
                    <li>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400/80
                                   hover:bg-red-500/10 hover:text-red-400 transition-colors w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              /* Not logged in — Show Login button */
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                           border border-white/10 hover:border-purple-500/30 hover:bg-white/5
                           text-white/70 hover:text-white transition-all"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
            )}
            
            {/* Theme Toggle Button (Moon/Sun) */}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}

// Simple Theme Toggle Component
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Next-themes hydration fix
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9 rounded-full border border-base-content/10"></div>;
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-colors
                 border border-base-content/10 hover:border-purple-500/30 hover:bg-base-content/5"
      title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-yellow-400" />
      ) : (
        <Moon className="w-4 h-4 text-purple-600" />
      )}
    </button>
  );
}
