import React from 'react';
import { Info, Activity, AlertTriangle } from 'lucide-react';
import { PriorityLevel, SeverityLevel } from '../../types';
import { PriorityBadge } from '../common/Badge';

interface PriorityBreakdownCardProps {
  score: number;
  level: PriorityLevel;
  severity: SeverityLevel;
  explanation?: string;
  safetyImpact?: string;
}

export const PriorityBreakdownCard: React.FC<PriorityBreakdownCardProps> = ({
  score,
  level,
  severity,
  explanation,
  safetyImpact,
}) => {
  const clampedScore = Math.min(Math.max(score, 0), 100);

  return (
    <div className="rounded-2xl border border-teal-200/80 bg-gradient-to-br from-teal-50/70 via-white to-slate-50 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-teal-700" />
          <h4 className="font-bold text-slate-900 text-sm">
            AI Priority Engine Recommendation
          </h4>
        </div>
        <PriorityBadge level={level} score={score} showScore={true} />
      </div>

      {/* Score Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-semibold text-slate-700">
          <span>Priority Index</span>
          <span className="font-mono text-teal-800">{score}/100</span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Priority Index"
          className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden p-0.5"
        >
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              clampedScore >= 85
                ? 'bg-gradient-to-r from-amber-500 to-rose-600'
                : clampedScore >= 70
                ? 'bg-gradient-to-r from-teal-500 to-amber-500'
                : 'bg-teal-500'
            }`}
            style={{ width: `${clampedScore}%` }}
          />
        </div>
      </div>

      {/* Why P1 / Rationale Breakdown */}
      <div className="bg-white rounded-xl p-3.5 border border-slate-200/70 space-y-2 text-xs">
        <div className="font-bold text-slate-800 flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          <span>Why {level}?</span>
        </div>
        <ul className="space-y-1 text-slate-600 list-disc list-inside">
          <li>
            <strong className="text-slate-800">Severity Assessment:</strong> {severity} level physical infrastructure impact.
          </li>
          {safetyImpact && (
            <li>
              <strong className="text-slate-800">Public Hazard:</strong> {safetyImpact}
            </li>
          )}
          <li>
            <strong className="text-slate-800">Location Weight:</strong> Primary thoroughfare with significant vehicular & pedestrian exposure.
          </li>
        </ul>
        {explanation && (
          <p className="text-slate-500 text-[11px] pt-1 border-t border-slate-100 italic">
            "{explanation}"
          </p>
        )}
      </div>

      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span>
          Algorithmic recommendation generated to assist municipal field engineers in dispatch scheduling.
        </span>
      </div>
    </div>
  );
};
