
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ProfileEditForm from '../components/ProfileEditForm';
import { useAuth } from '../auth/AuthContext';
import { useApplications } from '../hooks/useApplications';

const CandidateDashboardPage: React.FC = () => {
  const { profile } = useAuth();
  const { applications, isLoading, fetchApplicationsForCandidate } = useApplications();
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Load applications when component mounts and profile is available
  useEffect(() => {
    const loadApplications = async () => {
      if (profile?.role === 'candidate') {
        await fetchApplicationsForCandidate();
      }
    };

    loadApplications();
  }, [profile?.id, profile?.role]); // Remove fetchApplicationsForCandidate to prevent infinite loops

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-secondary dark:text-slate-100 mb-8">Candidate Dashboard</h1>

      {/* Profile Section */}
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
            <p><span className="font-semibold text-slate-700 dark:text-slate-300">Headline:</span> <span className="text-slate-600 dark:text-slate-400">{profile?.headline}</span></p>
            {profile?.phone && <p><span className="font-semibold text-slate-700 dark:text-slate-300">Phone:</span> <span className="text-slate-600 dark:text-slate-400">{profile.phone}</span></p>}
            {profile?.location && <p><span className="font-semibold text-slate-700 dark:text-slate-300">Location:</span> <span className="text-slate-600 dark:text-slate-400">{profile.location}</span></p>}
            {profile?.linkedin && <p><span className="font-semibold text-slate-700 dark:text-slate-300">LinkedIn:</span> <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{profile.linkedin}</a></p>}
            {profile?.github && <p><span className="font-semibold text-slate-700 dark:text-slate-300">GitHub:</span> <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{profile.github}</a></p>}
            {profile?.skills && profile.skills.length > 0 && (
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-300">Skills:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {profile.skills.map((skill, index) => (
                    <span key={index} className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CV Section */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-2xl font-bold text-secondary dark:text-slate-100 mb-4">Your CV/Resume</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4">Keep your CV updated to get noticed by recruiters.</p>
        <button className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-colors">
          Upload New CV
        </button>
      </div>
      
      {/* Applied Jobs Section */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-secondary dark:text-slate-100 mb-4">Applied Jobs</h2>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="text-slate-600 dark:text-slate-400">Loading applications...</div>
          </div>
        ) : applications.length > 0 ? (
          <ul className="divide-y divide-slate-200 dark:divide-slate-700">
            {applications.map(application => (
              <li key={application.id} className="py-4 flex justify-between items-center">
                <div className="flex-1">
                  <p className="font-semibold text-secondary dark:text-slate-100">{application.job?.title}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{application.job?.company}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      application.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                      application.status === 'reviewed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                      application.status === 'accepted' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                      'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      Applied {new Date(application.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Link to={`/jobs/${application.job_id}`} className="text-primary hover:underline text-sm">View Job</Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-500 dark:text-slate-400 mb-4">You haven't applied to any jobs yet.</p>
            <Link 
              to="/jobs"
              className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-colors"
            >
              Browse Jobs
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDashboardPage;
