import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  email: string | null;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const refreshSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;

      if (session?.user) {
        // Fetch user role from the database
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (userError) throw userError;

        setUser({
          id: session.user.id,
          email: session.user.email,
          role: userData?.role || 'user',
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Session refresh error:', error);
      setUser(null);
    }
  };

  useEffect(() => {
    refreshSession();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (!userError && userData) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            role: userData.role,
          });
        }
      } else {
        setUser(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = async (identifier: string, password: string) => {
    try {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
      let emailToUse = identifier;

      if (!isEmail) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('email, password_hash')
          .eq('username', identifier)
          .single();

        if (userError || !userData) {
          throw new Error('Kullanıcı adı bulunamadı');
        }

        if (!userData.email) {
          throw new Error('Kullanıcıya ait email bulunamadı');
        }

        emailToUse = userData.email;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailToUse,
        password: password
      });

      if (error) {
        if (error.message === 'Invalid login credentials') {
          throw new Error('Geçersiz kullanıcı adı veya şifre');
        }
        throw error;
      }

      if (!data.user) {
        throw new Error('Giriş başarısız');
      }

      await refreshSession();
    } catch (error) {
      console.error('Login error:', error);
      throw error instanceof Error ? error : new Error('Giriş işlemi başarısız oldu');
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
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