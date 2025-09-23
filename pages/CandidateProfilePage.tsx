import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { useAuth } from '../auth/AuthContext';

interface CandidateProfile {
  id: string;
  name: string;
  email: string;
  headline?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  skills?: string[];
  experience?: string;
  education?: string;
}

interface CandidateCV {
  id: string;
  user_id: string;
  filename: string;
  url: string;
  uploaded_at: string;
}

const CandidateProfilePage: React.FC = () => {
  const { candidateId } = useParams<{ candidateId: string }>();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [candidate, setCandidate] = useState<CandidateProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [candidateCV, setCandidateCV] = useState<CandidateCV | null>(null);

  useEffect(() => {
    const fetchCandidateProfile = async () => {
      if (!candidateId) return;

      try {
        setIsLoading(true);

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', candidateId)
          .eq('role', 'candidate')
          .single();

        if (error) {
          throw error;
        }

        setCandidate(data);

        // Fetch candidate CV (requires policy to allow recruiter select)
        const { data: cv, error: cvErr } = await supabase
          .from('candidate_cvs')
          .select('*')
          .eq('user_id', candidateId)
          .maybeSingle();
        if (!cvErr) {
          setCandidateCV(cv ?? null);
        } else {
          // keep page functional even if CV not accessible
          setCandidateCV(null);
        }
      } catch (error) {
        console.error('Error fetching candidate profile:', error);
        navigate('/applications');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidateProfile();
  }, [candidateId, navigate]);

  if (profile?.role !== 'recruiter') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-600 dark:text-slate-400 mb-4">Access Denied</h1>
          <p className="text-slate-500 dark:text-slate-400">Only recruiters can view candidate profiles.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="text-slate-600 dark:text-slate-400">Loading candidate profile...</div>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-600 dark:text-slate-400 mb-4">Candidate not found</h1>
          <button
            onClick={() => navigate('/applications')}
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-colors"
          >
            Back to Applications
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-secondary dark:text-slate-100 mb-2">Candidate Profile</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Detailed information about {candidate.name}
            </p>
          </div>
          <button
            onClick={() => navigate('/applications')}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Back to Applications
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold text-secondary dark:text-slate-100 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
              <p className="mt-1 text-slate-600 dark:text-slate-400">{candidate.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <p className="mt-1 text-slate-600 dark:text-slate-400">{candidate.email}</p>
            </div>
            {candidate.phone && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                <p className="mt-1 text-slate-600 dark:text-slate-400">{candidate.phone}</p>
              </div>
            )}
            {candidate.location && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                <p className="mt-1 text-slate-600 dark:text-slate-400">{candidate.location}</p>
              </div>
            )}
            {candidate.headline && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Professional Headline</label>
                <p className="mt-1 text-slate-600 dark:text-slate-400">{candidate.headline}</p>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {candidate.skills && candidate.skills.length > 0 && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-secondary dark:text-slate-100 mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((skill, index) => (
                <span key={index} className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {candidate.experience && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-secondary dark:text-slate-100 mb-4">Experience</h2>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{candidate.experience}</p>
            </div>
          </div>
        )}

        {/* Education */}
        {candidate.education && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-secondary dark:text-slate-100 mb-4">Education</h2>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{candidate.education}</p>
            </div>
          </div>
        )}
        {/* CV Download (visible to recruiters) */}
        {candidateCV && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-secondary dark:text-slate-100 mb-4">CV / Resume</h2>
            <div className="flex items-center justify-between">
              <div className="text-slate-600 dark:text-slate-400">
                {candidateCV.filename}
              </div>
              <a
                href={candidateCV.url}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-colors"
              >
                Download
              </a>
            </div>
          </div>
        )}

        {/* Links */}
        {(candidate.linkedin || candidate.github) && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-secondary dark:text-slate-100 mb-4">Links</h2>
            <div className="space-y-2">
              {candidate.linkedin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">LinkedIn</label>
                  <a 
                    href={candidate.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-1 text-primary hover:underline"
                  >
                    {candidate.linkedin}
                  </a>
                </div>
              )}
              {candidate.github && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">GitHub</label>
                  <a 
                    href={candidate.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-1 text-primary hover:underline"
                  >
                    {candidate.github}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateProfilePage;
