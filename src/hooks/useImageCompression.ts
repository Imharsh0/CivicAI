import { useState, useCallback } from 'react';

export interface CompressedImageResult {
  blob: Blob;
  dataUrl: string;
  originalSize: number; // in bytes
  compressedSize: number; // in bytes
  compressionRatio: number; // percentage saved
  width: number;
  height: number;
}

export function useImageCompression() {
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const compressImage = useCallback(
    async (
      file: File,
      maxDimension = 1400,
      quality = 0.82
    ): Promise<CompressedImageResult> => {
      setIsCompressing(true);
      setError(null);

      return new Promise((resolve, reject) => {
        const originalSize = file.size;
        const reader = new FileReader();

        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            let { width, height } = img;

            // Downscale proportionally if larger than maxDimension
            if (width > maxDimension || height > maxDimension) {
              if (width > height) {
                height = Math.round((height * maxDimension) / width);
                width = maxDimension;
              } else {
                width = Math.round((width * maxDimension) / height);
                height = maxDimension;
              }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
              setIsCompressing(false);
              const err = 'Failed to obtain 2D canvas context';
              setError(err);
              reject(new Error(err));
              return;
            }

            ctx.drawImage(img, 0, 0, width, height);

            // Determine modern WebP support or fallback to JPEG
            const mimeType = 'image/jpeg';
            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  setIsCompressing(false);
                  const err = 'Image compression failed';
                  setError(err);
                  reject(new Error(err));
                  return;
                }

                const compressedSize = blob.size;
                const compressionRatio = Math.max(
                  0,
                  Math.round(((originalSize - compressedSize) / originalSize) * 100)
                );

                const dataUrl = canvas.toDataURL(mimeType, quality);
                setIsCompressing(false);

                resolve({
                  blob,
                  dataUrl,
                  originalSize,
                  compressedSize,
                  compressionRatio,
                  width,
                  height,
                });
              },
              mimeType,
              quality
            );
          };

          img.onerror = () => {
            setIsCompressing(false);
            const err = 'Failed to load image file';
            setError(err);
            reject(new Error(err));
          };

          img.src = event.target?.result as string;
        };

        reader.onerror = () => {
          setIsCompressing(false);
          const err = 'Failed to read image file';
          setError(err);
          reject(new Error(err));
        };

        reader.readAsDataURL(file);
      });
    },
    []
  );

  return { compressImage, isCompressing, error };
}
