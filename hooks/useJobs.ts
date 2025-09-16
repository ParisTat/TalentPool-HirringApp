import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase';
import { Job } from '../types';
import { useAuth } from '../auth/AuthContext';

export const useJobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setJobs(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch jobs');
      console.error('Error fetching jobs:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchRecruiterJobs = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('jobs')
        .select('*')
        .eq('recruiter_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setJobs(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch jobs');
      console.error('Error fetching recruiter jobs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createJob = async (jobData: Omit<Job, 'id'>) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const { data, error: createError } = await supabase
        .from('jobs')
        .insert([{
          ...jobData,
          recruiter_id: user.id,
        }])
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      // Refresh the jobs list to ensure consistency
      await fetchJobs();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create job';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateJob = async (jobId: string, jobData: Partial<Omit<Job, 'id' | 'recruiter_id'>>) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const { data, error: updateError } = await supabase
        .from('jobs')
        .update({
          ...jobData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', jobId)
        .eq('recruiter_id', user.id) // Ensure user can only update their own jobs
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      setJobs(prev => prev.map(job => job.id === jobId ? data : job));
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update job';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteJob = async (jobId: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const { error: deleteError } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId)
        .eq('recruiter_id', user.id); // Ensure user can only delete their own jobs

      if (deleteError) {
        throw deleteError;
      }

      setJobs(prev => prev.filter(job => job.id !== jobId));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete job';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getJobById = useCallback(async (jobId: string): Promise<Job | null> => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (err) {
      console.error('Error fetching job:', err);
      return null;
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return {
    jobs,
    isLoading,
    error,
    fetchJobs,
    fetchRecruiterJobs,
    createJob,
    updateJob,
    deleteJob,
    getJobById,
    refreshJobs: fetchJobs, // Alias for manual refresh
  };
};
