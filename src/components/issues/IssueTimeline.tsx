import React from 'react';
import { Check, Clock, Sparkles, UserCheck, Wrench, CheckCircle2, LucideIcon } from 'lucide-react';
import { IssueStatus } from '../../types';
import { formatIndianDate } from '../../utils/formatters';

interface IssueTimelineProps {
  currentStatus: IssueStatus;
  createdDate?: string;
  assignedOfficer?: string;
}

export const IssueTimeline: React.FC<IssueTimelineProps> = ({
  currentStatus,
  createdDate,
  assignedOfficer,
}) => {
  const steps: Array<{
    id: IssueStatus | 'AI Analysis';
    label: string;
    description: string;
    icon: LucideIcon;
  }> = [
    {
      id: 'Reported',
      label: 'Reported',
      description: createdDate ? `Logged on ${formatIndianDate(createdDate)}` : 'Logged by citizen',
      icon: Clock,
    },
    {
      id: 'AI Analysis',
      label: 'AI Analysis',
      description: 'Severity & Priority calculated',
      icon: Sparkles,
    },
    {
      id: 'Verified',
      label: 'Verified',
      description: 'Validated by civic control room',
      icon: CheckCircle2,
    },
    {
      id: 'Assigned',
      label: 'Assigned',
      description: assignedOfficer ? `Assigned to ${assignedOfficer}` : 'Dispatched to zonal squad',
      icon: UserCheck,
    },
    {
      id: 'In Progress',
      label: 'In Progress',
      description: 'On-ground field repair underway',
      icon: Wrench,
    },
    {
      id: 'Resolved',
      label: 'Resolved',
      description: 'Closed with After-resolution evidence',
      icon: Check,
    },
  ];

  // Map status hierarchy index
  const statusRank: Record<string, number> = {
    Reported: 1,
    'AI Analysis': 2,
    Verified: 3,
    Assigned: 4,
    'In Progress': 5,
    Resolved: 6,
    Rejected: 0,
  };

  const currentRank = statusRank[currentStatus] || 1;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h4 className="font-bold text-slate-900 text-sm">Incident Lifecycle Tracker</h4>
        <span className="text-xs text-slate-400">
          {createdDate && <span className="hidden sm:inline mr-2">Reported: {formatIndianDate(createdDate)} •</span>}
          Live Status: <strong className={currentStatus === 'Rejected' ? 'text-rose-600' : 'text-slate-700'}>{currentStatus}</strong>
        </span>
      </div>

      {/* Responsive timeline */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {steps.map((step, idx) => {
          const stepRank = idx + 1;
          const isCompleted = stepRank <= currentRank;
          const isCurrent = stepRank === currentRank;
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              className={`p-3 rounded-xl border transition-all flex flex-col justify-between ${
                isCurrent
                  ? 'border-teal-500 bg-teal-50/50 shadow-sm ring-2 ring-teal-500/20'
                  : isCompleted
                  ? 'border-emerald-200 bg-emerald-50/30'
                  : 'border-slate-100 bg-slate-50/50 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-teal-600 text-white animate-pulse'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-slate-400">0{idx + 1}</span>
              </div>

              <div>
                <p className={`text-xs font-bold ${isCurrent ? 'text-teal-900' : 'text-slate-800'}`}>
                  {step.label}
                </p>
                <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5 leading-tight">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
