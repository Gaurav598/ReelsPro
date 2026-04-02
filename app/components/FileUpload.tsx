"use client";

/**
 * FileUpload.tsx — ImageKit pe file upload karne ka component
 *
 * FLOW kaise kaam karta hai:
 * 1. User file select karta hai (ya drag-drop)
 * 2. Frontend → /api/auth/imagekit-auth call karti hai → auth credentials milte hain
 * 3. Frontend → DIRECTLY ImageKit server pe file upload karti hai (using those credentials)
 * 4. ImageKit → response mein file ka URL bhejta hai
 * 5. onSuccess callback parent component ko URL pass karta hai
 *
 * Yeh pattern "server-to-client upload" kehlata hai — file backend se nahi guzarti,
 * seedha client → ImageKit jaati hai (fast + efficient!)
 */

import { upload } from "@imagekit/next";
import { useState, useRef } from "react";
import { Upload, X, FileVideo, ImageIcon, CheckCircle } from "lucide-react";

interface FileUploadProps {
  onSuccess: (res: any) => void;
  onProgress?: (progress: number) => void;
  fileType?: "image" | "video";
}

const FileUpload = ({ onSuccess, onProgress, fileType = "image" }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File validation — check type and size before upload
  const validateFile = (file: File): boolean => {
    setError(null);

    if (fileType === "video" && !file.type.startsWith("video/")) {
      setError("Please upload a valid video file (MP4, WebM, etc.)");
      return false;
    }

    if (fileType === "image" && !file.type.startsWith("image/")) {
      setError("Please upload a valid image file (JPG, PNG, etc.)");
      return false;
    }

    // Max 100MB for videos, 10MB for images
    const maxSize = fileType === "video" ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError(`File size must be less than ${fileType === "video" ? "100" : "10"} MB`);
      return false;
    }

    return true;
  };

  // Main upload function
  const handleUpload = async (file: File) => {
    if (!validateFile(file)) return;

    setUploading(true);
    setProgress(0);
    setError(null);
    setFileName(file.name);
    setUploadComplete(false);

    try {
      // Step 1: Get auth credentials from our backend
      const authRes = await fetch("/api/auth/imagekit-auth");
      if (!authRes.ok) throw new Error("Failed to get upload credentials");
      const auth = await authRes.json();

      // Step 2: Upload directly to ImageKit
      const res = await upload({
        file,
        fileName: file.name,
        publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
        signature: auth.signature,
        expire: auth.expire,
        token: auth.token,
        onProgress: (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setProgress(percent);
            onProgress?.(percent);
          }
        },
      });

      // Step 3: Success! Pass result to parent component
      setUploadComplete(true);
      onSuccess(res);
    } catch (err: any) {
      console.error("Upload failed:", err);
      setError(err.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  // Reset to upload a new file
  const handleReset = () => {
    setFileName(null);
    setProgress(0);
    setUploadComplete(false);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const Icon = fileType === "video" ? FileVideo : ImageIcon;

  return (
    <div className="w-full">
      {/* Hidden file input — triggered by clicking the upload zone */}
      <input
        ref={fileInputRef}
        type="file"
        accept={fileType === "video" ? "video/*" : "image/*"}
        onChange={handleFileChange}
        className="hidden"
        id={`file-upload-${fileType}`}
      />

      {/* Upload complete state */}
      {uploadComplete && fileName ? (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
          <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
          <span className="text-sm text-green-300 truncate flex-1">{fileName}</span>
          <button
            type="button"
            onClick={handleReset}
            className="text-green-400/60 hover:text-green-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : uploading ? (
        /* Uploading state — show progress bar */
        <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Upload className="w-4 h-4 text-purple-400 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white/80 truncate">{fileName}</p>
              <p className="text-xs text-white/40">Uploading... {progress}%</p>
            </div>
          </div>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      ) : (
        /* Default state — drag & drop zone */
        <div
          className={`upload-zone ${dragging ? "dragging" : ""}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Icon className="w-10 h-10 mx-auto mb-3 text-purple-400/60" />
          <p className="text-sm text-white/60 mb-1">
            {dragging ? "Drop your file here!" : "Click or drag & drop to upload"}
          </p>
          <p className="text-xs text-white/30">
            {fileType === "video"
              ? "MP4, WebM, MOV — max 100MB"
              : "JPG, PNG, WebP — max 10MB"}
          </p>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
