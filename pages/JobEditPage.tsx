import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import JobForm from '../components/JobForm';
import { useJobs } from '../hooks/useJobs';
import { Job } from '../types';

const JobEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateJob, getJobById } = useJobs();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingJob, setIsLoadingJob] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      
      setIsLoadingJob(true);
      try {
        const jobData = await getJobById(id);
        if (jobData) {
          setJob(jobData);
        } else {
          navigate('/recruiter-dashboard');
        }
      } catch (error) {
        console.error('Error fetching job:', error);
        navigate('/recruiter-dashboard');
      } finally {
        setIsLoadingJob(false);
      }
    };

    fetchJob();
  }, [id]); // Remove getJobById and navigate from dependencies to prevent infinite loops

  const handleSubmit = async (jobData: any) => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      await updateJob(id, jobData);
      navigate('/recruiter-dashboard');
    } catch (error) {
      console.error('Error updating job:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/recruiter-dashboard');
  };

  if (isLoadingJob) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="text-slate-600 dark:text-slate-400">Loading job details...</div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-600 dark:text-slate-400 mb-4">Job not found</h1>
          <button
            onClick={() => navigate('/recruiter-dashboard')}
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary dark:text-slate-100 mb-2">Edit Job Posting</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Update your job posting details.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
        <JobForm
          job={job}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default JobEditPage;
