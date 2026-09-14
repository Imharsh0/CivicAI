import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera,
  Cpu,
  TrendingUp,
  Send,
  CheckCircle,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building,
  Users,
  Car,
  Trash2,
  Droplets,
  Zap,
  Building2,
  Trees,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCity } from '../contexts/CityContext';
import { Button } from '../components/common/Button';
import { CIVIC_CATEGORIES } from '../data/categories';
import { INDIAN_CITIES } from '../data/cities';

export const HomePage: React.FC = () => {
  const { t, language } = useLanguage();
  const { currentCity, setCityByName } = useCity();
  const navigate = useNavigate();

  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Car,
    Trash2,
    Droplets,
    Zap,
    Building2,
    Trees,
  };

  const steps = [
    {
      num: '01',
      title: 'Capture',
      hiTitle: 'फोटो लें',
      desc: 'Snap an image with your smartphone camera or upload from gallery.',
      hiDesc: 'अपने स्मार्टफोन कैमरे से तस्वीर लें या गैलरी से अपलोड करें।',
      icon: Camera,
      color: 'from-teal-500 to-teal-700',
    },
    {
      num: '02',
      title: 'AI Analysis',
      hiTitle: 'एआई विश्लेषण',
      desc: 'Vision AI identifies the civic defect, measures severity, and pinpoints hazards.',
      hiDesc: 'विज़न एआई नागरिक समस्या की पहचान करता है, गंभीरता मापता है और खतरों को चिन्हित करता है।',
      icon: Cpu,
      color: 'from-indigo-500 to-indigo-700',
    },
    {
      num: '03',
      title: 'Prioritize',
      hiTitle: 'प्राथमिकता तय करें',
      desc: 'Algorithmic engine assigns an objective score (P1–P4) based on safety risk.',
      hiDesc: 'एल्गोरिदम सुरक्षा जोखिम के आधार पर वस्तुनिष्ठ स्कोर (P1–P4) निर्धारित करता है।',
      icon: TrendingUp,
      color: 'from-amber-500 to-amber-700',
    },
    {
      num: '04',
      title: 'Report',
      hiTitle: 'रिपोर्ट सबमिट',
      desc: 'Directly logged to the relevant zonal municipal corporation or campus unit.',
      hiDesc: 'संबंधित जोनल नगर निगम या परिसर इकाई में सीधे दर्ज की जाती है।',
      icon: Send,
      color: 'from-blue-500 to-blue-700',
    },
    {
      num: '05',
      title: 'Resolve',
      hiTitle: 'समाधान एवं प्रमाण',
      desc: 'Field engineers execute repairs and upload Before/After photo evidence.',
      hiDesc: 'फील्ड इंजीनियर मरम्मत करते हैं और पहले/बाद की फोटो का प्रमाण अपलोड करते हैं।',
      icon: CheckCircle,
      color: 'from-emerald-500 to-emerald-700',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-16 overflow-hidden bg-gradient-to-b from-teal-50/60 via-slate-50/40 to-white">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0d948808_1px,transparent_1px),linear-gradient(to_bottom,#0d948808_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center space-y-6 sm:space-y-8">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100/80 border border-teal-200 text-teal-900 text-xs font-semibold shadow-xs">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>AI-Driven Municipal Action Platform for Indian Metros & Campuses</span>
          </div>

          {/* Main Headline */}
          <div className="max-w-4xl mx-auto space-y-3">
            <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              “See a problem. <span className="text-teal-600">Report it.</span>
              <br className="hidden sm:inline" /> Let AI take it forward.”
            </h1>
            <p className="text-base sm:text-xl text-slate-600 font-normal max-w-2xl mx-auto leading-relaxed">
              {t.subTagline}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/report')}
              leftIcon={<Camera className="w-5 h-5" />}
              className="w-full sm:w-auto text-sm sm:text-base px-8 py-4 shadow-lg shadow-teal-700/25 hover:shadow-xl hover:shadow-teal-700/30"
            >
              {t.reportProblem}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/explore')}
              rightIcon={<ArrowRight className="w-5 h-5 text-slate-400" />}
              className="w-full sm:w-auto text-sm sm:text-base px-8 py-4"
            >
              {t.exploreIssues}
            </Button>
          </div>

          {/* City Quick Picker Strip */}
          <div className="pt-8 max-w-3xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>{t.selectCity}</span>
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {INDIAN_CITIES.slice(0, 10).map((city) => (
                <button
                  key={city.name}
                  type="button"
                  onClick={() => setCityByName(city.name)}
                  aria-pressed={city.name === currentCity.name}
                  aria-label={city.name}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    city.name === currentCity.name
                      ? 'bg-teal-700 text-white font-bold shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-700 hover:border-teal-400 hover:text-teal-700'
                  }`}
                >
                  {language === 'hi' ? city.hindiName : city.name}
                </button>
              ))}
              <button
                type="button"
                onClick={() => navigate('/city')}
                aria-label="View all Indian cities"
                className="px-3 py-1.5 rounded-full text-xs font-semibold text-teal-600 hover:underline"
              >
                {language === 'hi' ? `+${INDIAN_CITIES.length - 10} अन्य शहर →` : `+${INDIAN_CITIES.length - 10} More →`}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Live Impact Stats Counters */}
      <section aria-label="Platform Impact Statistics" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="pt-3 md:pt-0">
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono">14,280+</p>
              <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Issues Reported</p>
            </div>
            <div className="pt-3 md:pt-0">
              <p className="text-3xl sm:text-4xl font-extrabold text-teal-600 font-mono">94.8%</p>
              <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">AI Accuracy Rate</p>
            </div>
            <div className="pt-3 md:pt-0">
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-600 font-mono">11,890</p>
              <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Verified Resolutions</p>
            </div>
            <div className="pt-3 md:pt-0">
              <p className="text-3xl sm:text-4xl font-extrabold text-amber-600 font-mono">&lt; 36 hrs</p>
              <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Avg P1 Resolution Time</p>
            </div>
          </div>
        </div>
      </section>

      {/* How CivicAI Works (5 Steps) */}
      <section aria-label="How CivicAI Works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full inline-block">
            Seamless Workflow
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {t.howItWorks}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            From smartphone capture to on-ground municipal resolution proof in five transparent steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-teal-400/50 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-300 group-hover:text-teal-600 transition-colors">
                    {step.num}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 text-base">
                    {language === 'hi' ? step.hiTitle : step.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {language === 'hi' ? step.hiDesc : step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* What CivicAI Detects (6 Core Categories) */}
      <section aria-label="What CivicAI Detects" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full inline-block">
            Omni-Category Detection
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {t.whatWeDetect}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Our computer-vision engine accurately categorizes public infrastructure anomalies across India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CIVIC_CATEGORIES.map((cat) => {
            const Icon = iconMap[cat.icon] || Car;
            return (
              <div
                key={cat.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      {language === 'hi' ? cat.hindiName : cat.name}
                    </h3>
                    <p className="text-[11px] text-slate-400">Indian Civic Domain</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {cat.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                  {cat.examples.map((ex) => (
                    <span
                      key={ex}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-50 text-slate-700 border border-slate-200/60"
                    >
                      • {ex}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Universal Institutional Support (Colleges, RWAs, Tech Parks, Municipal Zones) */}
      <section aria-label="Institutional and Campus Coverage" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden space-y-6">
          <div className="max-w-2xl space-y-3 relative z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-950/80 px-3 py-1 rounded-full border border-teal-800">
              Beyond City Municipalities
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              One Engine for Municipalities, Colleges, RWAs & Campuses
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              CivicAI is not restricted to any single institution. Whether managing a 200-acre university campus (like BRCM), a gated residential colony, an IT corridor (like Hinjewadi), or an entire municipal zone, CivicAI routes issues to the right facilities team instantly.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10 pt-4">
            <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-1">
              <Building className="w-5 h-5 text-teal-400 mb-2" />
              <p className="font-bold text-sm">Municipal Zones</p>
              <p className="text-[11px] text-slate-400">MCD, BMC, BBMP, GHMC</p>
            </div>
            <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-1">
              <Users className="w-5 h-5 text-indigo-400 mb-2" />
              <p className="font-bold text-sm">Colleges & Schools</p>
              <p className="text-[11px] text-slate-400">Campus Facilities & Hostels</p>
            </div>
            <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-1">
              <Building2 className="w-5 h-5 text-amber-400 mb-2" />
              <p className="font-bold text-sm">Housing Societies</p>
              <p className="text-[11px] text-slate-400">RWAs & Residential Enclaves</p>
            </div>
            <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-1">
              <ShieldCheck className="w-5 h-5 text-emerald-400 mb-2" />
              <p className="font-bold text-sm">Tech & Office Parks</p>
              <p className="text-[11px] text-slate-400">Infrastructure Units</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
