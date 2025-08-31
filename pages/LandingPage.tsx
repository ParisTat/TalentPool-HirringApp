
import React from 'react';
import { Link } from 'react-router-dom';
import { jobs } from '../data/mockData';
import JobCard from '../components/JobCard';

const LandingPage: React.FC = () => {
  const featuredJobs = jobs.slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="text-center bg-white py-20 rounded-lg shadow-sm">
        <h1 className="text-5xl font-extrabold text-secondary tracking-tight">
          Find Your Next Opportunity
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-600">
          TalentPool connects talented professionals with innovative companies. Discover your dream job today.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/jobs"
            className="px-8 py-3 text-lg font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-transform hover:scale-105"
          >
            Browse Jobs
          </Link>
          <Link
            to="#"
            className="px-8 py-3 text-lg font-medium text-primary-dark bg-cyan-100 rounded-md hover:bg-cyan-200 transition-transform hover:scale-105"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="mt-16">
        <h2 className="text-3xl font-bold text-center text-secondary mb-8">Featured Jobs</h2>
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
      </section>
    </div>
  );
};

export default LandingPage;
