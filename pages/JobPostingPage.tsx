import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import JobForm from '../components/JobForm';
import { useJobs } from '../hooks/useJobs';

const JobPostingPage: React.FC = () => {
  const navigate = useNavigate();
  const { createJob, refreshJobs } = useJobs();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (jobData: any) => {
    setIsLoading(true);
    setError(null);
    try {
      await createJob(jobData);
      // Refresh jobs list to ensure new job appears
      await refreshJobs();
      navigate('/recruiter-dashboard');
    } catch (error) {
      console.error('Error creating job:', error);
      setError(error instanceof Error ? error.message : 'Failed to create job');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/recruiter-dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary dark:text-slate-100 mb-2">Post a New Job</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Create a new job posting to attract qualified candidates.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}
        <JobForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default JobPostingPage;
