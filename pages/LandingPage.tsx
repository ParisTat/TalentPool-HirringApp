import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import JobCard from '../components/JobCard';
import { useJobs } from '../hooks/useJobs';
import { useAuth } from '../auth/AuthContext';

const LandingPage: React.FC = () => {
  const { jobs, isLoading, error } = useJobs();
  const { user } = useAuth();
  const [featuredJobs, setFeaturedJobs] = useState<any[]>([]);

  useEffect(() => {
    if (jobs.length > 0) {
      setFeaturedJobs(jobs.slice(0, 3));
    }
  }, [jobs]);

  return (
    <div>
      {/* Hero Section */}
      <section className="text-center bg-white dark:bg-slate-800 py-20 rounded-lg shadow-sm">
        <h1 className="text-5xl font-extrabold text-secondary dark:text-slate-100 tracking-tight">
          Find Your Next Opportunity
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-600 dark:text-slate-400">
          TalentPool connects talented professionals with innovative companies. Discover your dream job today.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/jobs"
            className="px-8 py-3 text-lg font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-transform hover:scale-105"
          >
            Browse Jobs
          </Link>
          {!user && (
            <Link
              to="/login"
              className="px-8 py-3 text-lg font-medium text-primary-dark dark:text-primary-light bg-cyan-100 dark:bg-cyan-900/20 rounded-md hover:bg-cyan-200 dark:hover:bg-cyan-900/30 transition-transform hover:scale-105"
            >
              Sign In
            </Link>
          )}
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="mt-16">
        <h2 className="text-3xl font-bold text-center text-secondary dark:text-slate-100 mb-8">Featured Jobs</h2>
        {error ? (
          <div className="text-center py-12">
            <div className="text-red-600 dark:text-red-400 mb-4">Failed to load jobs</div>
            <Link
              to="/jobs"
              className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-colors"
            >
              Try Again
            </Link>
          </div>
        ) : isLoading ? (
          <div className="text-center py-12">
            <div className="text-slate-600 dark:text-slate-400">Loading featured jobs...</div>
          </div>
        ) : featuredJobs.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredJobs.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                to="/jobs"
                className="text-primary hover:text-primary-dark font-medium transition-colors"
              >
                View all jobs &rarr;
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400 mb-4">No jobs available at the moment.</p>
            <Link
              to="/jobs"
              className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-colors"
            >
              Browse All Jobs
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default LandingPage;