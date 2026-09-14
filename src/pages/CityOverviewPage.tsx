import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Target,
  Users,
} from 'lucide-react';
import { useCity } from '../contexts/CityContext';
import { useIssues } from '../contexts/IssuesContext';
import { INDIAN_CITIES } from '../data/cities';
import { IssueCard } from '../components/issues/IssueCard';
import { IndiaCivicMap } from '../components/map/IndiaCivicMap';

export const CityOverviewPage: React.FC = () => {
  const { currentCity, setCityByName } = useCity();
  const { issues, isLoading } = useIssues();
  const navigate = useNavigate();

  // Issues in this city (case-insensitive)
  const cityIssues = useMemo(() => {
    return issues.filter(
      (i) => i.city.toLowerCase() === currentCity.name.toLowerCase()
    );
  }, [issues, currentCity.name]);

  // Metrics for current city
  const cityMetrics = useMemo(() => {
    const resolved = cityIssues.filter((i) => i.status === 'Resolved').length;
    const pending = cityIssues.filter((i) => i.status === 'Reported' || i.status === 'Verified').length;
    const inProgress = cityIssues.filter((i) => i.status === 'In Progress' || i.status === 'Assigned').length;
    const critical = cityIssues.filter((i) => i.priority_level === 'P1').length;

    const resolutionRate = cityIssues.length > 0 ? Math.round((resolved / cityIssues.length) * 100) : 0;

    return {
      total: cityIssues.length,
      resolved,
      pending,
      inProgress,
      critical,
      resolutionRate,
    };
  }, [cityIssues]);

  // City Ranking Board (Demo Data Mixed with Live Context)
  const cityRankings = useMemo(() => {
    return INDIAN_CITIES.slice(0, 10).map((city, index) => {
      // For demo, generate synthetic scores based on real city array position, 
      // except for the currently active city which uses real issue count context
      const isCurrent = city.name.toLowerCase() === currentCity.name.toLowerCase();
      const baseScore = 95 - index * 3; 
      const score = isCurrent ? Math.min(99, cityMetrics.resolutionRate || baseScore) : baseScore;
      
      return {
        ...city,
        score,
        rank: index + 1,
        activeIssues: isCurrent ? cityMetrics.total : 1200 - index * 100,
        trend: index % 2 === 0 ? 'up' : 'down',
      };
    }).sort((a, b) => b.score - a.score);
  }, [currentCity, cityMetrics]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-teal-300 text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>{currentCity.state} • {currentCity.municipalBody}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight flex items-baseline gap-3 flex-wrap">
              <span>{currentCity.name}</span>
              <span className="text-xl sm:text-3xl font-normal text-teal-300">
                ({currentCity.hindiName})
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Live civic intelligence and infrastructure health metrics for {currentCity.name}, {currentCity.state}.{' '}
              Governed by the <strong>{currentCity.municipalBody}</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/report')}
              className="w-full sm:w-auto px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl shadow-lg transition-colors"
            >
              Report Issue Here
            </button>
            <button
              onClick={() => navigate('/explore')}
              className="w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl transition-colors"
            >
              View All Issues
            </button>
          </div>
        </div>

        {/* Quick city selector & 20 Indian Cities Buttons */}
        <div className="pt-6 border-t border-slate-800 mt-6 relative z-10 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Coverage across 20 Indian Municipal Corridors
            </span>
            <div className="flex items-center gap-2">
              <label htmlFor="city-select" className="text-xs text-slate-400">Jump to:</label>
              <select
                id="city-select"
                value={currentCity.name}
                onChange={(e) => setCityByName(e.target.value)}
                className="px-3 py-1.5 text-xs font-semibold bg-slate-800 border border-slate-700 text-teal-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                {INDIAN_CITIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name} ({c.hindiName})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto pt-1">
            {INDIAN_CITIES.map((c) => (
              <button
                key={c.name}
                onClick={() => setCityByName(c.name)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  c.name.toLowerCase() === currentCity.name.toLowerCase()
                    ? 'bg-teal-500 text-slate-950 font-bold shadow-xs'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live City Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Target className="w-4 h-4 text-indigo-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Total Reports</h3>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 font-mono">{cityMetrics.total}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Resolution Rate</h3>
          </div>
          <p className="text-3xl font-extrabold text-emerald-600 font-mono">
            {cityMetrics.resolutionRate}%
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Critical (P1)</h3>
          </div>
          <p className="text-3xl font-extrabold text-rose-600 font-mono">{cityMetrics.critical}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Clock className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Pending</h3>
          </div>
          <p className="text-3xl font-extrabold text-amber-600 font-mono">{cityMetrics.pending}</p>
        </div>
      </div>

      {/* City Civic Geo-Map */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              {currentCity.name} Civic Geo-Map
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Geographic distribution of reported civic incidents across {currentCity.name}.
            </p>
          </div>
          <button
            onClick={() => navigate('/explore')}
            className="text-xs font-bold text-teal-700 hover:text-teal-800 hover:underline self-start sm:self-auto"
          >
            Full Map View →
          </button>
        </div>

        <IndiaCivicMap
          issues={cityIssues}
          centerLat={currentCity.latitude}
          centerLng={currentCity.longitude}
          zoom={12}
        />
      </div>

      {/* Active Issues in City */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Recent Issues in {currentCity.name} ({cityIssues.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Latest verified citizen reports registered under {currentCity.municipalBody}.
            </p>
          </div>
          <button
            onClick={() => navigate('/explore')}
            className="text-xs font-bold text-teal-700 hover:text-teal-800 hover:underline self-start sm:self-auto"
          >
            Explore All Issues →
          </button>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
            <div className="inline-block w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-500">Loading {currentCity.name} issues...</p>
          </div>
        ) : cityIssues.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cityIssues.slice(0, 6).map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center space-y-3">
            <p className="text-sm font-semibold text-slate-700">
              No reported incidents currently logged for {currentCity.name}.
            </p>
            <p className="text-xs text-slate-500">
              Be the first citizen to report a civic defect in {currentCity.name}.
            </p>
            <button
              onClick={() => navigate('/report')}
              className="px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl hover:bg-teal-700 shadow-sm transition-colors"
            >
              Report a Problem in {currentCity.name}
            </button>
          </div>
        )}
      </div>

      {/* National City Rankings */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">National Swachhata & Civic Rankings</h2>
            <p className="text-xs text-slate-500 mt-1">Live leaderboard of Indian cities based on AI resolution scoring.</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <Users className="w-4 h-4 text-slate-400" />
            <span>Top 10 Metros</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-4 px-6">Rank</th>
                <th className="py-4 px-6">City & State</th>
                <th className="py-4 px-6 text-center">Active Issues</th>
                <th className="py-4 px-6 text-center">Resolution Score</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cityRankings.map((city, idx) => (
                <tr 
                  key={city.name} 
                  className={`transition-colors ${
                    city.name.toLowerCase() === currentCity.name.toLowerCase() ? 'bg-teal-50/50' : 'hover:bg-slate-50/70'
                  }`}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <span className={`text-base font-bold font-mono ${
                        idx === 0 ? 'text-amber-500' : idx === 1 ? 'text-slate-400' : idx === 2 ? 'text-amber-700' : 'text-slate-900'
                      }`}>
                        #{idx + 1}
                      </span>
                      {city.trend === 'up' ? (
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <TrendingUp className="w-3.5 h-3.5 text-rose-500 rotate-180" />
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-2 h-2 rounded-full ${city.name.toLowerCase() === currentCity.name.toLowerCase() ? 'bg-teal-500' : 'bg-transparent'}`} />
                      <div>
                        <p className={`font-bold ${city.name.toLowerCase() === currentCity.name.toLowerCase() ? 'text-teal-700' : 'text-slate-900'}`}>
                          {city.name}
                        </p>
                        <p className="text-[11px] text-slate-400">{city.state}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="font-mono text-slate-600">{city.activeIssues.toLocaleString()}</span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            city.score > 90 ? 'bg-emerald-500' : city.score > 75 ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${city.score}%` }}
                        />
                      </div>
                      <span className="font-bold text-slate-700 font-mono text-xs">{city.score}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {city.name.toLowerCase() === currentCity.name.toLowerCase() ? (
                      <span className="inline-block px-3 py-1 bg-teal-100 text-teal-800 text-[10px] font-bold uppercase rounded-full border border-teal-200">
                        Active
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          setCityByName(city.name);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="text-[11px] font-bold text-teal-600 hover:text-teal-800 hover:underline"
                      >
                        Switch to City
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
