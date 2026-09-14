import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Calendar, User } from 'lucide-react';
import { ResolutionEvidence } from '../../types';
import { formatIndianDateTime } from '../../utils/formatters';

interface BeforeAfterViewerProps {
  beforeImageUrl: string;
  resolution: ResolutionEvidence;
  issueType: string;
}

export const BeforeAfterViewer: React.FC<BeforeAfterViewerProps> = ({
  beforeImageUrl,
  resolution,
  issueType,
}) => {
  const [activeTab, setActiveTab] = useState<'side-by-side' | 'before' | 'after'>('side-by-side');

  return (
    <div className="bg-white rounded-2xl border border-emerald-200 overflow-hidden shadow-sm space-y-4 p-5">
      {/* Header with verified badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              Verified Resolution Evidence
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Official Proof
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              On-ground municipal field evidence uploaded by civic authorities
            </p>
          </div>
        </div>

        {/* View toggle pills */}
        <div
          role="tablist"
          aria-label="Evidence display views"
          className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'side-by-side'}
            onClick={() => setActiveTab('side-by-side')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'side-by-side'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Split View
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'before'}
            onClick={() => setActiveTab('before')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'before'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Before
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'after'}
            onClick={() => setActiveTab('after')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'after'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            After
          </button>
        </div>
      </div>

      {/* Visual Evidence Showcase */}
      {activeTab === 'side-by-side' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Before */}
          <div className="space-y-2">
            <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
              <img
                src={beforeImageUrl}
                alt={`Initial reported condition - ${issueType}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-rose-950/80 backdrop-blur-md text-rose-200 text-xs font-bold px-2.5 py-1 rounded-lg border border-rose-500/30">
                BEFORE: Problem Reported
              </div>
            </div>
            <p className="text-xs text-slate-500">Initial citizen report image</p>
          </div>

          {/* After */}
          <div className="space-y-2">
            <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-900 border border-emerald-300">
              <img
                src={resolution.after_image_url}
                alt={`Official field completion verification - ${issueType}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-emerald-950/80 backdrop-blur-md text-emerald-200 text-xs font-bold px-2.5 py-1 rounded-lg border border-emerald-500/30 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>AFTER: Work Completed</span>
              </div>
            </div>
            <p className="text-xs text-slate-500">Official field completion verification</p>
          </div>
        </div>
      )}

      {activeTab === 'before' && (
        <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
          <img
            src={beforeImageUrl}
            alt={`Before repair - ${issueType}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 bg-rose-950/80 backdrop-blur-md text-rose-200 text-xs font-bold px-3 py-1.5 rounded-lg">
            BEFORE: Reported Problem ({issueType})
          </div>
        </div>
      )}

      {activeTab === 'after' && (
        <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-slate-900 border border-emerald-300">
          <img
            src={resolution.after_image_url}
            alt={`After resolution - ${issueType}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 bg-emerald-950/80 backdrop-blur-md text-emerald-200 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>AFTER: Resolution Executed</span>
          </div>
        </div>
      )}

      {/* Resolution Officer Remarks */}
      <div className="bg-emerald-50/60 rounded-xl p-4 border border-emerald-200/80 space-y-2 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 text-slate-600 font-medium">
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-emerald-700" />
            <span>
              Resolved by: <strong className="text-slate-800">{resolution.resolved_by_name || 'Civic Field Unit'}</strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatIndianDateTime(resolution.created_at)}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-emerald-200/50 text-slate-700 leading-relaxed font-sans">
          <strong>Official Note:</strong> “{resolution.resolution_note}”
        </div>
      </div>
    </div>
  );
};
