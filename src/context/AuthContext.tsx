
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Type pour les rôles d'utilisateur
export type UserRole = 'passager' | 'conducteur' | 'admin';

// Type pour les données de profil
export type UserProfile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  role: UserRole;
};

type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  signUp: (
    email: string, 
    password: string, 
    metadata: { 
      firstName: string; 
      lastName: string; 
      phone: string;
      role: UserRole;
    }
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resendVerificationEmail?: (email: string) => Promise<void>;
  fetchUserProfile: () => Promise<UserProfile | null>;
  isAdmin: () => boolean;
  isDriver: () => boolean;
  isPassenger: () => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserProfile = async (): Promise<UserProfile | null> => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
      
      setProfile(data as UserProfile);
      return data as UserProfile;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  useEffect(() => {
    // Check active session
    const getSession = async () => {
      setIsLoading(true);
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error fetching session:', error);
      }
      
      setSession(session);
      setUser(session?.user || null);
      
      if (session?.user) {
        await fetchUserProfile();
      }
      
      setIsLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user || null);
        
        if (session?.user) {
          await fetchUserProfile();
        } else {
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (
    email: string,
    password: string,
    metadata: { 
      firstName: string; 
      lastName: string; 
      phone: string;
      role: UserRole;
    }
  ) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        }
      });

      if (error) {
        throw error;
      }
      
      toast.success('Inscription réussie ! Veuillez vérifier votre email.');
      navigate('/login');
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast.error(error.message || 'Une erreur est survenue lors de l\'inscription');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }
      
      const profile = await fetchUserProfile();
      
      toast.success('Connexion réussie !');
      
      // Redirection en fonction du rôle
      if (profile) {
        switch(profile.role) {
          case 'admin':
            navigate('/admin/dashboard');
            break;
          case 'conducteur':
            navigate('/driver/dashboard');
            break;
          default:
            navigate('/');
            break;
        }
      } else {
        navigate('/');
      }
    } catch (error: any) {
      console.error('Error signing in:', error);
      
      if (error.code === 'email_not_confirmed') {
        toast.error('Email non vérifié. Veuillez vérifier votre boîte de réception.');
      } else {
        toast.error(error.message || 'Email ou mot de passe incorrect');
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerificationEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) {
        throw error;
      }
      
      toast.success('Email de vérification envoyé !');
    } catch (error: any) {
      console.error('Error resending verification email:', error);
      toast.error(error.message || 'Erreur lors de l\'envoi de l\'email de vérification');
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      
      setProfile(null);
      toast.success('Déconnexion réussie');
      navigate('/login');
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast.error(error.message || 'Une erreur est survenue lors de la déconnexion');
    }
  };
  
  // Fonctions helper pour vérifier le rôle
  const isAdmin = () => profile?.role === 'admin';
  const isDriver = () => profile?.role === 'conducteur';
  const isPassenger = () => profile?.role === 'passager';

  const value = {
    user,
    session,
    profile,
    isLoading,
    signUp,
    signIn,
    signOut,
    resendVerificationEmail,
    fetchUserProfile,
    isAdmin,
    isDriver,
    isPassenger,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
