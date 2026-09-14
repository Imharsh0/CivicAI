import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Globe2,
  ShieldCheck,
  UserCircle,
  MapPin,
  Building,
  PlusCircle,
  BarChart3,
  Map,
  Compass,
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCity } from '../../contexts/CityContext';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from './Button';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, language, setLanguage } = useLanguage();
  const { currentCity } = useCity();
  const { user, role, logout } = useAuth();
  
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { id: 'explore', label: t.exploreIssues, icon: Compass, path: '/explore' },
    { id: 'map', label: 'City Map', icon: Map, path: '/map' },
    { id: 'city', label: 'City Metrics', icon: BarChart3, path: '/city' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">
                Civic<span className="text-teal-600">AI</span>
              </span>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                India Operations
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1.5 ml-6">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.id}
                  to={link.path}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    isActive
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {/* Context Pickers (City & Language) */}
            <div className="flex items-center gap-3 pr-4 border-r border-slate-200">
              <button
                onClick={() => navigate('/city')}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-teal-700 transition-colors"
                title="Change Jurisdiction"
              >
                <Building className="w-4 h-4 text-slate-400" />
                <span className="truncate max-w-[100px]">{currentCity.name}</span>
              </button>

              <button
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors bg-slate-50 px-2 py-1 rounded-md border border-slate-200"
              >
                <Globe2 className="w-3.5 h-3.5" />
                {language.toUpperCase()}
              </button>
            </div>

            {/* Auth / Profile & Report Button */}
            {user ? (
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(role === 'admin' ? '/admin' : '/dashboard')}
                  leftIcon={<UserCircle className="w-4 h-4" />}
                >
                  <span className="truncate max-w-[80px]">{user.name}</span>
                </Button>

                {role === 'user' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate('/report')}
                    leftIcon={<PlusCircle className="w-4 h-4" />}
                  >
                    Report
                  </Button>
                )}
                <button
                  onClick={handleLogout}
                  className="text-[11px] font-semibold text-slate-500 hover:text-rose-600 underline"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
                  {t.login}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/report')}
                  leftIcon={<PlusCircle className="w-4 h-4" />}
                >
                  {t.reportProblem}
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden gap-3">
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-600 border border-slate-200 text-xs font-bold"
            >
              {language.toUpperCase()}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 -mr-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  location.pathname === link.path
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            ))}

            <div className="pt-4 mt-4 border-t border-slate-100 space-y-3">
              {user ? (
                <>
                  <Link
                    to={role === 'admin' ? '/admin' : '/dashboard'}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <UserCircle className="w-5 h-5" />
                    My Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <UserCircle className="w-5 h-5" />
                  Sign In / Register
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
