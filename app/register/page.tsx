"use client";

/**
 * Register Page (/register)
 *
 * 2 tarike se account bana sakte ho:
 * 1. Google/GitHub — One-click sign up (auto-register + login in one step!)
 * 2. Email + Password — Manual registration, phir separately login karo
 *
 * OAuth ke case mein: signIn("google") call karoge → Google pe redirect hoga
 * → wapas aane pe NextAuth automatically user create kar dega (signIn callback mein)
 * → Seedha login ho jaayega, alag se register karne ki zaroorat nahi!
 */

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Link from "next/link";
import { Mail, Lock, UserPlus, Loader2, Eye, EyeOff, ShieldCheck } from "lucide-react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const router = useRouter();

  const passwordsMatch = password === confirmPassword;
  const passwordLongEnough = password.length >= 6;

  // Email + Password registration
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!passwordLongEnough) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (!passwordsMatch) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // OAuth signup (Google / GitHub) — same as login, auto-registers!
  const handleSocialLogin = (provider: string) => {
    setSocialLoading(provider);
    signIn(provider, { callbackUrl: "/" });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="glass-card p-8 w-full max-w-md animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Create Account</h1>
          <p className="text-[var(--text-muted)] text-sm">Join ReelsPro and start sharing videos</p>
        </div>

        {/* ========== SOCIAL SIGNUP BUTTONS ========== */}
        <div className="space-y-3 mb-6">
          {/* Google Button */}
          <button
            onClick={() => handleSocialLogin("google")}
            disabled={socialLoading !== null}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl
                       border-2 border-[var(--glass-border)] hover:bg-[var(--accent-purple)] hover:text-black
                       transition-all duration-150 text-[var(--text-primary)] opacity-80 font-bold text-sm
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {socialLoading === "google" ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            Continue with Google
          </button>

          {/* GitHub Button */}
          <button
            onClick={() => handleSocialLogin("github")}
            disabled={socialLoading !== null}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl
                       border-2 border-[var(--glass-border)] hover:bg-[var(--accent-purple)] hover:text-black
                       transition-all duration-150 text-[var(--text-primary)] opacity-80 font-bold text-sm
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {socialLoading === "github" ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            )}
            Continue with GitHub
          </button>
        </div>

        {/* ========== DIVIDER ========== */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="text-xs text-[var(--text-primary)] opacity-30 uppercase tracking-wider">or register with email</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        {/* ========== CREDENTIALS FORM ========== */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)] opacity-60 mb-2">
              <Mail className="w-4 h-4" />
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="glass-input"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)] opacity-60 mb-2">
              <Lock className="w-4 h-4" />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="glass-input !pr-10"
                required
                minLength={6}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-primary)] opacity-30 hover:text-[var(--text-primary)] opacity-60 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {password && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: password.length >= 10 ? "100%" : password.length >= 6 ? "60%" : "30%",
                      background: password.length >= 10 ? "#22c55e" : password.length >= 6 ? "#eab308" : "#ef4444",
                    }}
                  />
                </div>
                <span className="text-xs text-[var(--text-primary)] opacity-30">
                  {password.length >= 10 ? "Strong" : password.length >= 6 ? "Good" : "Weak"}
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)] opacity-60 mb-2">
              <ShieldCheck className="w-4 h-4" />
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              className="glass-input"
              required
              autoComplete="new-password"
            />
            {confirmPassword && (
              <p className={`text-xs mt-2 ${passwordsMatch ? "text-green-400" : "text-red-400"}`}>
                {passwordsMatch ? "✓ Passwords match" : "✗ Passwords don't match"}
              </p>
            )}
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 animate-fade-in">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !passwordsMatch || !passwordLongEnough}
            className="gradient-btn w-full !py-3"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Create Account
              </>
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-[var(--text-muted)]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
