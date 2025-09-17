import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://otsbvdvimwknbkovvuim.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90c2J2ZHZpbXdrbmJrb3Z2dWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NjI2NDUsImV4cCI6MjA3MjIzODY0NX0.3OXulxAvypW22PGv1gwGC4_ueIoEgw2699cNkY1s0jU';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: 'candidate' | 'recruiter';
          headline?: string;
          phone?: string;
          location?: string;
          linkedin?: string;
          github?: string;
          skills?: string[];
          experience?: string;
          education?: string;
          company?: string;
          position?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          role: 'candidate' | 'recruiter';
          headline?: string;
          phone?: string;
          location?: string;
          linkedin?: string;
          github?: string;
          skills?: string[];
          experience?: string;
          education?: string;
          company?: string;
          position?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: 'candidate' | 'recruiter';
          headline?: string;
          phone?: string;
          location?: string;
          linkedin?: string;
          github?: string;
          skills?: string[];
          experience?: string;
          education?: string;
          company?: string;
          position?: string;
        };
      };
      jobs: {
        Row: {
          id: string;
          title: string;
          company: string;
          location: string;
          type: 'Full-time' | 'Part-time' | 'Contract';
          salary: string;
          description: string;
          responsibilities: string[];
          qualifications: string[];
          recruiter_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          company: string;
          location: string;
          type: 'Full-time' | 'Part-time' | 'Contract';
          salary: string;
          description: string;
          responsibilities: string[];
          qualifications: string[];
          recruiter_id: string;
        };
        Update: {
          id?: string;
          title?: string;
          company?: string;
          location?: string;
          type?: 'Full-time' | 'Part-time' | 'Contract';
          salary?: string;
          description?: string;
          responsibilities?: string[];
          qualifications?: string[];
          recruiter_id?: string;
        };
      };
      applications: {
        Row: {
          id: string;
          job_id: string;
          candidate_id: string;
          status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          candidate_id: string;
          status?: 'pending' | 'reviewed' | 'accepted' | 'rejected';
        };
        Update: {
          id?: string;
          job_id?: string;
          candidate_id?: string;
          status?: 'pending' | 'reviewed' | 'accepted' | 'rejected';
        };
      };
    };
  };
}