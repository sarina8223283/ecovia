 import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
 import { supabase } from '@/integrations/supabase/client';
 import type { User, Session } from '@supabase/supabase-js';
 
 interface Profile {
   id: string;
   user_id: string;
   full_name: string | null;
   phone: string | null;
   address: string | null;
  permanent_address: string | null;
   city: string | null;
   state: string | null;
   pincode: string | null;
 }
 
 interface AuthContextType {
   user: User | null;
   session: Session | null;
   profile: Profile | null;
   loading: boolean;
   signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
   signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  verifyEmailOtp: (email: string, token: string) => Promise<{ error: Error | null }>;
  resendSignupOtp: (email: string) => Promise<{ error: Error | null }>;
   signOut: () => Promise<void>;
   updateProfile: (data: Partial<Profile>) => Promise<{ error: Error | null }>;
 }
 
 const AuthContext = createContext<AuthContextType | undefined>(undefined);
 
 export const AuthProvider = ({ children }: { children: ReactNode }) => {
   const [user, setUser] = useState<User | null>(null);
   const [session, setSession] = useState<Session | null>(null);
   const [profile, setProfile] = useState<Profile | null>(null);
   const [loading, setLoading] = useState(true);
 
   useEffect(() => {
     const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
       setSession(session);
       setUser(session?.user ?? null);
       
       if (session?.user) {
         setTimeout(async () => {
           const { data } = await supabase
             .from('profiles')
             .select('*')
             .eq('user_id', session.user.id)
             .single();
           setProfile(data);
         }, 0);
       } else {
         setProfile(null);
       }
       setLoading(false);
     });
 
     supabase.auth.getSession().then(({ data: { session } }) => {
       setSession(session);
       setUser(session?.user ?? null);
       if (session?.user) {
         supabase
           .from('profiles')
           .select('*')
           .eq('user_id', session.user.id)
           .single()
           .then(({ data }) => setProfile(data));
       }
       setLoading(false);
     });
 
     return () => subscription.unsubscribe();
   }, []);
 
   const signUp = async (email: string, password: string, fullName: string) => {
    const redirectUrl = `${window.location.origin}/account`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: redirectUrl,
      },
    });
    return { error: error ? new Error(error.message) : null };
   };
 
   const signIn = async (email: string, password: string) => {
     const { error } = await supabase.auth.signInWithPassword({ email, password });
     return { error: error ? new Error(error.message) : null };
   };

  const verifyEmailOtp = async (email: string, token: string) => {
    const { error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });
    return { error: error ? new Error(error.message) : null };
  };

  const resendSignupOtp = async (email: string) => {
    const { error } = await supabase.auth.resend({ type: 'signup', email });
    return { error: error ? new Error(error.message) : null };
  };
 
   const signOut = async () => {
     await supabase.auth.signOut();
     setProfile(null);
   };
 
   const updateProfile = async (data: Partial<Profile>) => {
     if (!user) return { error: new Error('Not authenticated') };
     
     const { error } = await supabase
       .from('profiles')
       .update(data)
       .eq('user_id', user.id);
     
     if (!error) {
       setProfile(prev => prev ? { ...prev, ...data } : null);
     }
     
     return { error: error ? new Error(error.message) : null };
   };
 
   return (
    <AuthContext.Provider value={{ user, session, profile, loading, signUp, signIn, verifyEmailOtp, resendSignupOtp, signOut, updateProfile }}>
       {children}
     </AuthContext.Provider>
   );
 };
 
 export const useAuth = () => {
   const context = useContext(AuthContext);
   if (!context) {
     throw new Error('useAuth must be used within an AuthProvider');
   }
   return context;
 };