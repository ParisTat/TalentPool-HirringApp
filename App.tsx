
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import JobsListPage from './pages/JobsListPage';
import JobDetailsPage from './pages/JobDetailsPage';
import CandidateDashboardPage from './pages/CandidateDashboardPage';
import RecruiterDashboardPage from './pages/RecruiterDashboardPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/jobs" element={<JobsListPage />} />
            <Route path="/jobs/:id" element={<JobDetailsPage />} />
            <Route path="/candidate-dashboard" element={<CandidateDashboardPage />} />
            <Route path="/recruiter-dashboard" element={<RecruiterDashboardPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;
