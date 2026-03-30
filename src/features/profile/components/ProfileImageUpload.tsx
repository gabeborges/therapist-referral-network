"use client";

import { useState, useRef } from "react";

interface ProfileImageUploadProps {
  currentImageUrl: string | null;
  onUploadComplete: (url: string) => void;
  error?: string;
}

export function ProfileImageUpload({
  currentImageUrl,
  onUploadComplete,
  error,
}: ProfileImageUploadProps): React.ReactElement {
  const [preview, setPreview] = useState<string | null>(currentImageUrl);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validation
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setUploadError("Use JPEG, PNG, or WebP format.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image must be under 5MB.");
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    // Upload
    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload-profile-image", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }

      const { url } = await res.json();
      onUploadComplete(url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
      setPreview(currentImageUrl);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2">
        Profile Photo
      </label>
      <div className="flex items-center gap-4">
        {/* Avatar preview */}
        <div className="w-20 h-20 rounded-full bg-s1 border border-border overflow-hidden flex items-center justify-center shrink-0">
          {preview ? (
            <img
              src={preview}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-fg-4">
              <path
                d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z"
                fill="currentColor"
              />
            </svg>
          )}
        </div>

        <div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="h-9 px-4 text-[0.8125rem] font-medium rounded-sm border border-border bg-s1 text-fg hover:bg-s2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {uploading ? "Uploading..." : preview ? "Change Photo" : "Upload Photo"}
          </button>
          <p className="mt-1 text-[0.75rem] text-fg-4">
            JPEG, PNG, or WebP. Max 5MB.
          </p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Upload profile photo"
        />
      </div>

      {(uploadError || error) && (
        <p className="mt-2 text-[0.75rem] text-err">{uploadError || error}</p>
      )}
    </div>
  );
}
