"use client";

import { useMediaUpload } from "@/lib/hooks/useMediaUpload";
import { Upload, X, Check } from "lucide-react";
import { useRef, useState } from "react";

type MediaUploaderProps = {
  accept?: string;
  imageOnly?: boolean;
  onUploaded: (mediaId: string) => void;
  label?: string;
  description?: string;
};

export function MediaUploader({
  accept,
  imageOnly = false,
  onUploaded,
  label = "Upload File",
  description = "Click or drag file here",
}: MediaUploaderProps) {
  const { upload, uploading, progress, error } = useMediaUpload();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    try {
      const result = await upload(selectedFile);
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

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-text-muted">{label}</label>
      
      <div
        className={`relative border-2 border-dashed rounded-[--radius-school] p-8 transition-all flex flex-col items-center justify-center gap-4 cursor-pointer ${
          dragActive ? 'border-primary-navy bg-primary-navy/5' : 'border-gray-200 hover:border-primary-navy hover:bg-gray-50'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          disabled={uploading}
          onChange={handleChange}
          className="hidden"
        />

        {file && !uploading ? (
          <div className="w-full flex flex-col items-center gap-4">
            {preview ? (
              <img src={preview} alt="Preview" className="h-48 object-contain rounded border" />
            ) : (
              <div className="p-4 bg-green-50 text-green-700 rounded-full flex items-center gap-2">
                <Check className="w-5 h-5" />
                {file.name}
              </div>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeFile();
              }}
              className="text-xs text-red-600 hover:underline flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Remove file
            </button>
          </div>
        ) : uploading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary-navy/20 border-t-primary-navy rounded-full animate-spin" />
            <p className="text-sm font-medium text-primary-navy">Uploading... {progress}%</p>
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
