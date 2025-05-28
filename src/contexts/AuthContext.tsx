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
      // First, try to find the user by username
      const { data: userData, error: userError } = await supabase
        .from('auth_users')
        .select('id, username, role, password_hash')
        .eq('username', username)
        .single();

      if (userError) {
        console.error('User lookup error:', userError);
        throw new Error('Kullanıcı adı veya şifre hatalı');
      }

      if (!userData) {
        throw new Error('Kullanıcı adı veya şifre hatalı');
      }

      // Verify the password
      const { data: isValid, error: verifyError } = await supabase
        .rpc('verify_password', {
          password: password,
          hash: userData.password_hash
        });

      if (verifyError) {
        console.error('Password verification error:', verifyError);
        throw new Error('Kullanıcı adı veya şifre hatalı');
      }

      if (!isValid) {
        throw new Error('Kullanıcı adı veya şifre hatalı');
      }

      // If we get here, authentication was successful
      const user = {
        id: userData.id,
        username: userData.username,
        role: userData.role as 'admin' | 'user'
      };

      setUser(user);
      localStorage.setItem('auth_user', JSON.stringify(user));

    } catch (error) {
      console.error('Login error:', error);
      throw error instanceof Error ? error : new Error('Giriş yapılırken bir hata oluştu');
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('auth_user');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const savedUser = localStorage.getItem('auth_user');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          // Verify the user still exists in the database
          const { data, error } = await supabase
            .from('auth_users')
            .select('id, username, role')
            .eq('id', parsedUser.id)
            .single();

          if (error || !data) {
            localStorage.removeItem('auth_user');
            setUser(null);
          } else {
            setUser(data);
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
        localStorage.removeItem('auth_user');
        setUser(null);
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