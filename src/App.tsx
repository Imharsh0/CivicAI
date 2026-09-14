import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { CityProvider } from './contexts/CityContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { IssuesProvider } from './contexts/IssuesContext';
import { NotificationsProvider } from './contexts/NotificationsContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HomePage } from './pages/HomePage';
import { ReportProblemPage } from './pages/ReportProblemPage';
import { ExplorePage } from './pages/ExplorePage';
import { IssueDetailPage } from './pages/IssueDetailPage';
import { UserDashboardPage } from './pages/UserDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { CityOverviewPage } from './pages/CityOverviewPage';
import { AuthPage } from './pages/AuthPage';
import { ProtectedRoute } from './components/common/ProtectedRoute';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

function AuthRoute() {
  const { user } = useAuth();
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return <AuthPage />;
}

export function AppContent() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
        <Navbar />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<AuthRoute />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/map" element={<ExplorePage />} />
            <Route path="/issue/:id" element={<IssueDetailPage />} />
            <Route path="/city" element={<CityOverviewPage />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/report" element={<ReportProblemPage />} />
              <Route path="/dashboard" element={<UserDashboardPage />} />
            </Route>
            
            <Route element={<ProtectedRoute adminOnly />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <CityProvider>
        <AuthProvider>
          <IssuesProvider>
            <NotificationsProvider>
              <AppContent />
            </NotificationsProvider>
          </IssuesProvider>
        </AuthProvider>
      </CityProvider>
    </LanguageProvider>
  );
}
