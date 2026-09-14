import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIssues } from '../contexts/IssuesContext';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { IssueCard } from '../components/issues/IssueCard';
import { Button } from '../components/common/Button';
import { PlusCircle, Clock, CheckCircle2, AlertCircle, Wrench, Search } from 'lucide-react';

export const UserDashboardPage: React.FC = () => {
  const { issues } = useIssues();
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'in_progress' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter issues created by this user or demo user
  const userIssues = useMemo(() => {
    // Show user's issues, or if demo user show user's + sample issues
    return issues.filter((iss) => {
      const matchesSearch =
        !searchQuery ||
        iss.issue_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        iss.location_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        iss.id.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeTab === 'pending') {
        return iss.status === 'Reported' || iss.status === 'Verified';
      }
      if (activeTab === 'in_progress') {
        return iss.status === 'In Progress' || iss.status === 'Assigned';
      }
      if (activeTab === 'resolved') {
        return iss.status === 'Resolved';
      }
      return true;
    });
  }, [issues, activeTab, searchQuery]);

  // Stats calculation
  const totalCount = issues.length;
  const pendingCount = issues.filter((i) => i.status === 'Reported' || i.status === 'Verified').length;
  const inProgressCount = issues.filter((i) => i.status === 'In Progress' || i.status === 'Assigned').length;
  const resolvedCount = issues.filter((i) => i.status === 'Resolved').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Profile Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t.myReports}
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
              Citizen Portal
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Welcome back, <strong>{user?.name || 'Citizen'}</strong> ({user?.city || 'Delhi'}). Track your submitted civic complaints in real-time.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/report')}
          leftIcon={<PlusCircle className="w-4 h-4" />}
        >
          <span>Report New Problem</span>
        </Button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveTab('all')}
          className={`bg-white rounded-2xl p-5 border cursor-pointer transition-all ${
            activeTab === 'all'
              ? 'border-teal-500 ring-2 ring-teal-500/20 shadow-sm'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Reports</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
              #
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2 font-mono">{totalCount}</p>
          <span className="text-[11px] text-slate-400">All submitted tickets</span>
        </div>

        <div
          onClick={() => setActiveTab('pending')}
          className={`bg-white rounded-2xl p-5 border cursor-pointer transition-all ${
            activeTab === 'pending'
              ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Pending</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-blue-700 mt-2 font-mono">{pendingCount}</p>
          <span className="text-[11px] text-slate-400">Awaiting squad allocation</span>
        </div>

        <div
          onClick={() => setActiveTab('in_progress')}
          className={`bg-white rounded-2xl p-5 border cursor-pointer transition-all ${
            activeTab === 'in_progress'
              ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-sm'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">In Progress</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-amber-700 mt-2 font-mono">{inProgressCount}</p>
          <span className="text-[11px] text-slate-400">Field work underway</span>
        </div>

        <div
          onClick={() => setActiveTab('resolved')}
          className={`bg-white rounded-2xl p-5 border cursor-pointer transition-all ${
            activeTab === 'resolved'
              ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Resolved</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-emerald-700 mt-2 font-mono">{resolvedCount}</p>
          <span className="text-[11px] text-slate-400">Verified with photo evidence</span>
        </div>
      </div>

      {/* Search & Tabs Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold self-start">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            All ({totalCount})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'pending' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setActiveTab('in_progress')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'in_progress' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            In Progress ({inProgressCount})
          </button>
          <button
            onClick={() => setActiveTab('resolved')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'resolved' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            Resolved ({resolvedCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search my reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Issues Grid */}
      {userIssues.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {userIssues.map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No reports found in this category</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You don't have any complaints matching this filter. See something broken in your city? Report it now.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/report')}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            Report a Problem
          </Button>
        </div>
      )}
    </div>
  );
};

