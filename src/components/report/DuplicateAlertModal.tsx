import React from 'react';
import { AlertCircle, MapPin, Eye, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { CivicIssue } from '../../types';
import { PriorityBadge, StatusBadge } from '../common/Badge';

interface DuplicateAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchedIssue: CivicIssue | null;
  distanceMeters?: number;
  onViewExisting: (issueId: string) => void;
  onAddSupportingEvidence: (issueId: string) => void;
  onContinueReporting: () => void;
}

export const DuplicateAlertModal: React.FC<DuplicateAlertModalProps> = ({
  isOpen,
  onClose,
  matchedIssue,
  distanceMeters,
  onViewExisting,
  onAddSupportingEvidence,
  onContinueReporting,
}) => {
  if (!matchedIssue) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Possible Nearby Report Detected"
      subtitle="CivicAI spotted an active ticket close to this location"
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Banner */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">“A similar issue may already have been reported nearby.”</p>
            <p className="mt-0.5 text-amber-800">
              Avoiding duplicate tickets helps municipal response squads resolve issues faster.
            </p>
          </div>
        </div>

        {/* Existing Matched Issue Card */}
        <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[11px] font-mono text-slate-500 font-semibold">
                {matchedIssue.id}
              </span>
              <h4 className="font-bold text-slate-900 text-sm">{matchedIssue.issue_type}</h4>
            </div>
            <div className="flex flex-col items-end gap-1">
              <PriorityBadge level={matchedIssue.priority_level} showScore={false} />
              <StatusBadge status={matchedIssue.status} />
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span>{matchedIssue.location_text}</span>
            {distanceMeters !== undefined && distanceMeters !== null && (
              <span className="font-semibold text-slate-700 ml-1">
                (~{distanceMeters}m away)
              </span>
            )}
          </div>

          <p className="text-xs text-slate-500 line-clamp-2 italic">
            "{matchedIssue.description}"
          </p>
        </div>

        {/* Three Required Action Options */}
        <div className="space-y-2 pt-2">
          <Button
            type="button"
            variant="secondary"
            className="w-full justify-between text-xs"
            onClick={() => onViewExisting(matchedIssue.id)}
            leftIcon={<Eye className="w-4 h-4" />}
            rightIcon={<ArrowRight className="w-3.5 h-3.5 text-slate-400" />}
          >
            <span>View Existing Report</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full justify-between text-xs"
            onClick={() => onAddSupportingEvidence(matchedIssue.id)}
            leftIcon={<CheckCircle2 className="w-4 h-4 text-teal-600" />}
            rightIcon={<ArrowRight className="w-3.5 h-3.5 text-slate-400" />}
          >
            <span>Add Supporting Evidence to Existing</span>
          </Button>

          <button
            type="button"
            onClick={onContinueReporting}
            className="w-full py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors text-center"
          >
            It's a different problem — Continue reporting
          </button>
        </div>
      </div>
    </Modal>
  );
};
