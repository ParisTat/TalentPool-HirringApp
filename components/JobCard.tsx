
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Job } from '../types';
import { useAuth } from '../auth/AuthContext';
import { useApplications } from '../hooks/useApplications';

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
  const { profile } = useAuth();
  const { applyToJob, checkIfApplied } = useApplications();
  const [hasApplied, setHasApplied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkApplicationStatus = async () => {
      if (profile?.role === 'candidate') {
        setIsChecking(true);
        try {
          const applied = await checkIfApplied(job.id);
          setHasApplied(applied);
        } catch (error) {
          console.error('Error checking application status:', error);
        } finally {
          setIsChecking(false);
        }
      } else {
        setIsChecking(false);
      }
    };

    checkApplicationStatus();
  }, [job.id, profile, checkIfApplied]);

  const handleApply = async () => {
    if (!profile || profile.role !== 'candidate') {
      return;
    }

    setIsApplying(true);
    try {
      await applyToJob(job.id);
      setHasApplied(true);
    } catch (error) {
      console.error('Error applying to job:', error);
      alert('Failed to apply to job. Please try again.');
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-secondary dark:text-slate-100">{job.title}</h3>
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
            job.type === 'Full-time' 
              ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400' 
              : 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400'
          }`}>
            {job.type}
          </span>
        </div>
        <div className="flex items-center text-slate-600 dark:text-slate-400 mb-2">
            <BriefcaseIcon className="w-5 h-5 mr-2 text-slate-400 dark:text-slate-500" />
            <span>{job.company}</span>
        </div>
        <div className="flex items-center text-slate-600 dark:text-slate-400 mb-4">
            <LocationIcon className="w-5 h-5 mr-2 text-slate-400 dark:text-slate-500" />
            <span>{job.location}</span>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2">{job.description}</p>
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold text-primary-dark dark:text-primary-light">{job.salary}</p>
          <div className="flex space-x-2">
            <Link
              to={`/jobs/${job.id}`}
              className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition-colors"
            >
              View Details
            </Link>
            {profile?.role === 'candidate' && !isChecking && (
              hasApplied ? (
                <span className="px-4 py-2 text-sm font-medium text-green-600 bg-green-50 dark:bg-green-900/20 rounded-md">
                  Applied
                </span>
              ) : (
                <button
                  onClick={handleApply}
                  disabled={isApplying}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  {isApplying ? 'Applying...' : 'Apply Now'}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
