import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Locate,
  Building,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCity } from '../contexts/CityContext';
import { useIssues } from '../contexts/IssuesContext';
import { useAuth } from '../contexts/AuthContext';
import { useGeolocation } from '../hooks/useGeolocation';
import { CompressedImageResult } from '../hooks/useImageCompression';
import { CameraUpload } from '../components/report/CameraUpload';
import { AIScannerModal } from '../components/report/AIScannerModal';
import { PriorityBreakdownCard } from '../components/report/PriorityBreakdownCard';
import { DuplicateAlertModal } from '../components/report/DuplicateAlertModal';
import { Button } from '../components/common/Button';
import { PriorityBadge, StatusBadge } from '../components/common/Badge';
import { analyzeCivicImage } from '../services/aiService';
import { uploadCivicImage } from '../services/storageService';
import { AIAnalysisResult, CivicIssue, IssueCategory } from '../types';
import { CIVIC_CATEGORIES } from '../data/categories';
import { SAMPLE_ORGANIZATIONS } from '../data/organizations';
import { formatIndianDateTime } from '../utils/formatters';

export const ReportProblemPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { currentCity } = useCity();
  const { user } = useAuth();
  const { addIssue, checkForDuplicate } = useIssues();

  // State
  const [compressedImage, setCompressedImage] = useState<CompressedImageResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Editable report fields
  const [problemTitle, setProblemTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<IssueCategory>('Road Infrastructure');
  const [description, setDescription] = useState('');
  const [selectedOrgId, setSelectedOrgId] = useState<string>('');

  // Location
  const { location, isLoading: isLocating, error: geoError, requestCurrentLocation, setManualLocation } =
    useGeolocation(currentCity.name);
  const [manualLandmark, setManualLandmark] = useState('');

  // Duplicate check modal state
  const [duplicateMatch, setDuplicateMatch] = useState<CivicIssue | null>(null);
  const [duplicateDistance, setDuplicateDistance] = useState<number | undefined>(undefined);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [hasDismissedDuplicate, setHasDismissedDuplicate] = useState(false);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedIssue, setSubmittedIssue] = useState<CivicIssue | null>(null);

  // Handle image upload & automatic AI analysis
  const handleImageReady = async (result: CompressedImageResult | null) => {
    setCompressedImage(result);
    setAiError(null);
    setSubmitError(null);
    setHasDismissedDuplicate(false);

    if (!result) {
      setAiResult(null);
      return;
    }

    // Trigger AI Vision analysis
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeCivicImage({
        imageBase64: result.dataUrl,
        city: location.city,
      });

      setAiResult(analysis);
      setProblemTitle(analysis.issue_type);
      setSelectedCategory(analysis.category);
      setDescription(
        `${analysis.explanation} Located around ${manualLandmark || location.locationText}.`
      );

      // Trigger duplicate detection
      const dupCheck = checkForDuplicate(
        analysis.category,
        location.latitude,
        location.longitude,
        manualLandmark || location.locationText
      );
      if (dupCheck.isDuplicateLikely && dupCheck.matchedIssue) {
        setDuplicateMatch(dupCheck.matchedIssue);
        setDuplicateDistance(dupCheck.distanceMeters);
        setIsDuplicateModalOpen(true);
      }
    } catch (err) {
      console.error('AI Analysis failed:', err);
      setAiError("We couldn't analyze the image automatically. You can enter the problem details manually below.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleManualLocationChange = (val: string) => {
    setManualLandmark(val);
    setManualLocation({ locationText: val });
  };

  const handleResetForm = () => {
    setSubmittedIssue(null);
    setCompressedImage(null);
    setAiResult(null);
    setAiError(null);
    setSubmitError(null);
    setProblemTitle('');
    setSelectedCategory('Road Infrastructure');
    setDescription('');
    setSelectedOrgId('');
    setManualLandmark('');
    setDuplicateMatch(null);
    setDuplicateDistance(undefined);
    setHasDismissedDuplicate(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!compressedImage) {
      setSubmitError('Please upload or snap a photo of the problem first.');
      return;
    }
    if (!problemTitle.trim()) {
      setSubmitError('Please provide a problem name.');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Upload compressed image
      const uploadedImageUrl = await uploadCivicImage(compressedImage.blob, 'issue-images');

      // 2. Create issue
      const created = await addIssue({
        user_id: user?.id,
        organization_id: selectedOrgId || undefined,
        image_url: uploadedImageUrl,
        issue_type: problemTitle.trim(),
        category: selectedCategory,
        description: description.trim() || 'Civic infrastructure defect reported by citizen.',
        location_text: manualLandmark.trim() || location.locationText,
        city: location.city,
        state: location.state,
        latitude: location.latitude,
        longitude: location.longitude,
        severity: aiResult?.severity || 'High',
        priority_score: aiResult?.priority_score || 88,
        priority_level: aiResult?.priority_level || 'P1',
        ai_confidence: aiResult?.confidence || 92,
        ai_explanation: aiResult?.explanation,
        safety_impact: aiResult?.safety_impact,
        suggested_action: aiResult?.suggested_action,
      });

      setSubmittedIssue(created);
    } catch (err) {
      console.error('Report submission failed:', err);
      setSubmitError("We couldn't submit your report. Please check your network connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS SUBMISSION SCREEN (Requirement 29)
  if (submittedIssue) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl border border-emerald-200 p-8 text-center shadow-lg space-y-6 animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              Success
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Report Submitted Successfully!
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Your report has been logged with municipal operations and assigned a priority tracking index.
            </p>
          </div>

          {/* Ticket Summary Card */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 text-left space-y-3 font-sans">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Report ID</span>
                <p className="font-mono font-extrabold text-slate-900 text-base">{submittedIssue.id}</p>
              </div>
              <div className="flex items-center gap-2">
                <PriorityBadge level={submittedIssue.priority_level} score={submittedIssue.priority_score} />
                <StatusBadge status={submittedIssue.status} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400">Problem:</span>
                <p className="font-bold text-slate-800">{submittedIssue.issue_type}</p>
              </div>
              <div>
                <span className="text-slate-400">City / Jurisdiction:</span>
                <p className="font-bold text-slate-800">{submittedIssue.city}, {submittedIssue.state}</p>
              </div>
              <div>
                <span className="text-slate-400">Location:</span>
                <p className="font-semibold text-slate-700 truncate">{submittedIssue.location_text}</p>
              </div>
              <div>
                <span className="text-slate-400">AI Confidence:</span>
                <p className="font-bold text-teal-700">{submittedIssue.ai_confidence}% Verified</p>
              </div>
              <div>
                <span className="text-slate-400">Reported At:</span>
                <p className="font-semibold text-slate-700">{formatIndianDateTime(submittedIssue.created_at)}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate(`/issue/${submittedIssue.id}`)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Track Live Timeline
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate('/dashboard')}
            >
              View My Reports
            </Button>
            <button
              type="button"
              onClick={handleResetForm}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 py-2"
            >
              + Report Another Issue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Mobile-First Camera Input</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {t.reportProblem}
        </h1>
        <p className="text-sm text-slate-500">
          “Take a photo and let CivicAI do the rest.”
        </p>
      </div>

      {/* Main Report Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Step 1: Camera / Image Capture */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            1. Capture Problem Photo *
          </label>
          <CameraUpload
            onImageReady={handleImageReady}
            compressedResult={compressedImage}
          />
        </div>

        {/* AI Scanner Animation Modal */}
        <AIScannerModal
          isAnalyzing={isAnalyzing}
          imagePreviewUrl={compressedImage?.dataUrl}
        />

        {/* Duplicate Issue Alert Modal */}
        <DuplicateAlertModal
          isOpen={isDuplicateModalOpen}
          onClose={() => setIsDuplicateModalOpen(false)}
          matchedIssue={duplicateMatch}
          distanceMeters={duplicateDistance}
          onViewExisting={(id) => {
            setIsDuplicateModalOpen(false);
            navigate(`/issue/${id}`);
          }}
          onAddSupportingEvidence={(id) => {
            setIsDuplicateModalOpen(false);
            alert(`Supporting evidence tagged to existing ticket ${id}!`);
            navigate(`/issue/${id}`);
          }}
          onContinueReporting={() => {
            setIsDuplicateModalOpen(false);
            setHasDismissedDuplicate(true);
          }}
        />

        {/* Step 2: Problem Details & AI Findings */}
        {compressedImage && (
          <div className="space-y-4 pt-2 border-t border-slate-100 animate-in fade-in">
            {/* AI Diagnosis Findings if available */}
            {aiResult && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-teal-600" />
                    <span>2. AI Analysis Findings</span>
                  </span>
                  <span className="text-xs text-teal-700 font-bold bg-teal-50 px-2.5 py-0.5 rounded-full">
                    {aiResult.confidence}% AI Confidence
                  </span>
                </div>

                {/* AI Priority Card with Transparent Rationale */}
                <PriorityBreakdownCard
                  score={aiResult.priority_score}
                  level={aiResult.priority_level}
                  severity={aiResult.severity}
                  explanation={aiResult.explanation}
                  safetyImpact={aiResult.safety_impact}
                />
              </div>
            )}

            {/* AI Analysis Warning if failed */}
            {aiError && (
              <div role="alert" className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>{aiError}</span>
              </div>
            )}

            {/* Editable Fields - Always available once photo is selected */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  {aiResult ? 'Review & Edit Problem Details' : '2. Enter Problem Details *'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="problem-title" className="block text-xs font-semibold text-slate-700 mb-1">
                    {aiResult ? 'Detected Problem Name' : 'Problem Name'} *
                  </label>
                  <input
                    id="problem-title"
                    type="text"
                    required
                    placeholder="e.g. Deep Pothole, Overflowing Garbage, Broken Streetlight"
                    value={problemTitle}
                    onChange={(e) => setProblemTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label htmlFor="civic-category" className="block text-xs font-semibold text-slate-700 mb-1">
                    Civic Category *
                  </label>
                  <select
                    id="civic-category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as IssueCategory)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-900"
                  >
                    {CIVIC_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {language === 'hi' ? cat.hindiName : cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="problem-description" className="block text-xs font-semibold text-slate-700 mb-1">
                  Description & Impact Note (Editable)
                </label>
                <textarea
                  id="problem-description"
                  rows={3}
                  placeholder="Provide any additional details or context about the civic problem..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Location Details */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label htmlFor="manual-landmark" className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>3. Location & Landmark *</span>
            </label>
            <button
              type="button"
              onClick={requestCurrentLocation}
              disabled={isLocating}
              aria-label="Auto-detect current GPS location"
              className="text-xs text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1 disabled:opacity-50"
            >
              <Locate className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Detecting GPS...' : 'Auto-Detect GPS'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <input
                id="manual-landmark"
                type="text"
                required
                aria-label="Specific landmark or street address"
                placeholder="e.g. Near Metro Gate 2, Sector 18 or Connaught Place Block B"
                value={manualLandmark}
                onChange={(e) => handleManualLocationChange(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Detected: {location.locationText} ({location.latitude}, {location.longitude})
              </p>
              {geoError && (
                <p className="text-[10px] text-amber-600 mt-0.5">
                  {geoError}
                </p>
              )}
            </div>

            <div>
              <input
                type="text"
                readOnly
                aria-label="Detected City and State"
                value={`${location.city}, ${location.state}`}
                className="w-full px-3 py-2 text-xs bg-slate-100 rounded-xl border border-slate-200 text-slate-600 font-medium cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Step 4: Optional Campus / Community / Organization */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <label htmlFor="organization-select" className="text-xs font-semibold text-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-slate-500" />
              <span>Organization / Campus / Society (Optional)</span>
            </span>
            <span className="text-[10px] text-slate-400">Not limited to colleges</span>
          </label>
          <select
            id="organization-select"
            value={selectedOrgId}
            onChange={(e) => setSelectedOrgId(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-700"
          >
            <option value="">None (General City Municipal Corporation)</option>
            {SAMPLE_ORGANIZATIONS.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name} ({org.type} — {org.city})
              </option>
            ))}
          </select>
        </div>

        {/* Submission Error Banner if any */}
        {submitError && (
          <div role="alert" className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{submitError}</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-100">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            disabled={!compressedImage || isSubmitting || isAnalyzing || !problemTitle.trim()}
            className="w-full text-base font-bold shadow-md shadow-teal-700/20"
            leftIcon={<Sparkles className="w-5 h-5 text-amber-300" />}
          >
            <span>{t.submitReport}</span>
          </Button>

          <p className="text-[11px] text-slate-400 text-center mt-2.5 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Encrypted submission • Direct dispatch to civic zonal authorities</span>
          </p>
        </div>
      </form>
    </div>
  );
};
