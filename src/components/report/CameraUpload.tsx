import React, { useRef } from 'react';
import { Camera, Upload, Trash2, RefreshCw, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useImageCompression, CompressedImageResult } from '../../hooks/useImageCompression';

interface CameraUploadProps {
  onImageReady: (result: CompressedImageResult | null) => void;
  compressedResult: CompressedImageResult | null;
}

export const CameraUpload: React.FC<CameraUploadProps> = ({
  onImageReady,
  compressedResult,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { compressImage, isCompressing, error } = useImageCompression();

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG, WebP)');
      return;
    }
    try {
      const result = await compressImage(file);
      onImageReady(result);
    } catch (err) {
      console.error('Compression error:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    onImageReady(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const formatKB = (bytes: number) => {
    return (bytes / 1024).toFixed(0) + ' KB';
  };

  return (
    <div className="space-y-3">
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInputChange}
        accept="image/*"
        aria-label="Upload issue image from file"
        className="hidden"
      />
      <input
        type="file"
        ref={cameraInputRef}
        onChange={handleInputChange}
        accept="image/*"
        capture="environment"
        aria-label="Capture issue image with camera"
        className="hidden"
      />

      {!compressedResult ? (
        <div
          role="button"
          tabIndex={0}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          aria-label="Drag and drop photo or tap to browse"
          className="border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-2xl p-6 sm:p-8 text-center bg-slate-50/70 hover:bg-teal-50/30 transition-all cursor-pointer group focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <div className="w-14 h-14 mx-auto rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
            <Upload className="w-7 h-7" />
          </div>

          <div className="mt-4 space-y-1">
            <p className="text-sm font-semibold text-slate-800">
              Drag & drop photo or tap to browse
            </p>
            <p className="text-xs text-slate-500">
              Supports camera capture on mobile, JPG, PNG, WebP
            </p>
          </div>

          {/* Mobile action buttons */}
          <div className="mt-5 flex items-center justify-center gap-3" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 text-white shadow hover:bg-teal-700 transition-colors"
            >
              <Camera className="w-4 h-4" />
              <span>Take Photo</span>
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
            >
              <Upload className="w-4 h-4 text-slate-500" />
              <span>Browse Files</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-sm">
          <img
            src={compressedResult.dataUrl}
            alt="Reported problem preview"
            className="w-full h-64 sm:h-80 object-cover"
          />

          {/* Image optimization stats badge */}
          <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-[11px] font-mono border border-white/10 flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              Optimized: {formatKB(compressedResult.compressedSize)}
              <span className="text-emerald-400 ml-1">
                (-{compressedResult.compressionRatio}%)
              </span>
            </span>
          </div>

          {/* Action buttons */}
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (fileInputRef.current) fileInputRef.current.value = '';
                fileInputRef.current?.click();
              }}
              className="px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-slate-800 text-xs font-semibold shadow-md flex items-center gap-1.5 transition-colors backdrop-blur-sm"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
              <span>Replace</span>
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-1.5 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 transition-colors backdrop-blur-sm"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      )}

      {isCompressing && (
        <p className="text-xs text-teal-600 font-medium animate-pulse text-center">
          ⚡ Optimizing image resolution for fast cellular upload...
        </p>
      )}

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
