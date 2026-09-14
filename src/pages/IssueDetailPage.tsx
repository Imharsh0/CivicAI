import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  MapPin,
  Sparkles,
  Clock,
  ArrowLeft,
  ShieldCheck,
  FileCheck2,
  Wrench,
} from 'lucide-react';
import { useIssues } from '../contexts/IssuesContext';
import { useAuth } from '../contexts/AuthContext';
import { PriorityBadge, StatusBadge, SeverityBadge } from '../components/common/Badge';
import { PriorityBreakdownCard } from '../components/report/PriorityBreakdownCard';
import { IssueTimeline } from '../components/issues/IssueTimeline';
import { BeforeAfterViewer } from '../components/issues/BeforeAfterViewer';
import { StatusUpdateModal } from '../components/admin/StatusUpdateModal';
import { ResolutionEvidenceModal } from '../components/admin/ResolutionEvidenceModal';
import { Button } from '../components/common/Button';
import { formatIndianDateTime, formatRelativeTime } from '../utils/formatters';

export const IssueDetailPage: React.FC = () => {
  const { id: issueId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getIssueById, updateIssueStatus, addResolutionEvidence, isLoading } = useIssues();
  const { role } = useAuth();

  const issue = getIssueById(issueId || '');

  // Modals for authority actions
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isResolutionModalOpen, setIsResolutionModalOpen] = useState(false);

  if (isLoading && !issue) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="inline-block w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-600">Loading ticket details...</p>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Issue Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested ticket ID <span className="font-mono">{issueId}</span> does not exist or has been archived.
        </p>
        <Button variant="outline" size="sm" onClick={() => navigate('/explore')}>
          Back to Explore
        </Button>
      </div>
    );
  }

  const isAuthorityOrAdmin = role === 'admin' || role === 'authority';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb & Authority Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={() => navigate('/explore')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Issues</span>
        </button>

        {/* Authority Action Controls */}
        {isAuthorityOrAdmin && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsStatusModalOpen(true)}
              leftIcon={<Wrench className="w-3.5 h-3.5 text-teal-600" />}
            >
              <span>Update Lifecycle</span>
            </Button>
            {issue.status !== 'Resolved' && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsResolutionModalOpen(true)}
                leftIcon={<FileCheck2 className="w-3.5 h-3.5 text-white" />}
              >
                <span>Upload Resolution Proof</span>
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Main Grid: Details Left, Image/Meta Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Information & Timeline */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="font-mono text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
                Ticket ID: {issue.id}
              </span>
              <div className="flex items-center gap-2">
                <PriorityBadge level={issue.priority_level} score={issue.priority_score} />
                <StatusBadge status={issue.status} />
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {issue.issue_type}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                <strong className="text-slate-800">{issue.location_text}</strong>, {issue.city}
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                <span>Reported {formatIndianDateTime(issue.created_at)} ({formatRelativeTime(issue.created_at)})</span>
              </span>
            </div>
          </div>

          {/* Description Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 text-xs">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Citizen Incident Description
            </h3>
            <p className="text-slate-700 leading-relaxed text-sm font-sans">
              {issue.description}
            </p>
          </div>

          {/* Incident Lifecycle Timeline */}
          <IssueTimeline
            currentStatus={issue.status}
            createdDate={issue.created_at}
            assignedOfficer={issue.assigned_to}
          />

          {/* Transparent Priority Engine Rationale Card */}
          <PriorityBreakdownCard
            score={issue.priority_score}
            level={issue.priority_level}
            severity={issue.severity}
            explanation={issue.ai_explanation}
            safetyImpact={issue.safety_impact}
          />

          {/* Verified Before/After Resolution Evidence Showcase */}
          {issue.resolution && (
            <BeforeAfterViewer
              beforeImageUrl={issue.image_url}
              resolution={issue.resolution}
              issueType={issue.issue_type}
            />
          )}
        </div>

        {/* Right Column: Original Image & Municipal Dispatch Details */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Reported Photo */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm space-y-3 p-4">
            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-950 relative">
              <img
                src={issue.image_url}
                alt={issue.issue_type}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-mono px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-teal-400" />
                <span>AI Confidence: {issue.ai_confidence}%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-1">
              <div>
                <span>Category:</span>
                <p className="font-bold text-slate-800">{issue.category}</p>
              </div>
              <div>
                <span className="block mb-1">Initial Severity:</span>
                <SeverityBadge severity={issue.severity} />
              </div>
              <div>
                <span>Assigned Unit:</span>
                <p className="font-semibold text-slate-800 truncate">
                  {issue.assigned_to || 'Pending allocation'}
                </p>
              </div>
              <div>
                <span>Jurisdiction:</span>
                <p className="font-semibold text-slate-800 truncate">{issue.city} Zone</p>
              </div>
            </div>
          </div>

          {/* Quick Action Suggestion from AI */}
          {issue.suggested_action && (
            <div className="bg-teal-50/70 rounded-2xl border border-teal-200 p-4 space-y-1.5 text-xs text-teal-950">
              <div className="flex items-center gap-1.5 font-bold text-teal-900">
                <ShieldCheck className="w-4 h-4 text-teal-700" />
                <span>AI Recommended Municipal Action</span>
              </div>
              <p className="leading-relaxed text-teal-800">
                {issue.suggested_action}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <StatusUpdateModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        issue={issue}
        onUpdateStatus={updateIssueStatus}
      />

      <ResolutionEvidenceModal
        isOpen={isResolutionModalOpen}
        onClose={() => setIsResolutionModalOpen(false)}
        issue={issue}
        onResolveWithEvidence={addResolutionEvidence}
      />
    </div>
  );
};
