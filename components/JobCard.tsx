
import React from 'react';
import { Link } from 'react-router-dom';
import { Job } from '../types';

interface JobCardProps {
  job: Job;
}

const BriefcaseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.07a2.25 2.25 0 0 1-2.25 2.25H5.92a2.25 2.25 0 0 1-2.25-2.25v-4.07a2.25 2.25 0 0 1 .528-1.485c.195-.248.45-.45.722-.598a2.25 2.25 0 0 1 2.25 0c.272.148.527.35.722.598.195.248.528.937.528 1.485v.62a.75.75 0 0 0 1.5 0v-.62a2.25 2.25 0 0 1 .528-1.485c.195-.248.45-.45.722-.598a2.25 2.25 0 0 1 2.25 0c.272.148.527.35.722.598.195.248.528.937.528 1.485v.62a.75.75 0 0 0 1.5 0v-.62a2.25 2.25 0 0 1 .528-1.485c.195-.248.45-.45.722-.598a2.25 2.25 0 0 1 2.25 0c.272.148.527.35.722.598.195.248.528.937.528 1.485Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
);

const LocationIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
);


const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-secondary">{job.title}</h3>
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${job.type === 'Full-time' ? 'bg-cyan-100 text-cyan-800' : 'bg-amber-100 text-amber-800'}`}>
            {job.type}
          </span>
        </div>
        <div className="flex items-center text-slate-600 mb-2">
            <BriefcaseIcon className="w-5 h-5 mr-2 text-slate-400" />
            <span>{job.company}</span>
        </div>
        <div className="flex items-center text-slate-600 mb-4">
            <LocationIcon className="w-5 h-5 mr-2 text-slate-400" />
            <span>{job.location}</span>
        </div>
        <p className="text-slate-500 text-sm mb-4 line-clamp-2">{job.description}</p>
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold text-primary-dark">{job.salary}</p>
          <Link
            to={`/jobs/${job.id}`}
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
