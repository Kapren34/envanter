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
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (session?.session?.user) {
        const { data: userData, error } = await supabase
          .from('users')
          .select('id, full_name, role, settings')
          .single();

        if (!error && userData) {
          setUser({
            id: userData.id,
            name: userData.full_name,
            role: userData.role as 'admin' | 'user',
            settings: userData.settings
          });
        }
      }
    } catch (error) {
      console.error('Session check error:', error);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      // First authenticate using our custom RPC function
      const { data: authData, error: authError } = await supabase
        .rpc('authenticate_user', {
          p_username: username,
          p_password: password
        });

      if (authError) throw authError;

      if (!authData || !authData.user_id) {
        throw new Error('Geçersiz kullanıcı adı veya şifre');
      }

      // If authenticated, get user details using the user_id from the RPC response
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, full_name, role, settings')
        .eq('id', authData.user_id)
        .single();

      if (userError) throw userError;

      if (!userData) {
        throw new Error('Kullanıcı bilgileri bulunamadı');
      }

      // Set user in state
      setUser({
        id: userData.id,
        name: userData.full_name,
        role: userData.role as 'admin' | 'user',
        settings: userData.settings
      });

    } catch (error) {
      console.error('Login error:', error);
      throw error instanceof Error ? error : new Error('Geçersiz kullanıcı adı veya şifre');
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
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