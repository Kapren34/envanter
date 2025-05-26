import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  name: string;
  role: 'admin' | 'user';
  settings?: {
    company_name: string;
    low_stock_limit: number;
    email_notifications: boolean;
    auto_backup: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        const { data: userData, error } = await supabase
          .from('users')
          .select('id, full_name, role, settings')
          .eq('id', session.user.id)
          .single();

        if (!error && userData) {
          setUser({
            id: userData.id,
            name: userData.full_name,
            role: userData.role as 'admin' | 'user',
            settings: userData.settings
          });
        }
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (username: string, password: string) => {
    try {
      // First get the email for the username
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('email')
        .eq('username', username)
        .single();

      if (userError || !userData?.email) {
        throw new Error('Geçersiz kullanıcı adı veya şifre');
      }

      // Sign in with email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userData.email,
        password: password
      });

      if (error) throw error;

      if (data.user) {
        const { data: userDetails, error: userDetailsError } = await supabase
          .from('users')
          .select('id, full_name, role, settings')
          .eq('id', data.user.id)
          .single();

        if (userDetailsError) throw userDetailsError;

        if (userDetails) {
          setUser({
            id: userDetails.id,
            name: userDetails.full_name,
            role: userDetails.role as 'admin' | 'user',
            settings: userDetails.settings
          });
          return;
        }
      }
      throw new Error('Geçersiz kullanıcı adı veya şifre');
    } catch (error) {
      console.error('Giriş hatası:', error);
      throw new Error('Geçersiz kullanıcı adı veya şifre');
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};