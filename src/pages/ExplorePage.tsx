import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIssues } from '../contexts/IssuesContext';
import { useCity } from '../contexts/CityContext';
import { useLanguage } from '../contexts/LanguageContext';
import { IndiaCivicMap } from '../components/map/IndiaCivicMap';
import { IssueCard } from '../components/issues/IssueCard';
import { Button } from '../components/common/Button';
import { Map, List, Search, Filter, SlidersHorizontal, MapPin, Grid, PlusCircle } from 'lucide-react';
import { CIVIC_CATEGORIES } from '../data/categories';
import { IssueFilters } from '../components/issues/IssueFilters';

export const ExplorePage: React.FC = () => {
  const { issues } = useIssues();
  const { currentCity } = useCity();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // If the path is /map, default to map mode, otherwise list mode
  const initialMode = location.pathname === '/map' ? 'map' : 'grid';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [activeView, setActiveView] = useState<'grid' | 'map'>(initialMode);

  // Filter issues
  const filteredIssues = useMemo(() => {
    return issues.filter((iss) => {
      // Search term
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesType = iss.issue_type.toLowerCase().includes(query);
        const matchesLoc = iss.location_text.toLowerCase().includes(query);
        const matchesId = iss.id.toLowerCase().includes(query);
        if (!matchesType && !matchesLoc && !matchesId) return false;
      }
      // Category
      if (selectedCategory && iss.category !== selectedCategory) {
        return false;
      }
      // Priority
      if (selectedPriority && iss.priority_level !== selectedPriority) {
        return false;
      }
      // Status
      if (selectedStatus && iss.status !== selectedStatus) {
        return false;
      }
      return true;
    });
  }, [issues, searchTerm, selectedCategory, selectedPriority, selectedStatus]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedPriority('');
    setSelectedStatus('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t.allIssues}
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800">
              {filteredIssues.length} Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-rose-500" />
            <span>Showing verified civic reports for <strong>{currentCity.name}</strong> & national metro corridors.</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setActiveView('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                activeView === 'grid'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>
            <button
              onClick={() => setActiveView('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                activeView === 'map'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Interactive Map</span>
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/report')}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            <span>Report</span>
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <IssueFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedPriority={selectedPriority}
        onPriorityChange={setSelectedPriority}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        onReset={handleResetFilters}
      />

      {/* View Switch: Interactive Map or Grid */}
      {activeView === 'map' ? (
        <IndiaCivicMap
          issues={filteredIssues}
          centerLat={currentCity.latitude}
          centerLng={currentCity.longitude}
          zoom={12}
        />
      ) : (
        <>
          {filteredIssues.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIssues.map((issue) => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <p className="text-sm font-semibold text-slate-700">
                No civic issues match your current filters.
              </p>
              <Button variant="outline" size="sm" onClick={handleResetFilters}>
                Clear All Filters
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
