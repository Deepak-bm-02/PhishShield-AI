"use client";
import React, { useState, useRef } from "react";
import { UploadCloud, X, File } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

interface UploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSizeMB?: number;
}

export function Upload({ onFileSelect, accept = "image/*", maxSizeMB = 5 }: UploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`File size exceeds ${maxSizeMB}MB`);
      return;
    }
    setSelectedFile(file);
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div
      className={cn(
        "relative rounded-xl border-2 border-dashed transition-all cursor-pointer overflow-hidden group",
        dragActive ? "border-blue-500 bg-blue-500/10" : "border-border bg-card/50 hover:border-border hover:bg-card"
      )}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input 
        ref={inputRef} 
        type="file" 
        className="hidden" 
        accept={accept} 
        onChange={handleChange} 
      />

      <AnimatePresence mode="wait">
        {!selectedFile ? (
          <motion.div 
            key="empty" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-8 px-4 text-center"
          >
            <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <UploadCloud className="h-6 w-6 text-blue-400" />
            </div>
            <p className="text-foreground font-medium mb-1">Click or drag file to this area to upload</p>
            <p className="text-neutral text-sm">Supports {accept} up to {maxSizeMB}MB</p>
          </motion.div>
        ) : (
          <motion.div 
            key="filled" 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="relative p-6 flex flex-col items-center justify-center"
          >
            <button 
              onClick={removeFile}
              className="absolute top-2 right-2 p-1 bg-background/80 rounded-full text-neutral hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Preview" className="max-h-48 rounded-lg object-contain shadow-lg mb-4" />
            ) : (
              <div className="h-24 w-24 rounded-lg bg-card flex items-center justify-center mb-4">
                <File className="h-10 w-10 text-neutral" />
              </div>
            )}
            <p className="text-sm font-medium text-foreground truncate max-w-full px-4">{selectedFile.name}</p>
            <p className="text-xs text-neutral mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
