import React, { useEffect } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { useMobile } from './hooks/useMobile';
import ProtectedRoute from './auth/ProtectedRoutes';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import JobsListPage from './pages/JobsListPage';
import JobDetailsPage from './pages/JobDetailsPage';
import CandidateDashboardPage from './pages/CandidateDashboardPage';
import RecruiterDashboardPage from './pages/RecruiterDashboardPage';
import JobPostingPage from './pages/JobPostingPage';
import JobEditPage from './pages/JobEditPage';
import ApplicationsPage from './pages/ApplicationsPage';
import CandidateProfilePage from './pages/CandidateProfilePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

const AppContent: React.FC = () => {
  const { isMobile, isCapacitor } = useMobile();

  useEffect(() => {
    // Add mobile-specific classes to body
    if (isCapacitor) {
      document.body.classList.add('capacitor-app');
    }
    
    if (isMobile) {
      document.body.classList.add('mobile-app');
    }

    // Set viewport meta tag for mobile
    if (isMobile) {
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      }
    }

    return () => {
      document.body.classList.remove('capacitor-app', 'mobile-app');
    };
  }, [isMobile, isCapacitor]);

  // Android back button handling
  useEffect(() => {
    if (!isCapacitor) return;
    let listener: { remove: () => Promise<void> } | undefined;
    (async () => {
      listener = await CapacitorApp.addListener('backButton', ({ canGoBack }) => {
      // Treat home route as exit, even if history exists
      const isHome = location.hash === '#/' || location.hash === '' || location.hash === '#';
      if (isHome) {
        const shouldExit = confirm('Exit the app?');
        if (shouldExit) CapacitorApp.exitApp();
        return;
      }

      if (canGoBack || window.history.length > 1) {
        window.history.back();
      } else {
        const shouldExit = confirm('Exit the app?');
        if (shouldExit) CapacitorApp.exitApp();
      }
      });
    })();
    return () => {
      if (listener) listener.remove();
    };
  }, [isCapacitor]);

  return (
    <HashRouter>
      <div className={`flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 ${isCapacitor ? 'capacitor-app' : ''}`}>
        <Header />
        <main className={`flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 ${isMobile ? 'px-4 py-4' : ''}`}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/jobs" element={<JobsListPage />} />
            <Route path="/jobs/:id" element={<JobDetailsPage />} />
            <Route 
              path="/candidate-dashboard" 
              element={
                <ProtectedRoute allowedRoles={['candidate']}>
                  <CandidateDashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/recruiter-dashboard" 
              element={
                <ProtectedRoute allowedRoles={['recruiter']}>
                  <RecruiterDashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/job-posting" 
              element={
                <ProtectedRoute allowedRoles={['recruiter']}>
                  <JobPostingPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/job-edit/:id" 
              element={
                <ProtectedRoute allowedRoles={['recruiter']}>
                  <JobEditPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/applications" 
              element={
                <ProtectedRoute allowedRoles={['recruiter']}>
                  <ApplicationsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/candidate-profile/:candidateId" 
              element={
                <ProtectedRoute allowedRoles={['recruiter']}>
                  <CandidateProfilePage />
                </ProtectedRoute>
              } 
            />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;