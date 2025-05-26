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

  const login = async (username: string, password: string) => {
    try {
      // Call the authenticate_user function
      const { data: authData, error: authError } = await supabase
        .rpc('authenticate_user', {
          p_username: username,
          p_password: password
        });

      if (authError) {
        console.error('Authentication error:', authError);
        throw new Error('Kimlik doğrulama başarısız');
      }

      if (!authData || authData.length === 0) {
        throw new Error('Geçersiz kullanıcı adı veya şifre');
      }

      // Get user details
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, full_name, role, settings')
        .eq('id', authData[0].user_id)
        .single();

      if (userError) {
        console.error('User data error:', userError);
        throw new Error('Kullanıcı bilgileri alınamadı');
      }

      setUser({
        id: userData.id,
        name: userData.full_name,
        role: userData.role as 'admin' | 'user',
        settings: userData.settings
      });

    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
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