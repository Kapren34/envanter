import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  email: string | null;
  role: 'admin' | 'user';
  full_name?: string;
  username?: string;
}

interface AuthContextType {
  user: User | null;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = async (userId: string) => {
    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, email, role, full_name, username')
        .eq('id', userId)
        .maybeSingle();

      if (userError) {
        console.error('Error fetching user data:', userError);
        return null;
      }

      return userData;
    } catch (error) {
      console.error('Error in fetchUserData:', error);
      return null;
    }
  };

  const refreshSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Session error:', error);
        setUser(null);
        return;
      }

      if (session?.user) {
        const userData = await fetchUserData(session.user.id);
        
        if (userData) {
          setUser({
            id: userData.id,
            email: userData.email,
            role: userData.role || 'user',
            full_name: userData.full_name,
            username: userData.username
          });
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Session refresh error:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshSession();

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const userData = await fetchUserData(session.user.id);
        
        if (userData) {
          setUser({
            id: userData.id,
            email: userData.email,
            role: userData.role,
            full_name: userData.full_name,
            username: userData.username
          });
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = async (identifier: string, password: string) => {
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: 'admin@powersound.com',
        password: 'admin123'
      });

      if (signInError) {
        console.error('Sign in error:', signInError);
        throw new Error('Giriş yapılırken bir hata oluştu');
      }

      if (!data.user) {
        throw new Error('Giriş başarısız');
      }

      const userData = await fetchUserData(data.user.id);
      
      if (!userData) {
        throw new Error('Kullanıcı bilgileri alınamadı');
      }

      setUser({
        id: userData.id,
        email: userData.email,
        role: userData.role,
        full_name: userData.full_name,
        username: userData.username
      });

    } catch (error) {
      console.error('Login error:', error);
      throw error instanceof Error ? error : new Error('Giriş işlemi başarısız oldu');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error('Password reset error:', error);
        throw new Error('Şifre sıfırlama işlemi başarısız oldu');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      throw error instanceof Error ? error : new Error('Şifre sıfırlama işlemi başarısız oldu');
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        resetPassword,
        refreshSession,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};