import React from 'react';
import { Sparkles, Shield, Heart, Clock } from 'lucide-react';
import { formatIndianDate } from '../../utils/formatters';
import { useLanguage } from '../../contexts/LanguageContext';

export const Footer: React.FC = () => {
  const { language } = useLanguage();
  const currentDateFormatted = formatIndianDate(new Date());

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 transition-colors">
      {/* Subtle Indian Tricolor accent ribbon */}
      <div className="h-1 bg-gradient-to-r from-india-saffron via-white to-india-green opacity-90" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                CIVIC<span className="text-teal-400">AI</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800">
                Bharat
              </span>
            </div>

            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              {language === 'hi'
                ? '“समस्या देखें। रिपोर्ट करें। एआई को आगे बढ़ाने दें।” — भारतीय शहरों एवं संस्थानों के लिए एआई-संचालित नागरिक बुनियादी ढांचा निगरानी मंच।'
                : '“See a problem. Report it. Let AI take it forward.” — AI-powered civic problem detection, prioritization, and resolution platform for Indian cities.'}
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-teal-400" />
                <span>IST (UTC+5:30) • {currentDateFormatted}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Gov & Municipal Ready</span>
              </span>
            </div>
          </div>

          {/* Civic Helplines */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              National Civic Numbers
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center justify-between">
                <span>National Emergency:</span>
                <span className="font-mono font-bold text-amber-400">112</span>
              </li>
              <li className="flex items-center justify-between">
                <span>MCD Delhi Helpline:</span>
                <span className="font-mono font-bold text-teal-400">155304</span>
              </li>
              <li className="flex items-center justify-between">
                <span>BMC Mumbai Helpline:</span>
                <span className="font-mono font-bold text-teal-400">1916</span>
              </li>
              <li className="flex items-center justify-between">
                <span>BBMP Bengaluru Helpline:</span>
                <span className="font-mono font-bold text-teal-400">1533</span>
              </li>
            </ul>
          </div>

          {/* CivicAI Coverage */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Coverage & Campuses
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>20 Tier-1 & Tier-2 Indian Metros</li>
              <li>Colleges & Universities (e.g. BRCM)</li>
              <li>Housing Societies & RWA Clusters</li>
              <li>Municipal Wards & Tech Corridors</li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CivicAI India. Built for citizens, cities, and communities.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for cleaner, safer Indian cities</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
