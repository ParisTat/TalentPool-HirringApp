
import React from 'react';
import { recruiter, jobs } from '../data/mockData';
import { Link } from 'react-router-dom';

const RecruiterDashboardPage: React.FC = () => {
  const postedJobsDetails = jobs.filter(job => recruiter.postedJobs.includes(job.id));

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-secondary">Recruiter Dashboard</h1>
        <button className="px-6 py-2 font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-colors">
          Post a New Job
        </button>
      </div>

      {/* Recruiter Info */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <p><span className="font-semibold">Recruiter:</span> {recruiter.name}</p>
        <p><span className="font-semibold">Company:</span> {recruiter.company}</p>
      </div>

      {/* Job Postings */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-secondary mb-4">Your Job Postings</h2>
        {postedJobsDetails.length > 0 ? (
          <ul className="divide-y divide-slate-200">
            {postedJobsDetails.map(job => (
              <li key={job.id} className="py-4 flex justify-between items-center">
                <div>
                  <Link to={`/jobs/${job.id}`} className="font-semibold text-secondary hover:text-primary">{job.title}</Link>
                  <p className="text-sm text-slate-500">{job.location} &bull; {job.type}</p>
                </div>
                <div className="space-x-2">
                  <button className="text-sm text-blue-600 hover:underline">Edit</button>
                  <button className="text-sm text-red-600 hover:underline">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-500">You haven't posted any jobs yet.</p>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboardPage;
