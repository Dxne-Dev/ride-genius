
import { Session, User } from '@supabase/supabase-js';
import { UserProfile, UserRole } from '@/types';

export interface AuthContextType {
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
}
