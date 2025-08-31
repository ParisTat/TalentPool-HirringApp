import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
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
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;