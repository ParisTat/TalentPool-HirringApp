
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useJobs } from '../hooks/useJobs';
import { useAuth } from '../auth/AuthContext';
import { useApplications } from '../hooks/useApplications';

const JobDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getJobById } = useJobs();
  const { profile } = useAuth();
  const { applyToJob, checkIfApplied } = useApplications();
  const [job, setJob] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoize the job fetching function to prevent unnecessary re-renders
  const fetchJob = useCallback(async () => {
    if (!id) {
      setError('No job ID provided');
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const jobData = await getJobById(id);
      if (jobData) {
        setJob(jobData);
      } else {
        setError('Job not found');
      }
    } catch (error) {
      console.error('Error fetching job:', error);
      setError('Failed to load job details');
    } finally {
      setIsLoading(false);
    }
  }, [id]); // Remove getJobById from dependencies to prevent infinite loops

  // Fetch job when component mounts or ID changes
  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  // Check application status when job and profile are available
  useEffect(() => {
    const checkStatus = async () => {
      if (!job || !profile || profile.role !== 'candidate') {
        setIsChecking(false);
        return;
      }

      setIsChecking(true);
      try {
        const applied = await checkIfApplied(job.id);
        setHasApplied(applied);
      } catch (error) {
        console.error('Error checking application status:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkStatus();
  }, [job?.id, profile?.id, profile?.role]); // Remove checkIfApplied to prevent infinite loops

  const handleApply = async () => {
    if (!profile || profile.role !== 'candidate' || !job) {
      return;
    }

    setIsApplying(true);
    try {
      await applyToJob(job.id);
      setHasApplied(true);
      // Show success message
      alert('Application submitted successfully!');
    } catch (error) {
      console.error('Error applying to job:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to apply to job. Please try again.';
      alert(errorMessage);
    } finally {
      setIsApplying(false);
    }
  };

  // Show loading only for job data, not application status
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-slate-600 dark:text-slate-400">Loading job details...</div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">
          {error || 'Job not found'}
        </h2>
        <Link to="/jobs" className="text-primary hover:underline mt-4 inline-block">
          &larr; Back to all jobs
        </Link>
      </div>
    );
  }

  const Section: React.FC<{title: string, children: React.ReactNode}> = ({title, children}) => (
    <div className="mt-8">
        <h3 className="text-xl font-bold text-secondary dark:text-slate-100 mb-3">{title}</h3>
        {children}
    </div>
  );

  return (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 dark:border-slate-700 pb-4 mb-6">
            <div>
                <h1 className="text-4xl font-extrabold text-secondary dark:text-slate-100">{job.title}</h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">{job.company} &bull; {job.location}</p>
            </div>
            <div className="mt-4 md:mt-0 min-w-[120px]">
                {profile?.role === 'candidate' && (
                  isChecking ? (
                    <div className="px-8 py-3 text-lg font-medium text-slate-500 bg-slate-100 dark:bg-slate-700 rounded-md w-full md:w-auto inline-block text-center">
                      Checking...
                    </div>
                  ) : hasApplied ? (
                    <span className="px-8 py-3 text-lg font-medium text-green-600 bg-green-50 dark:bg-green-900/20 rounded-md w-full md:w-auto inline-block text-center">
                      Applied
                    </span>
                  ) : (
                    <button 
                      onClick={handleApply}
                      disabled={isApplying}
                      className="px-8 py-3 text-lg font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-colors w-full md:w-auto disabled:opacity-50"
                    >
                      {isApplying ? 'Applying...' : 'Apply Now'}
                    </button>
                  )
                )}
            </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-8">
            <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Salary</p>
                <p className="font-semibold text-secondary dark:text-slate-100">{job.salary}</p>
            </div>
            <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Job Type</p>
                <p className="font-semibold text-secondary dark:text-slate-100">{job.type}</p>
            </div>
        </div>
      
      <Section title="Job Description">
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{job.description}</p>
      </Section>

      <Section title="Responsibilities">
        <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">
          {job.responsibilities.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
      </Section>

      <Section title="Qualifications">
        <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">
          {job.qualifications.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
      </Section>

      <div className="mt-10 text-center">
          <Link to="/jobs" className="text-primary hover:text-primary-dark font-medium transition-colors">
            &larr; Back to job listings
          </Link>
      </div>
    </div>
  );
};

export default JobDetailsPage;
