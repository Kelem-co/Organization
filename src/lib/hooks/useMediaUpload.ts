"use client";

import { useState } from "react";
import { createMediaClient, MediaCompleteResponse } from "@/lib/media/mediaClient";
import { tokenManager } from "@/lib/api/tokenManager";
import { appConfig } from "@/lib/api/config";

export function useMediaUpload() {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mediaClient = createMediaClient({
    baseUrl: appConfig.apiBaseUrl,
    getAuthHeaders: () => {
      const token = tokenManager.getAccessToken();
      return token ? { Authorization: `Bearer ${token}` } : {};
    },
  });

  async function upload(file: File): Promise<MediaCompleteResponse> {
    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      const result = await mediaClient.uploadFile({
        file,
        onProgress: ({ percentage }) => setProgress(percentage),
      });
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setError(message);
      throw err;
    } finally {
      setUploading(false);
    }
  }

  return {
    upload,
    uploading,
    progress,
    error,
  };
}
