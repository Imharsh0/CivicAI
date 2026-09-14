import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Camera, ShieldCheck, Sparkles } from 'lucide-react';
import { CivicIssue } from '../../types';
import { PriorityBadge, StatusBadge } from '../common/Badge';
import { formatIndianDate, formatRelativeTime } from '../../utils/formatters';

interface IssueCardProps {
  issue: CivicIssue;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/issue/${issue.id}`)}
      className="group bg-white rounded-2xl border border-slate-200/90 hover:border-teal-500/50 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col cursor-pointer"
    >
      {/* Thumbnail & Priority Overlay */}
      <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden">
        <img
          src={issue.image_url}
          alt={issue.issue_type}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Priority badge top-left */}
        <div className="absolute top-2.5 left-2.5">
          <PriorityBadge level={issue.priority_level} score={issue.priority_score} />
        </div>

        {/* Status badge top-right */}
        <div className="absolute top-2.5 right-2.5">
          <StatusBadge status={issue.status} />
        </div>

        {/* Resolution proof tag if resolved */}
        {issue.resolution && (
          <div className="absolute bottom-2.5 left-2.5 bg-emerald-950/85 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-[11px] font-semibold border border-emerald-400/40 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Before & After Verified</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>{issue.id}</span>
            <span className="text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded font-sans">
              {issue.category}
            </span>
          </div>

          <h3 className="font-bold text-slate-900 text-sm group-hover:text-teal-700 transition-colors line-clamp-1">
            {issue.issue_type}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {issue.description}
          </p>
        </div>

        {/* Footer Meta */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <div className="flex items-center gap-1 text-xs text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span className="truncate">{issue.location_text}</span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>AI Confidence: <strong className="text-slate-700">{issue.ai_confidence}%</strong></span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{formatRelativeTime(issue.created_at)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
