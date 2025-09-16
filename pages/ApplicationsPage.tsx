import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplications, Application } from '../hooks/useApplications';
import { useAuth } from '../auth/AuthContext';

const ApplicationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { applications, isLoading, fetchApplicationsForRecruiter, updateApplicationStatus } = useApplications();
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    const loadApplications = async () => {
      if (profile?.role === 'recruiter') {
        await fetchApplicationsForRecruiter();
      }
    };

    loadApplications();
  }, [profile?.id, profile?.role]); // Remove fetchApplicationsForRecruiter to prevent infinite loops

  const handleStatusUpdate = async (applicationId: string, newStatus: 'pending' | 'reviewed' | 'accepted' | 'rejected') => {
    setUpdatingStatus(applicationId);
    try {
      await updateApplicationStatus(applicationId, newStatus);
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('Failed to update application status. Please try again.');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const viewCandidateProfile = (candidateId: string) => {
    navigate(`/candidate-profile/${candidateId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const groupedApplications = applications.reduce((acc, app) => {
    const jobId = app.job_id;
    if (!acc[jobId]) {
      acc[jobId] = {
        job: app.job,
        applications: []
      };
    }
    acc[jobId].applications.push(app);
    return acc;
  }, {} as Record<string, { job: any; applications: Application[] }>);

  if (profile?.role !== 'recruiter') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-600 dark:text-slate-400 mb-4">Access Denied</h1>
          <p className="text-slate-500 dark:text-slate-400">Only recruiters can view applications.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-secondary dark:text-slate-100 mb-2">Job Applications</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage applications for your job postings.
            </p>
          </div>
          <button
            onClick={() => navigate('/recruiter-dashboard')}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="text-slate-600 dark:text-slate-400">Loading applications...</div>
        </div>
      ) : Object.keys(groupedApplications).length === 0 ? (
        <div className="text-center py-12">
          <div className="text-slate-500 dark:text-slate-400 mb-4">
            No applications received yet.
          </div>
          <button
            onClick={() => navigate('/job-posting')}
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-colors"
          >
            Post a Job
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedApplications).map(([jobId, { job, applications }]) => (
            <div key={jobId} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-secondary dark:text-slate-100 mb-2">
                  {job?.title}
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  {job?.company} • {applications.length} application{applications.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="space-y-4">
                {applications.map((application) => (
                  <div key={application.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-secondary dark:text-slate-100 mb-1">
                          {application.candidate?.name}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          {application.candidate?.email}
                        </p>
                        {application.candidate?.headline && (
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {application.candidate.headline}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(application.status)}`}>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </span>
                        <button
                          onClick={() => viewCandidateProfile(application.candidate_id)}
                          className="text-sm text-primary hover:underline"
                        >
                          View Profile
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {application.candidate?.skills?.slice(0, 5).map((skill, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                          {skill}
                        </span>
                      ))}
                      {application.candidate?.skills && application.candidate.skills.length > 5 && (
                        <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                          +{application.candidate.skills.length - 5} more
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        Applied {new Date(application.created_at).toLocaleDateString()}
                      </p>
                      <div className="flex space-x-2">
                        {application.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(application.id, 'reviewed')}
                              disabled={updatingStatus === application.id}
                              className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors disabled:opacity-50"
                            >
                              {updatingStatus === application.id ? 'Updating...' : 'Mark Reviewed'}
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(application.id, 'accepted')}
                              disabled={updatingStatus === application.id}
                              className="px-3 py-1 text-xs font-medium text-green-600 bg-green-50 dark:bg-green-900/20 rounded hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors disabled:opacity-50"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(application.id, 'rejected')}
                              disabled={updatingStatus === application.id}
                              className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 dark:bg-red-900/20 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {application.status === 'reviewed' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(application.id, 'accepted')}
                              disabled={updatingStatus === application.id}
                              className="px-3 py-1 text-xs font-medium text-green-600 bg-green-50 dark:bg-green-900/20 rounded hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors disabled:opacity-50"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(application.id, 'rejected')}
                              disabled={updatingStatus === application.id}
                              className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 dark:bg-red-900/20 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;
