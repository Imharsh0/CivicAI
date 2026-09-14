import React from 'react';
import { PriorityLevel, IssueStatus, SeverityLevel } from '../../types';
import { cn } from '../../utils/cn';

interface PriorityBadgeProps {
  level: PriorityLevel;
  score?: number;
  className?: string;
  showScore?: boolean;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  level,
  score,
  className,
  showScore = true,
}) => {
  const configs: Record<PriorityLevel, { bg: string; text: string; border: string; label: string; dot: string }> = {
    P1: {
      bg: 'bg-rose-50 text-rose-700',
      text: 'text-rose-700',
      border: 'border-rose-200',
      label: 'P1 • Critical',
      dot: 'bg-rose-500 animate-pulse',
    },
    P2: {
      bg: 'bg-amber-50 text-amber-700',
      text: 'text-amber-700',
      border: 'border-amber-200',
      label: 'P2 • High',
      dot: 'bg-amber-500',
    },
    P3: {
      bg: 'bg-yellow-50 text-yellow-800',
      text: 'text-yellow-800',
      border: 'border-yellow-200',
      label: 'P3 • Medium',
      dot: 'bg-yellow-500',
    },
    P4: {
      bg: 'bg-slate-100 text-slate-700',
      text: 'text-slate-700',
      border: 'border-slate-200',
      label: 'P4 • Low',
      dot: 'bg-slate-400',
    },
  };

  const config = configs[level] || configs.P4;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border',
        config.bg,
        config.border,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
      {config.label}
      {showScore && score !== undefined && (
        <span className="text-[10px] font-mono opacity-80 pl-0.5">({score}/100)</span>
      )}
    </span>
  );
};

interface StatusBadgeProps {
  status: IssueStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const configs: Record<IssueStatus, { bg: string; border: string; text: string; dot: string }> = {
    Reported: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      dot: 'bg-blue-500',
    },
    Verified: {
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      text: 'text-indigo-700',
      dot: 'bg-indigo-500',
    },
    Assigned: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-700',
      dot: 'bg-purple-500',
    },
    'In Progress': {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-700',
      dot: 'bg-amber-500 animate-pulse',
    },
    Resolved: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-700',
      dot: 'bg-emerald-500',
    },
    Rejected: {
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      text: 'text-rose-700',
      dot: 'bg-rose-500',
    },
  };

  const config = configs[status] || configs.Reported;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border',
        config.bg,
        config.border,
        config.text,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
      {status}
    </span>
  );
};

interface SeverityBadgeProps {
  severity: SeverityLevel;
  className?: string;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity, className }) => {
  const colors = {
    Critical: 'text-rose-600 bg-rose-50 border-rose-200',
    High: 'text-orange-600 bg-orange-50 border-orange-200',
    Medium: 'text-amber-600 bg-amber-50 border-amber-200',
    Low: 'text-slate-600 bg-slate-50 border-slate-200',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border',
        colors[severity] || colors.Low,
        className
      )}
    >
      Severity: {severity}
    </span>
  );
};
