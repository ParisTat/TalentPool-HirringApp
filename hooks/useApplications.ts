import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../auth/AuthContext';

export interface Application {
  id: string;
  job_id: string;
  candidate_id: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
  job?: {
    id: string;
    title: string;
    company: string;
  };
  candidate?: {
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
  };
}

export const useApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplicationsForRecruiter = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      // First get all jobs posted by this recruiter
      const { data: jobs, error: jobsError } = await supabase
        .from('jobs')
        .select('id')
        .eq('recruiter_id', user.id);

      if (jobsError) {
        throw jobsError;
      }

      if (!jobs || jobs.length === 0) {
        setApplications([]);
        return;
      }

      const jobIds = jobs.map(job => job.id);

      // Then get all applications for those jobs with candidate and job details
      const { data, error: applicationsError } = await supabase
        .from('applications')
        .select(`
          *,
          job:jobs(id, title, company),
          candidate:profiles!applications_candidate_id_fkey(
            id, name, email, headline, phone, location, linkedin, github, skills, experience, education
          )
        `)
        .in('job_id', jobIds)
        .order('created_at', { ascending: false });

      if (applicationsError) {
        throw applicationsError;
      }

      setApplications(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch applications');
      console.error('Error fetching applications:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const fetchApplicationsForCandidate = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          job:jobs(id, title, company, location, type, salary)
        `)
        .eq('candidate_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setApplications(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch applications');
      console.error('Error fetching candidate applications:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const applyToJob = async (jobId: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      // First check if already applied to prevent duplicates
      const { data: existingApplication } = await supabase
        .from('applications')
        .select('id')
        .eq('job_id', jobId)
        .eq('candidate_id', user.id)
        .maybeSingle();

      if (existingApplication) {
        throw new Error('You have already applied to this job');
      }

      const { data, error } = await supabase
        .from('applications')
        .insert([{
          job_id: jobId,
          candidate_id: user.id,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) {
        // Handle specific database errors
        if (error.code === '23505') { // Unique constraint violation
          throw new Error('You have already applied to this job');
        }
        throw error;
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to apply to job';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: 'pending' | 'reviewed' | 'accepted' | 'rejected') => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const { data, error } = await supabase
        .from('applications')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', applicationId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setApplications(prev => 
        prev.map(app => app.id === applicationId ? { ...app, ...data } : app)
      );

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update application status';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const checkIfApplied = useCallback(async (jobId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('applications')
        .select('id')
        .eq('job_id', jobId)
        .eq('candidate_id', user.id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      return !!data;
    } catch (err) {
      console.error('Error checking application status:', err);
      return false;
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      // This will be called by the components that use this hook
      // based on the user's role
    }
  }, [user]);

  return {
    applications,
    isLoading,
    error,
    fetchApplicationsForRecruiter,
    fetchApplicationsForCandidate,
    applyToJob,
    updateApplicationStatus,
    checkIfApplied,
  };
};
