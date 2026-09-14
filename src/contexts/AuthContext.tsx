import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { supabase, isSupabaseConfigured } from '../services/supabase';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (name: string, email: string, password?: string, city?: string, orgId?: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo default mock profile
const DEFAULT_DEMO_USER: UserProfile = {
  id: 'usr-001',
  name: 'Aarav Sharma',
  email: 'aarav.sharma@example.in',
  role: 'user',
  city: 'Delhi',
  organization_id: 'org-mcd-01',
  created_at: '2026-09-01T10:00:00Z',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('civicai_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(false);

  // Sync Supabase Auth listener if connected
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        setUser({
          id: session.user.id,
          name: profile?.name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Citizen',
          email: session.user.email || '',
          role: (profile?.role as UserRole) || (session.user.user_metadata?.role as UserRole) || 'user',
          city: profile?.city || session.user.user_metadata?.city || 'Delhi',
          organization_id: profile?.organization_id,
          created_at: session.user.created_at,
        });
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        setUser({
          id: session.user.id,
          name: profile?.name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Citizen',
          email: session.user.email || '',
          role: (profile?.role as UserRole) || (session.user.user_metadata?.role as UserRole) || 'user',
          city: profile?.city || session.user.user_metadata?.city || 'Delhi',
          organization_id: profile?.organization_id,
          created_at: session.user.created_at,
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('civicai_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('civicai_user');
    }
  }, [user]);

  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured) return;
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
  };

  const login = async (email: string, password = 'Password@123'): Promise<boolean> => {
    setIsLoading(true);
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          console.warn('Supabase auth sign in error, falling back to local login:', error.message);
        } else if (data.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          setUser({
            id: data.user.id,
            name: profile?.name || data.user.user_metadata?.name || email.split('@')[0],
            email: data.user.email || email,
            role: (profile?.role as UserRole) || (data.user.user_metadata?.role as UserRole) || 'user',
            city: profile?.city || data.user.user_metadata?.city || 'Delhi',
            organization_id: profile?.organization_id,
            created_at: data.user.created_at,
          });
          setIsLoading(false);
          return true;
        }
      } catch (err) {
        console.warn('Supabase login exception:', err);
      }
    }

    // Demo Mode Instant Login
    const determinedRole: UserRole = email.toLowerCase().includes('admin')
      ? 'admin'
      : email.toLowerCase().includes('officer') || email.toLowerCase().includes('authority')
      ? 'authority'
      : 'user';

    setUser({
      id: `usr-${Date.now().toString(36)}`,
      name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      email,
      role: determinedRole,
      city: 'Delhi',
      created_at: new Date().toISOString(),
    });
    setIsLoading(false);
    return true;
  };

  const signup = async (
    name: string,
    email: string,
    password = 'Password@123',
    city = 'Delhi',
    orgId?: string
  ): Promise<boolean> => {
    setIsLoading(true);
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name, city, role: 'user', organization_id: orgId },
          },
        });
        if (data.user && !error) {
          setUser({
            id: data.user.id,
            name,
            email,
            role: 'user',
            city,
            organization_id: orgId,
            created_at: new Date().toISOString(),
          });
          setIsLoading(false);
          return true;
        }
      } catch (err) {
        console.warn('Supabase signup exception:', err);
      }
    }

    // Demo Mode Signup
    setUser({
      id: `usr-${Date.now().toString(36)}`,
      name,
      email,
      role: 'user',
      city,
      organization_id: orgId,
      created_at: new Date().toISOString(),
    });
    setIsLoading(false);
    return true;
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut().catch(() => {});
    }
    setUser(null);
  };

  // Hackathon demo role switcher
  const switchRole = (newRole: UserRole) => {
    if (user) {
      setUser({ ...user, role: newRole });
    } else {
      setUser({ ...DEFAULT_DEMO_USER, role: newRole });
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'user',
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        signup,
        logout,
        switchRole,
        updateProfile,
        signInWithGoogle,
      }}
    >
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
