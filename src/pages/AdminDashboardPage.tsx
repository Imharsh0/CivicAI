import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIssues } from '../contexts/IssuesContext';
import { useCity } from '../contexts/CityContext';
import { useAuth } from '../contexts/AuthContext';
import { CivicIssue, IssueStatus, PriorityLevel, IssueCategory, UserRole } from '../types';
import { PriorityBadge, StatusBadge } from '../components/common/Badge';
import { StatusUpdateModal } from '../components/admin/StatusUpdateModal';
import { ResolutionEvidenceModal } from '../components/admin/ResolutionEvidenceModal';
import { Button } from '../components/common/Button';
import {
  ShieldCheck,
  Search,
  Wrench,
  FileCheck2,
  Eye,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
  User,
  Building2,
  LogIn,
  LogOut,
  Lock,
} from 'lucide-react';
import { formatIndianDate } from '../utils/formatters';

export const AdminDashboardPage: React.FC = () => {
  const { issues, isLoading, updateIssueStatus, addResolutionEvidence } = useIssues();
  const { currentCity } = useCity();
  const { user, role, switchRole, login } = useAuth();
  const navigate = useNavigate();

  // Selected section tab in the Login portal view
  const [selectedSection, setSelectedSection] = useState<'admin' | 'user' | 'authority' | 'institution'>('admin');
  const [emailInput, setEmailInput] = useState('admin.delhi@civicai.org');
  const [passwordInput, setPasswordInput] = useState('••••••••••••');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Filters for Admin Triage
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<PriorityLevel | ''>('');
  const [selectedStatus, setSelectedStatus] = useState<IssueStatus | ''>('');
  const [selectedCategory, setSelectedCategory] = useState<IssueCategory | ''>('');

  // Selected issue for modal actions
  const [activeIssueForStatus, setActiveIssueForStatus] = useState<CivicIssue | null>(null);
  const [activeIssueForResolution, setActiveIssueForResolution] = useState<CivicIssue | null>(null);

  const isAdminOrAuthority = role === 'admin' || role === 'authority';

  // Quick switch & section login handler
  const handleSectionLogin = async (sectionRole: UserRole, customEmail?: string) => {
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const email = customEmail || (
        sectionRole === 'admin'
          ? 'admin.delhi@civicai.org'
          : sectionRole === 'authority'
          ? 'officer.verma@mcd.gov.in'
          : 'aarav.sharma@example.in'
      );

      await login(email);
      switchRole(sectionRole);
      setShowLoginModal(false);
    } catch (err: any) {
      setLoginError(err?.message || 'Authentication error. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const assignedRole: UserRole =
      selectedSection === 'user' ? 'user' : selectedSection === 'authority' ? 'authority' : 'admin';
    await handleSectionLogin(assignedRole, emailInput);
    if (assignedRole === 'user') {
      navigate('/dashboard');
    }
  };

  // Filtered issues for the triage board
  const filteredIssues = useMemo(() => {
    return issues.filter((iss) => {
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matches =
          iss.id.toLowerCase().includes(q) ||
          iss.issue_type.toLowerCase().includes(q) ||
          iss.location_text.toLowerCase().includes(q) ||
          (iss.assigned_to && iss.assigned_to.toLowerCase().includes(q));
        if (!matches) return false;
      }
      if (selectedPriority && iss.priority_level !== selectedPriority) return false;
      if (selectedStatus && iss.status !== selectedStatus) return false;
      if (selectedCategory && iss.category !== selectedCategory) return false;
      return true;
    });
  }, [issues, searchTerm, selectedPriority, selectedStatus, selectedCategory]);

  // =========================================================================
  // VIEW 1: DEDICATED LOGIN GATEWAY WITH CITIZENS AND ALL OTHER SECTIONS
  // =========================================================================
  if (!isAdminOrAuthority || showLoginModal) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in">
        {/* Gateway Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-900 text-teal-400 text-xs font-semibold shadow-xs">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>CivicAI Operations & Multi-Section Command Gateway</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Civic Operations & Section Login
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Unified access portal for <strong>Citizens</strong>, <strong>Municipal Authorities</strong>, <strong>Field Squads</strong>, and <strong>Campus Facilities</strong>.
          </p>
        </div>

        {/* Section Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
          <button
            type="button"
            onClick={() => {
              setSelectedSection('admin');
              setEmailInput('admin.delhi@civicai.org');
            }}
            className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 ${
              selectedSection === 'admin'
                ? 'border-teal-600 bg-teal-50/70 shadow-sm ring-2 ring-teal-500/20'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-teal-700 text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Municipal Admin</p>
              <p className="text-[10px] text-slate-500">City Command Center</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedSection('user');
              setEmailInput('aarav.sharma@example.in');
            }}
            className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 ${
              selectedSection === 'user'
                ? 'border-blue-600 bg-blue-50/70 shadow-sm ring-2 ring-blue-500/20'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Citizen / Resident</p>
              <p className="text-[10px] text-slate-500">Public Grievance Portal</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedSection('authority');
              setEmailInput('officer.verma@mcd.gov.in');
            }}
            className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 ${
              selectedSection === 'authority'
                ? 'border-indigo-600 bg-indigo-50/70 shadow-sm ring-2 ring-indigo-500/20'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Field Officer</p>
              <p className="text-[10px] text-slate-500">Dispatch & Resolution</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedSection('institution');
              setEmailInput('facilities@brcm.edu.in');
            }}
            className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 ${
              selectedSection === 'institution'
                ? 'border-amber-600 bg-amber-50/70 shadow-sm ring-2 ring-amber-500/20'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Campus & Society</p>
              <p className="text-[10px] text-slate-500">Colleges & RWAs</p>
            </div>
          </button>
        </div>

        {isAdminOrAuthority && showLoginModal && (
          <div className="flex justify-end max-w-xl mx-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowLoginModal(false)}
            >
              ← Return to Operations Console
            </Button>
          </div>
        )}

        {/* Main Section Authentication Container */}
        <div className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-teal-400 flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {selectedSection === 'admin'
                    ? 'Municipal Administrator Login'
                    : selectedSection === 'user'
                    ? 'Citizen Portal Access'
                    : selectedSection === 'authority'
                    ? 'Field Response Officer Login'
                    : 'Campus / Society Facility Login'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Authorized section login for {currentCity.name} jurisdiction
                </p>
              </div>
            </div>

            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-600">
              {selectedSection}
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Official Identifier / Email
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Security Password
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 font-medium"
              />
            </div>

            {loginError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoggingIn}
              className="w-full font-bold shadow-md shadow-teal-700/20"
              leftIcon={<LogIn className="w-4 h-4" />}
            >
              <span>
                {selectedSection === 'user'
                  ? 'Access Citizen Section'
                  : 'Enter Operational Console'}
              </span>
            </Button>
          </form>

          {/* Citizen Dedicated Options inside the same login page */}
          {selectedSection === 'user' && (
            <div className="bg-blue-50/70 rounded-2xl p-4 border border-blue-200/80 space-y-2.5">
              <p className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-700" />
                <span>Citizen Quick Actions</span>
              </p>
              <p className="text-[11px] text-blue-700 leading-relaxed">
                As a citizen, you can track your registered civic complaints or submit a new infrastructure issue with one click:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    handleSectionLogin('user');
                    navigate('/dashboard');
                  }}
                  className="px-3 py-2 bg-white text-blue-700 hover:bg-blue-100 font-semibold rounded-xl text-xs border border-blue-200 transition-colors text-center"
                >
                  View My Reports →
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleSectionLogin('user');
                    navigate('/report');
                  }}
                  className="px-3 py-2 bg-teal-600 text-white hover:bg-teal-700 font-semibold rounded-xl text-xs shadow-xs transition-colors text-center"
                >
                  Report a Problem Now →
                </button>
              </div>
            </div>
          )}

          {/* Fast 1-Click Demo Buttons for All Sections */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center">
              ⚡ 1-Click Fast Demo Login for All Sections
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleSectionLogin('admin')}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-teal-50 border border-slate-200 text-slate-700 hover:text-teal-700 text-center transition-colors flex flex-col items-center gap-1"
              >
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span className="text-[10px] font-bold">MCD Admin</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleSectionLogin('user');
                  navigate('/dashboard');
                }}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 text-slate-700 hover:text-blue-700 text-center transition-colors flex flex-col items-center gap-1"
              >
                <User className="w-4 h-4 text-blue-600" />
                <span className="text-[10px] font-bold">Citizen</span>
              </button>

              <button
                type="button"
                onClick={() => handleSectionLogin('authority')}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 text-slate-700 hover:text-indigo-700 text-center transition-colors flex flex-col items-center gap-1"
              >
                <Wrench className="w-4 h-4 text-indigo-600" />
                <span className="text-[10px] font-bold">Field Officer</span>
              </button>

              <button
                type="button"
                onClick={() => handleSectionLogin('admin', 'facilities@brcm.edu.in')}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 text-slate-700 hover:text-amber-700 text-center transition-colors flex flex-col items-center gap-1"
              >
                <Building2 className="w-4 h-4 text-amber-600" />
                <span className="text-[10px] font-bold">BRCM Campus</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: AUTHENTICATED MUNICIPAL OPERATIONS & TRIAGE DASHBOARD
  // =========================================================================
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-teal-400 font-mono text-xs uppercase font-bold tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Municipal Operations Command Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {currentCity.name} Civic Operations
            </h1>
            <p className="text-xs text-slate-400">
              Authority control console • Algorithmic triage, field dispatch & resolution auditing
            </p>
          </div>

          {/* Controls: Active Role & Switch Section */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-teal-300 font-mono flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-teal-400" />
              <span className="capitalize">{role === 'admin' ? 'City Admin' : 'Field Officer'}</span>
            </span>

            <button
              onClick={() => setShowLoginModal(true)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-600 flex items-center gap-1.5 transition-colors"
              title="Switch to Citizen, Field Officer or Campus Section"
            >
              <LogOut className="w-3.5 h-3.5 text-amber-400" />
              <span>Switch Section</span>
            </button>
          </div>
        </div>

        {/* Demo KPI Summary Cards (Requirement 32) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-6 relative z-10 border-t border-slate-800 mt-6">
          <div className="bg-slate-800/80 rounded-2xl p-3.5 border border-slate-700">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Total Issues</span>
            <p className="text-xl font-extrabold font-mono text-white mt-1">12,482</p>
            <span className="text-[10px] text-slate-500">Zonal Registry</span>
          </div>

          <div className="bg-slate-800/80 rounded-2xl p-3.5 border border-rose-900/60">
            <span className="text-[10px] font-bold text-rose-400 uppercase">Critical (P1)</span>
            <p className="text-xl font-extrabold font-mono text-rose-400 mt-1">327</p>
            <span className="text-[10px] text-slate-500">Immediate Action</span>
          </div>

          <div className="bg-slate-800/80 rounded-2xl p-3.5 border border-blue-900/60">
            <span className="text-[10px] font-bold text-blue-400 uppercase">Pending</span>
            <p className="text-xl font-extrabold font-mono text-blue-400 mt-1">1,204</p>
            <span className="text-[10px] text-slate-500">Unassigned</span>
          </div>

          <div className="bg-slate-800/80 rounded-2xl p-3.5 border border-amber-900/60">
            <span className="text-[10px] font-bold text-amber-400 uppercase">In Progress</span>
            <p className="text-xl font-extrabold font-mono text-amber-400 mt-1">582</p>
            <span className="text-[10px] text-slate-500">Dispatched Squads</span>
          </div>

          <div className="bg-slate-800/80 rounded-2xl p-3.5 border border-emerald-900/60">
            <span className="text-[10px] font-bold text-emerald-400 uppercase">Resolved</span>
            <p className="text-xl font-extrabold font-mono text-emerald-400 mt-1">9,856</p>
            <span className="text-[10px] text-slate-500">Evidence Verified</span>
          </div>
        </div>

        <p className="text-[10px] text-slate-500 mt-3 flex items-center gap-1">
          <Info className="w-3 h-3" />
          <span>Top summary metric metrics represent sample cumulative city division telemetry.</span>
        </p>
      </div>

      {/* Triage Search & Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <h3 className="font-bold text-slate-900 text-sm">
            Active Incident Triage ({filteredIssues.length} Tickets)
          </h3>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                aria-label="Search incidents"
                placeholder="Search ticket, officer, place..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
              />
            </div>

            {/* Category Filter */}
            <select
              aria-label="Filter by category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as IssueCategory | '')}
              className="px-2.5 py-1.5 text-xs bg-slate-50 rounded-xl border border-slate-200 text-slate-700 font-medium"
            >
              <option value="">All Categories</option>
              <option value="Road Infrastructure">Road Infrastructure</option>
              <option value="Solid Waste Management">Solid Waste Management</option>
              <option value="Water & Drainage">Water & Drainage</option>
              <option value="Lighting & Electricity">Lighting & Electricity</option>
              <option value="Public Infrastructure">Public Infrastructure</option>
              <option value="Environment & Greenery">Environment & Greenery</option>
              <option value="Other">Other</option>
            </select>

            {/* Priority Filter */}
            <select
              aria-label="Filter by priority"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value as PriorityLevel | '')}
              className="px-2.5 py-1.5 text-xs bg-slate-50 rounded-xl border border-slate-200 text-slate-700 font-medium"
            >
              <option value="">All Priorities</option>
              <option value="P1">P1 Critical</option>
              <option value="P2">P2 High</option>
              <option value="P3">P3 Medium</option>
              <option value="P4">P4 Low</option>
            </select>

            {/* Status Filter */}
            <select
              aria-label="Filter by status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as IssueStatus | '')}
              className="px-2.5 py-1.5 text-xs bg-slate-50 rounded-xl border border-slate-200 text-slate-700 font-medium"
            >
              <option value="">All Statuses</option>
              <option value="Reported">Reported</option>
              <option value="Verified">Verified</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>

            {/* Reset Filters */}
            {(searchTerm || selectedPriority || selectedStatus || selectedCategory) && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedPriority('');
                  setSelectedStatus('');
                  setSelectedCategory('');
                }}
                className="px-2.5 py-1.5 text-xs text-teal-700 hover:text-teal-900 font-semibold"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Triage Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Ticket</th>
                <th className="py-3 px-4">Problem & Category</th>
                <th className="py-3 px-4">Priority / AI Score</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Lifecycle Status</th>
                <th className="py-3 px-4">Assigned Unit</th>
                <th className="py-3 px-4 text-right">Municipal Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <div className="inline-block w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mb-2" />
                    <p className="font-semibold text-xs text-slate-600">Loading incident tickets...</p>
                  </td>
                </tr>
              ) : filteredIssues.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <AlertTriangle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-sm text-slate-700">No incident tickets match your filters</p>
                    <p className="text-xs text-slate-400 mt-1">Try clearing your search query or filter selections</p>
                  </td>
                </tr>
              ) : (
                filteredIssues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Ticket & Photo */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={issue.image_url}
                          alt={issue.issue_type}
                          className="w-11 h-11 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                        />
                        <div>
                          <span className="font-mono font-bold text-slate-900">{issue.id}</span>
                          <p className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatIndianDate(issue.created_at)}</span>
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Problem & Category */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{issue.issue_type}</div>
                      <span className="text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded font-medium">
                        {issue.category}
                      </span>
                    </td>

                    {/* Priority / AI */}
                    <td className="py-3 px-4">
                      <PriorityBadge
                        level={issue.priority_level}
                        score={issue.priority_score}
                        showScore={true}
                      />
                      <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                        <span>AI Conf: <strong>{issue.ai_confidence}%</strong></span>
                      </p>
                    </td>

                    {/* Location */}
                    <td className="py-3 px-4 max-w-xs">
                      <div className="truncate font-semibold text-slate-800 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span className="truncate">{issue.location_text}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 ml-4.5">{issue.city}, {issue.state}</span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <StatusBadge status={issue.status} />
                    </td>

                    {/* Assigned Unit */}
                    <td className="py-3 px-4 max-w-[150px]">
                      {issue.assigned_to ? (
                        <span className="text-slate-800 font-medium truncate block">
                          {issue.assigned_to}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Unassigned</span>
                      )}
                    </td>

                    {/* Municipal Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View */}
                        <button
                          onClick={() => navigate(`/issue/${issue.id}`)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                          title="View Full Ticket"
                          aria-label={`View full ticket ${issue.id}`}
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Status Update Button */}
                        <button
                          onClick={() => setActiveIssueForStatus(issue)}
                          className="p-1.5 rounded-lg text-teal-700 hover:bg-teal-50 border border-teal-200 transition-colors"
                          title="Change Status / Assign"
                          aria-label={`Change status or assign ticket ${issue.id}`}
                        >
                          <Wrench className="w-4 h-4" />
                        </button>

                        {/* Resolution Evidence Upload */}
                        {issue.status !== 'Resolved' ? (
                          <button
                            onClick={() => setActiveIssueForResolution(issue)}
                            className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] flex items-center gap-1 shadow-sm transition-colors"
                            title="Upload Resolution Photo"
                            aria-label={`Upload resolution photo for ticket ${issue.id}`}
                          >
                            <FileCheck2 className="w-3.5 h-3.5" />
                            <span>Resolve</span>
                          </button>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Verified
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Modals */}
      <StatusUpdateModal
        isOpen={Boolean(activeIssueForStatus)}
        onClose={() => setActiveIssueForStatus(null)}
        issue={activeIssueForStatus}
        onUpdateStatus={updateIssueStatus}
      />

      <ResolutionEvidenceModal
        isOpen={Boolean(activeIssueForResolution)}
        onClose={() => setActiveIssueForResolution(null)}
        issue={activeIssueForResolution}
        onResolveWithEvidence={addResolutionEvidence}
      />
    </div>
  );
};
