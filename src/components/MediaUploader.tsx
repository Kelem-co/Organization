"use client";

import Image from "next/image";
import { useMediaUpload } from "@/lib/hooks/useMediaUpload";
import { resolveMediaUrl } from "@/lib/media/resolveMediaUrl";
import { Upload, X, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type MediaUploaderState = {
  hasChanges: boolean;
  mediaId: string | null;
  pendingRemovalIds: string[];
};

type MediaUploaderProps = {
  accept?: string;
  imageOnly?: boolean;
  onUploaded: (mediaId: string) => void;
  onRemoved?: () => void;
  onStateChange?: (state: MediaUploaderState) => void;
  onBusyChange?: (busy: boolean) => void;
  label?: string;
  description?: string;
  initialMediaId?: string | null;
};

export function MediaUploader({
  accept,
  imageOnly = false,
  onUploaded,
  onRemoved,
  onStateChange,
  onBusyChange,
  label = "Upload File",
  description = "Click or drag file here",
  initialMediaId = null,
}: MediaUploaderProps) {
  const { upload, remove, uploading, removing, progress, error } = useMediaUpload();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedMediaId, setUploadedMediaId] = useState<string | null | undefined>(undefined);
  const [pendingRemovalIds, setPendingRemovalIds] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentMediaId = uploadedMediaId === undefined ? initialMediaId : uploadedMediaId;

  useEffect(() => {
    onBusyChange?.(uploading || removing);
  }, [onBusyChange, removing, uploading]);

  useEffect(() => {
    onStateChange?.({
      hasChanges: uploadedMediaId !== undefined || pendingRemovalIds.length > 0,
      mediaId: currentMediaId ?? null,
      pendingRemovalIds,
    });
  }, [currentMediaId, onStateChange, pendingRemovalIds, uploadedMediaId]);

  useEffect(() => {
    let cancelled = false;

    if (!currentMediaId) {
      Promise.resolve().then(() => {
        if (!cancelled) {
          setPreview(null);
        }
      });
      return;
    }

    resolveMediaUrl(currentMediaId)
      .then((url) => {
        if (!cancelled) {
          setPreview(url);
        }
      })
      .catch((error) => {
        console.error("Failed to load media preview:", error);
      });

    return () => {
      cancelled = true;
    };
  }, [currentMediaId]);

  const clearSelectedFile = () => {
    setFile(null);
    setPreview(null);
    setUploadedMediaId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (imageOnly && !selectedFile.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }

    setFile(selectedFile);

    // Create preview for images
    if (selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }

    const previousMediaId = currentMediaId;

    try {
      const result = await upload(selectedFile);

      if (previousMediaId && previousMediaId !== result.id) {
        if (previousMediaId === initialMediaId) {
          setPendingRemovalIds((currentIds) => (
            currentIds.includes(previousMediaId)
              ? currentIds
              : [...currentIds, previousMediaId]
          ));
        } else {
          try {
            await remove(previousMediaId);
          } catch (removeError) {
            console.error("Remove failed:", removeError);
          }
        }
      }

      setUploadedMediaId(result.id);
      onUploaded(result.id);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      
      if (imageOnly && !droppedFile.type.startsWith("image/")) {
        alert("Please upload an image file.");
        return;
      }

      // Trigger the file input change
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(droppedFile);
      if (fileInputRef.current) {
        fileInputRef.current.files = dataTransfer.files;
        fileInputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  };

  const removeFile = async () => {
    const mediaIdToRemove = currentMediaId;
    const previousFile = file;
    const previousPreview = preview;
    const previousPendingRemovalIds = pendingRemovalIds;

    clearSelectedFile();
    onRemoved?.();

    if (!mediaIdToRemove) {
      return;
    }

    try {
      if (mediaIdToRemove === initialMediaId) {
        setPendingRemovalIds((currentIds) => (
          currentIds.includes(mediaIdToRemove)
            ? currentIds
            : [...currentIds, mediaIdToRemove]
        ));
        return;
      }

      await remove(mediaIdToRemove);
    } catch (err) {
      console.error("Remove failed:", err);
      setFile(previousFile);
      setPreview(previousPreview);
      setUploadedMediaId(mediaIdToRemove);
      setPendingRemovalIds(previousPendingRemovalIds);
      onUploaded(mediaIdToRemove);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-text-muted">{label}</label>
      
      <div
        className={`relative border-2 border-dashed rounded-[--radius-school] p-8 transition-all flex flex-col items-center justify-center gap-4 cursor-pointer ${
          dragActive ? 'border-primary-navy bg-primary-navy/5' : 'border-gray-200 hover:border-primary-navy hover:bg-gray-50'
        } ${uploading || removing ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !(uploading || removing) && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          disabled={uploading || removing}
          onChange={handleChange}
          className="hidden"
        />

        {(file || preview || currentMediaId) && !uploading ? (
          <div className="w-full flex flex-col items-center gap-4">
            {preview ? (
              <div className="relative h-48 w-full max-w-sm overflow-hidden rounded border bg-slate-50">
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 100vw, 24rem"
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="p-4 bg-green-50 text-green-700 rounded-full flex items-center gap-2">
                <Check className="w-5 h-5" />
                {file?.name || 'File uploaded'}
              </div>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                void removeFile();
              }}
              className="text-xs text-red-600 hover:underline flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Remove file
            </button>
          </div>
        ) : uploading || removing ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary-navy/20 border-t-primary-navy rounded-full animate-spin" />
            <p className="text-sm font-medium text-primary-navy">
              {uploading ? `Uploading... ${progress}%` : "Removing file..."}
            </p>
          </div>
        ) : (
          <>
            <div className="p-4 bg-gray-100 rounded-full">
              <Upload className="w-8 h-8 text-text-muted" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-text-main">{description}</p>
              <p className="text-xs text-text-muted mt-1">
                {imageOnly ? "PNG, JPG up to 10MB" : "PNG, JPG or PDF up to 10MB"}
              </p>
            </div>
          </>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
