import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./components/Providers";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

/**
 * Font Loading — Next.js automatically downloads and hosts these fonts
 * Variable fonts allow using --font-geist-sans / --font-geist-mono in CSS
 *
 * Geist = Vercel ka official font (clean, modern look)
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Metadata — SEO ke liye important
 * Yeh title aur description browser tab aur Google search results mein dikhta hai
 */
export const metadata: Metadata = {
  title: "ReelsPro — Share & Discover Short Videos",
  description:
    "Upload, share, and discover amazing short videos. Built with Next.js, ImageKit, and MongoDB.",
};

/**
 * RootLayout — SABHI pages ka wrapper
 *
 * Yeh component har page ke around same structure maintain karta hai:
 * <html> → <body> → <Providers> → <Header> + page content
 *
 * data-theme="dark" → DaisyUI ko bolta hai dark theme use karo
 * (DaisyUI ke sabhi components — btn, card, navbar etc. — dark colors use karenge)
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
              <Header />
              <main className="flex-1">{children}</main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
