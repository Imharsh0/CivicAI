import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { CivicIssue, IssueStatus } from '../../types';

interface StatusUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  issue: CivicIssue | null;
  onUpdateStatus: (issueId: string, status: IssueStatus, comment?: string, assignedTo?: string) => Promise<void>;
}

export const StatusUpdateModal: React.FC<StatusUpdateModalProps> = ({
  isOpen,
  onClose,
  issue,
  onUpdateStatus,
}) => {
  if (!issue) return null;

  const [newStatus, setNewStatus] = useState<IssueStatus>(issue.status);
  const [assignedTo, setAssignedTo] = useState(issue.assigned_to || '');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (issue) {
      setNewStatus(issue.status);
      setAssignedTo(issue.assigned_to || '');
      setComment('');
      setError(null);
    }
  }, [issue]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await onUpdateStatus(issue.id, newStatus, comment, assignedTo || undefined);
      onClose();
    } catch (err) {
      console.error(err);
      setError('Failed to update status. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Incident Lifecycle"
      subtitle={`Ticket ${issue.id} — ${issue.issue_type}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {error && (
          <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
            {error}
          </div>
        )}

        {/* New Status selection */}
        <div>
          <label htmlFor="status-select" className="block font-semibold text-slate-700 mb-1">
            Change Incident Status
          </label>
          <select
            id="status-select"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value as IssueStatus)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-900"
          >
            <option value="Reported">Reported</option>
            <option value="Verified">Verified</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* Assigned Officer / Division */}
        <div>
          <label htmlFor="assignee-input" className="block font-semibold text-slate-700 mb-1">
            Assign to Field Officer / Municipal Division
          </label>
          <input
            id="assignee-input"
            type="text"
            placeholder="e.g. Inspector R. Sharma (PWD Central Zone)"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
          />
        </div>

        {/* Internal Log Comment */}
        <div>
          <label htmlFor="status-comment-input" className="block font-semibold text-slate-700 mb-1">
            Operational Log Note
          </label>
          <textarea
            id="status-comment-input"
            rows={3}
            placeholder="Document action dispatched, contractor details, or site inspection remarks..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
            Save Status Update
          </Button>
        </div>
      </form>
    </Modal>
  );
};
