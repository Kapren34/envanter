import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
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
  const [isLoading, setIsLoading] = useState(true);

  const login = async (username: string, password: string) => {
    try {
      const { data: userData, error: userError } = await supabase
        .from('auth_users')
        .select('id, username, role, password_hash')
        .eq('username', username)
        .single();

      if (userError || !userData) {
        throw new Error('Kullanıcı adı veya şifre hatalı');
      }

      const { data: isValid, error: verifyError } = await supabase
        .rpc('verify_password', {
          password: password,
          hash: userData.password_hash
        });

      if (verifyError || !isValid) {
        throw new Error('Kullanıcı adı veya şifre hatalı');
      }

      const user = {
        id: userData.id,
        username: userData.username,
        role: userData.role as 'admin' | 'user'
      };

      setUser(user);
      localStorage.setItem('auth_user', JSON.stringify(user));

    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Kullanıcı adı veya şifre hatalı');
    }
  };

  const logout = async () => {
    localStorage.removeItem('auth_user');
    setUser(null);
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const savedUser = localStorage.getItem('auth_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Session check error:', error);
        localStorage.removeItem('auth_user');
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin'
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