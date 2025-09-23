import { useCallback, useState } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../auth/AuthContext';

export interface CandidateCV {
  id: string;
  user_id: string;
  filename: string;
  url: string;
  uploaded_at: string;
}

export function useCV() {
  const { user } = useAuth();
  const [cv, setCv] = useState<CandidateCV | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMyCV = useCallback(async () => {
    if (!user) return null;
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('candidate_cvs')
        .select('*')
        .eq('user_id', user.id)
        .order('uploaded_at', { ascending: false })
        .maybeSingle();
      if (error) throw error;
      setCv(data ?? null);
      return data ?? null;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load CV');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const uploadCV = useCallback(async (file: File) => {
    if (!user) throw new Error('Not authenticated');
    setIsLoading(true);
    setError(null);
    try {
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (!ext || !['pdf', 'doc', 'docx'].includes(ext)) {
        throw new Error('Please upload a PDF or Word document');
      }
      const path = `${user.id}/cv.${ext}`;
      const { error: upErr } = await supabase.storage.from('cvs').upload(path, file, {
        upsert: true,
        contentType: file.type || (ext === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
      });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from('cvs').getPublicUrl(path);
      const publicUrl = pub.publicUrl;
      const { data, error: insErr } = await supabase
        .from('candidate_cvs')
        .upsert({ user_id: user.id, filename: file.name, url: publicUrl }, { onConflict: 'user_id' })
        .select()
        .single();
      if (insErr) throw insErr;
      setCv(data);
      return data;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to upload CV');
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const deleteCV = useCallback(async () => {
    if (!user) throw new Error('Not authenticated');
    if (!cv) return;
    setIsLoading(true);
    setError(null);
    try {
      // Delete storage object
      const url = new URL(cv.url);
      const key = url.pathname.replace(/^\/storage\/v1\/object\/public\/cvs\//, '');
      await supabase.storage.from('cvs').remove([key]);
      // Delete DB row
      const { error } = await supabase.from('candidate_cvs').delete().eq('user_id', user.id);
      if (error) throw error;
      setCv(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete CV');
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [user, cv]);

  return { cv, isLoading, error, fetchMyCV, uploadCV, deleteCV };
}


