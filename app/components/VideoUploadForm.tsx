"use client";

/**
 * VideoUploadForm.tsx — Complete video upload form
 *
 * Yeh component user ko allow karta hai:
 * 1. Video ka title aur description enter karo
 * 2. Video file upload karo (ImageKit pe)
 * 3. Thumbnail image upload karo (ImageKit pe)
 * 4. Submit → backend API pe video data save hota hai MongoDB mein
 * 5. Success → home page pe redirect
 *
 * IMPORTANT: Video file aur thumbnail PEHLE ImageKit pe upload hote hain,
 * phir unke URLs ke saath baaki data MongoDB mein save hota hai.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import FileUpload from "./FileUpload";
import { useNotification } from "./Notification";
import { apiClient } from "@/lib/api-client";
import { Clapperboard, Type, AlignLeft, Film, ImageIcon, Loader2 } from "lucide-react";

export default function VideoUploadForm() {
  const router = useRouter();
  const { showNotification } = useNotification();

  // Form state — stores all the values user enters/uploads
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");         // URL from ImageKit after upload
  const [videoFileId, setVideoFileId] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");  // URL from ImageKit after upload
  const [thumbnailFileId, setThumbnailFileId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [thumbProgress, setThumbProgress] = useState(0);

  /**
   * Handle form submission
   * Sab fields fill hone ke baad, API call karke video save karo
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Page reload mat karo

    // Validation
    if (!title.trim()) {
      showNotification("Please enter a title", "warning");
      return;
    }
    if (!videoUrl) {
      showNotification("Please upload a video file", "warning");
      return;
    }

    setSubmitting(true);

    try {
      // API call to create video in database
      await apiClient.createVideo({
        title: title.trim(),
        description: description.trim() || undefined,
        videoUrl,
        videoFileId,
        thumbnailUrl: thumbnailUrl || undefined,
        thumbnailFileId: thumbnailFileId || undefined,
      });

      showNotification("Video published successfully! 🎉", "success");

      // Redirect to home page after short delay
      setTimeout(() => {
        router.push("/");
        router.refresh(); // Refresh to show the new video
      }, 1000);
    } catch (err: any) {
      console.error("Failed to publish video:", err);
      showNotification(err.message || "Failed to publish video", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title Input */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] mb-2">
          <Type className="w-4 h-4" />
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give your video a catchy title..."
          className="glass-input"
          maxLength={100}
          required
        />
      </div>

      {/* Description Textarea */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] mb-2">
          <AlignLeft className="w-4 h-4" />
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What's your video about?"
          className="glass-textarea"
          maxLength={500}
          rows={3}
        />
        <p className="text-xs text-[var(--text-primary)] opacity-25 mt-1 text-right">
          {description.length}/500
        </p>
      </div>

      {/* Video Upload */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] mb-2">
          <Film className="w-4 h-4" />
          Video File
        </label>
        <FileUpload
          fileType="video"
          onSuccess={(res) => {
            setVideoUrl(res.filePath);
            setVideoFileId(res.fileId); // Save fileId from ImageKit
            showNotification("Video uploaded!", "success");
          }}
          onProgress={setVideoProgress}
        />
      </div>

      {/* Thumbnail Upload */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] mb-2">
          <ImageIcon className="w-4 h-4" />
          Thumbnail Image
        </label>
        <FileUpload
          fileType="image"
          onSuccess={(res) => {
            setThumbnailUrl(res.filePath);
            setThumbnailFileId(res.fileId); // Save fileId from ImageKit
            showNotification("Thumbnail uploaded!", "success");
          }}
          onProgress={setThumbProgress}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting || !videoUrl}
        className="gradient-btn w-full !py-3 !text-base"
      >
        {submitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Publishing...
          </>
        ) : (
          <>
            <Clapperboard className="w-5 h-5" />
            Publish Video
          </>
        )}
      </button>

      {/* Help text */}
      <p className="text-xs text-[var(--text-primary)] opacity-25 text-center">
        Your video will be visible to everyone on the home page
      </p>
    </form>
  );
}
