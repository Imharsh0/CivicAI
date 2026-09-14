import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle, ShieldCheck, Zap } from 'lucide-react';

interface AIScannerModalProps {
  isAnalyzing: boolean;
  imagePreviewUrl?: string;
}

const SCAN_STEPS = [
  'Scanning image pixels & geometry...',
  'Detecting civic problem classification...',
  'Checking hazard severity & pedestrian risk...',
  'Calculating Priority Score & Ward recommendations...',
];

export const AIScannerModal: React.FC<AIScannerModalProps> = ({
  isAnalyzing,
  imagePreviewUrl,
}) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!isAnalyzing) {
      setStep(0);
      return;
    }

    const interval = setInterval(() => {
      setStep((prev) => (prev < SCAN_STEPS.length - 1 ? prev + 1 : prev));
    }, 450);

    return () => clearInterval(interval);
  }, [isAnalyzing]);

  if (!isAnalyzing) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-scanner-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
    >
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 text-center overflow-hidden">
        {/* Animated Scanner Preview */}
        <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-slate-900 mb-6 shadow-inner">
          {imagePreviewUrl ? (
            <img
              src={imagePreviewUrl}
              alt="Analyzing civic issue"
              className="w-full h-full object-cover opacity-75 filter contrast-125"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-teal-400">
              <Sparkles className="w-10 h-10 animate-spin" />
            </div>
          )}

          {/* Laser Scanning Line */}
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-[0_0_15px_#2dd4bf] animate-scan-line top-0" />

          {/* Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#14b8a615_1px,transparent_1px),linear-gradient(to_bottom,#14b8a615_1px,transparent_1px)] bg-[size:24px_24px]" />

          {/* Status Badge */}
          <div className="absolute bottom-3 left-3 bg-teal-900/80 backdrop-blur-md border border-teal-500/40 text-teal-300 text-[11px] font-mono px-2.5 py-1 rounded-lg flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
            <span>AI VISION ACTIVE</span>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2 text-teal-600 font-bold text-sm tracking-wide uppercase">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>CivicAI Vision Engine</span>
          </div>
          <h3 id="ai-scanner-title" className="text-xl font-extrabold text-slate-900">
            Analyzing your report...
          </h3>
          <p className="text-xs text-slate-500">
            Evaluating civic defect parameters and calculating municipal priority
          </p>
        </div>

        {/* Dynamic Step Progress */}
        <div className="mt-6 space-y-2.5 text-left">
          {SCAN_STEPS.map((s, idx) => {
            const isDone = idx < step;
            const isCurrent = idx === step;

            return (
              <div
                key={s}
                className={`flex items-center gap-3 text-xs p-2.5 rounded-xl transition-all duration-300 ${
                  isCurrent
                    ? 'bg-teal-50 text-teal-900 font-semibold border border-teal-200 shadow-sm'
                    : isDone
                    ? 'text-slate-600 bg-slate-50'
                    : 'text-slate-400 opacity-50'
                }`}
              >
                {isDone ? (
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : isCurrent ? (
                  <Zap className="w-4 h-4 text-teal-600 animate-bounce shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                )}
                <span className="flex-1">{s}</span>
              </div>
            );
          })}
        </div>

        {/* Bottom Trust Guarantee */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>Verified algorithmic scoring • No heavy models on device</span>
        </div>
      </div>
    </div>
  );
};
