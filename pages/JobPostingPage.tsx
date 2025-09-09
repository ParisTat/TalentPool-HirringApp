import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import JobForm from '../components/JobForm';
import { useJobs } from '../hooks/useJobs';

const JobPostingPage: React.FC = () => {
  const navigate = useNavigate();
  const { createJob } = useJobs();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (jobData: any) => {
    setIsLoading(true);
    try {
      await createJob(jobData);
      navigate('/recruiter-dashboard');
    } catch (error) {
      console.error('Error creating job:', error);
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
