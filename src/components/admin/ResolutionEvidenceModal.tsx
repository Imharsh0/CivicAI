import React, { useState, useRef } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { CivicIssue } from '../../types';
import { Camera, Trash2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useImageCompression, CompressedImageResult } from '../../hooks/useImageCompression';
import { uploadCivicImage } from '../../services/storageService';

interface ResolutionEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  issue: CivicIssue | null;
  onResolveWithEvidence: (
    issueId: string,
    note: string,
    afterImageUrl: string,
    resolvedByName?: string
  ) => Promise<void>;
}

export const ResolutionEvidenceModal: React.FC<ResolutionEvidenceModalProps> = ({
  isOpen,
  onClose,
  issue,
  onResolveWithEvidence,
}) => {
  if (!issue) return null;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { compressImage, isCompressing } = useImageCompression();

  const [compressedResult, setCompressedResult] = useState<CompressedImageResult | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [officerName, setOfficerName] = useState('Assistant Municipal Engineer (Field Division)');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFile = async (file: File) => {
    try {
      const res = await compressImage(file);
      setCompressedResult(res);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemoveImage = () => {
    setCompressedResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!compressedResult) {
      alert('Please upload an After-resolution evidence photo to close this issue.');
      return;
    }
    if (!resolutionNote.trim()) {
      alert('Please enter a brief resolution summary note.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Upload compressed image to storage or demo base64
      const afterImageUrl = await uploadCivicImage(
        compressedResult.blob,
        'resolution-images'
      );

      await onResolveWithEvidence(
        issue.id,
        resolutionNote,
        afterImageUrl,
        officerName
      );

      onClose();
    } catch (err) {
      console.error('Error resolving issue:', err);
      alert('Could not submit resolution evidence. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Resolution Evidence"
      subtitle={`Verify field completion for Ticket ${issue.id}`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Banner */}
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="leading-relaxed">
            Uploading an <strong>"After" resolution photo</strong> produces transparent Before/After proof on the public ticket, confirming physical resolution to citizens.
          </p>
        </div>

        {/* Resolution Image Upload */}
        <div>
          <label htmlFor="resolution-file-input" className="block font-semibold text-slate-700 mb-1.5">
            After Resolution Photo (Proof of completion) *
          </label>
          <input
            id="resolution-file-input"
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = '';
            }}
            accept="image/*"
            className="hidden"
            aria-label="Upload after-resolution photo evidence"
          />

          {!compressedResult ? (
            <div
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              aria-label="Tap to upload or capture After photo"
              className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 rounded-2xl p-6 text-center bg-emerald-50/30 cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <Camera className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="font-semibold text-slate-800">
                Tap to upload or capture "After" photo
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Repaired asphalt, cleared garbage zone, sealed pipeline, etc.
              </p>
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-emerald-300">
              <img
                src={compressedResult.dataUrl}
                alt="After repair proof"
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 left-2 bg-emerald-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-white font-mono text-[10px] flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Evidence Loaded ({Math.round(compressedResult.compressedSize / 1024)} KB)</span>
              </div>
              <button
                type="button"
                onClick={handleRemoveImage}
                aria-label="Remove evidence photo"
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-600 text-white shadow-md hover:bg-rose-700 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          {isCompressing && (
            <p className="text-[11px] text-teal-600 mt-1 animate-pulse">
              Optimizing evidence photo...
            </p>
          )}
        </div>

        {/* Verifying Officer Name */}
        <div>
          <label htmlFor="officer-name-input" className="block font-semibold text-slate-700 mb-1">
            Verifying Officer / Squad Lead Name
          </label>
          <input
            id="officer-name-input"
            type="text"
            value={officerName}
            onChange={(e) => setOfficerName(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
          />
        </div>

        {/* Resolution Note */}
        <div>
          <label htmlFor="resolution-note-input" className="block font-semibold text-slate-700 mb-1">
            Official Resolution Summary & Technical Details *
          </label>
          <textarea
            id="resolution-note-input"
            rows={3}
            required
            placeholder="e.g. Patch repaired with hot bituminous mix and compacted with 2-ton roller. Traffic movement completely normalized."
            value={resolutionNote}
            onChange={(e) => setResolutionNote(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSubmitting}
            leftIcon={<ShieldCheck className="w-4 h-4" />}
          >
            Mark Incident Resolved
          </Button>
        </div>
      </form>
    </Modal>
  );
};
