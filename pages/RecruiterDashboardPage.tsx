
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProfileEditForm from '../components/ProfileEditForm';
import { useAuth } from '../auth/AuthContext';
import { useJobs } from '../hooks/useJobs';

const RecruiterDashboardPage: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { jobs, isLoading, deleteJob } = useJobs();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);

  const handleDeleteJob = async (jobId: string) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) {
      return;
    }

    setDeletingJobId(jobId);
    try {
      await deleteJob(jobId);
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete job. Please try again.');
    } finally {
      setDeletingJobId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-secondary dark:text-slate-100">Recruiter Dashboard</h1>
          <div className="hidden sm:flex space-x-3">
            <button 
              onClick={() => navigate('/applications')}
              className="px-4 py-2 font-medium text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition-colors"
            >
              View Applications
            </button>
            <button 
              onClick={() => navigate('/job-posting')}
              className="px-6 py-2 font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-colors"
            >
              Post a New Job
            </button>
          </div>
        </div>
        {/* Mobile stacked actions */}
        <div className="mt-4 grid grid-cols-1 gap-3 sm:hidden">
          <button 
            onClick={() => navigate('/applications')}
            className="w-full px-4 py-3 font-medium text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition-colors"
          >
            View Applications
          </button>
          <button 
            onClick={() => navigate('/job-posting')}
            className="w-full px-4 py-3 font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-colors"
          >
            Post a New Job
          </button>
        </div>
      </div>

      {/* Recruiter Info */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-secondary dark:text-slate-100">Your Profile</h2>
          <button
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition-colors"
          >
            {isEditingProfile ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>
        
        {isEditingProfile ? (
          <ProfileEditForm onCancel={() => setIsEditingProfile(false)} />
        ) : (
          <div className="space-y-3">
            <p><span className="font-semibold text-slate-700 dark:text-slate-300">Name:</span> <span className="text-slate-600 dark:text-slate-400">{profile?.name}</span></p>
            <p><span className="font-semibold text-slate-700 dark:text-slate-300">Email:</span> <span className="text-slate-600 dark:text-slate-400">{profile?.email}</span></p>
            <p><span className="font-semibold text-slate-700 dark:text-slate-300">Company:</span> <span className="text-slate-600 dark:text-slate-400">{profile?.company}</span></p>
            {profile?.position && <p><span className="font-semibold text-slate-700 dark:text-slate-300">Position:</span> <span className="text-slate-600 dark:text-slate-400">{profile.position}</span></p>}
            {profile?.headline && <p><span className="font-semibold text-slate-700 dark:text-slate-300">Headline:</span> <span className="text-slate-600 dark:text-slate-400">{profile.headline}</span></p>}
            {profile?.phone && <p><span className="font-semibold text-slate-700 dark:text-slate-300">Phone:</span> <span className="text-slate-600 dark:text-slate-400">{profile.phone}</span></p>}
            {profile?.location && <p><span className="font-semibold text-slate-700 dark:text-slate-300">Location:</span> <span className="text-slate-600 dark:text-slate-400">{profile.location}</span></p>}
          </div>
        )}
      </div>

      {/* Job Postings */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-secondary dark:text-slate-100 mb-4">Your Job Postings</h2>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="text-slate-600 dark:text-slate-400">Loading jobs...</div>
          </div>
        ) : jobs.length > 0 ? (
          <ul className="divide-y divide-slate-200 dark:divide-slate-700">
            {jobs.map(job => (
              <li key={job.id} className="py-4 flex justify-between items-center">
                <div className="flex-1">
                  <Link to={`/jobs/${job.id}`} className="font-semibold text-secondary dark:text-slate-100 hover:text-primary">{job.title}</Link>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{job.location} &bull; {job.type}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    Posted {new Date(job.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => navigate(`/job-edit/${job.id}`)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteJob(job.id)}
                    disabled={deletingJobId === job.id}
                    className="text-sm text-red-600 hover:underline disabled:opacity-50"
                  >
                    {deletingJobId === job.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-500 dark:text-slate-400 mb-4">You haven't posted any jobs yet.</p>
            <button 
              onClick={() => navigate('/job-posting')}
              className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-colors"
            >
              Post Your First Job
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboardPage;
