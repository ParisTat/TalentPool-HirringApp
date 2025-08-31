
import React from 'react';
import { candidate, jobs } from '../data/mockData';
import { Link } from 'react-router-dom';

const CandidateDashboardPage: React.FC = () => {
  const appliedJobsDetails = jobs.filter(job => candidate.appliedJobs.includes(job.id));

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-secondary mb-8">Candidate Dashboard</h1>

      {/* Profile Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-2xl font-bold text-secondary mb-4">Your Profile</h2>
        <div className="space-y-3">
          <p><span className="font-semibold">Name:</span> {candidate.name}</p>
          <p><span className="font-semibold">Email:</span> {candidate.email}</p>
          <p><span className="font-semibold">Headline:</span> {candidate.headline}</p>
        </div>
      </div>

      {/* CV Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-2xl font-bold text-secondary mb-4">Your CV/Resume</h2>
        <p className="text-slate-600 mb-4">Keep your CV updated to get noticed by recruiters.</p>
        <button className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-colors">
          Upload New CV
        </button>
      </div>
      
      {/* Applied Jobs Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-secondary mb-4">Applied Jobs</h2>
        {appliedJobsDetails.length > 0 ? (
          <ul className="divide-y divide-slate-200">
            {appliedJobsDetails.map(job => (
              <li key={job.id} className="py-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-secondary">{job.title}</p>
                  <p className="text-sm text-slate-500">{job.company}</p>
                </div>
                <Link to={`/jobs/${job.id}`} className="text-primary hover:underline text-sm">View Application</Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-500">You haven't applied to any jobs yet.</p>
        )}
      </div>
    </div>
  );
};

export default CandidateDashboardPage;
