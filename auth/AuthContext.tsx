import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../supabase';

export interface Profile {
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
  created_at?: string;
  updated_at?: string;
}

type AuthContextType ={
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (
    email: string, 
    password: string, 
    name: string, 
    role: 'candidate' | 'recruiter'
  ) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updateProfile: (
    updates: Partial<Omit<Profile, 'id' | 'email'>>
  ) => Promise<{ error: string | null }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx)  throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

//--------------------------------helpers--------------------------------

async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

    if (error) {
      console.error('[Auth] fetchProfile error:', error);
      return null;
    }

    return data ?? null;
}

/**
 * 
 * Δημιουρεί το row στο profiles Μόνο αν λείπει.
 * Τρέχει ως authenticated χρήστης => περναει τις RLS policies 
 */
async function ensureProfileExists(user: User): Promise<void> {
  // υπάρχει ΄ήδη
  const { data: exists, error: checkErr } = await supabase
  .from('profiles')
  .select('id')
  .eq('id', user.id)
  .maybeSingle();

  if (checkErr) {
    console.error('[Auth] ensureProfileExists check error (will still try upsert):', checkErr);
  }

  if (exists) return;

  const name = (user.user_metadata?.name as string) ?? '';
  const role = ((user.user_metadata?.role as string) ?? 'candidate') as Profile['role'];

  const { error: upsertErr } = await supabase
  .from('profiles')
  .upsert(
  {
    id: user.id,
    email: user.email,
    name,
    role,
  },

  { onConflict: 'id' }
  );

  if (upsertErr) {
    console.error('[Auth] ensureProfileExists upsert error:', upsertErr);
  }
}

//--------------------------------AuthProvider--------------------------------

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  //αρχικοποίηση
  useEffect(() => {

    let mounted = true;

    const init = async () => {
      setIsLoading(true);
      const{data, error} = await supabase.auth.getSession();
      if (error) console.error('[Auth] getSession error:', error);

      const currentSession =data?.session ?? null;
      const currentUser = currentSession?.user ?? null;

      if (!mounted) return;

      setSession(currentSession);
      setUser(currentUser);

      if(currentUser) {
        // 1) φρότισε να υπάρχει row
        await ensureProfileExists(currentUser);
        // 2) διάβασε το profile
        const p = await fetchProfile(currentUser.id);
        if (mounted) setProfile(p);
      } else {
        setProfile(null);
      }

      setIsLoading(false);
    };

    init();

    const{ data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      setSession(session);
      const newUser = session?.user ?? null;
      setUser(newUser);
      
      if (newUser) {
        await ensureProfileExists(newUser);
        const p = await fetchProfile(newUser.id);
        if (mounted) setProfile(p);
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });


    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);
  
  
//--------------------------------actions--------------------------------

    const signUp : AuthContextType['signUp'] = async (email, password, name, role) => {
      // Στέλνουμε metadata ώστε ο DB trigger να δημιουργήσει το profile
      const {error} = await supabase.auth.signUp({
        email,
        password,
        options: { data: {name,role}, },
      });
      if (error) {
        console.error('[Auth] signUp error:', error);
        return { error: error.message };
      }
      return { error: null };
    };

    const signIn : AuthContextType['signIn'] = async (email, password) => {
      const {error} = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('[Auth] signIn error:', error);
        return { error: error.message };
      }
      return { error: null };
    };

    const signOut = async() => {
      const {error} = await supabase.auth.signOut();
      if (error) console.error('[Auth] signOut error:', error);
        setProfile(null);
    };

    const updateProfile : AuthContextType['updateProfile'] = async (updates) => {
      if (!user) return { error: 'Not authenticated' };

// δεν επιτρέπουμε αλλαγή id/email μέσω αυτής της μεθόδου
      const payload = { ...updates, updated_at: new Date().toISOString() };

      const {error} = await supabase.from('profiles').update(payload).eq('id', user.id);
      if (error) {
        console.error('[Auth] updateProfile error:', error);
        return { error: error.message };
      }

      //refresh το local state
      const fresh = await fetchProfile(user.id);
      setProfile(fresh);
      return { error: null };
    };

    const value = useMemo<AuthContextType>(
      () => ({
        user,
        session,
        profile,
        isLoading,
        signUp,
        signIn,
        signOut,
        updateProfile,
      }),
      [user, session, profile, isLoading],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  };