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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // On app start, load user + token from localStorage and set supabase auth
  useEffect(() => {
    const storedUser = localStorage.getItem('authUser');
    const storedToken = localStorage.getItem('accessToken');

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);

        // Set token to supabase client so requests are authenticated
        supabase.auth.setAuth(storedToken);
      } catch {
        localStorage.removeItem('authUser');
        localStorage.removeItem('accessToken');
      }
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const { data, error } = await supabase.rpc('authenticate_user', {
        p_username: username,
        p_password: password,
      });

      if (error) throw error;

      if (data && data.length > 0) {
        const userData = data[0];

        // Assume your RPC returns JWT token as access_token
        const token = userData.access_token;

        if (!token) throw new Error('No access token received from server');

        const userObj: User = {
          id: userData.user_id,
          name: username,
          role: userData.role,
          settings: {
            company_name: 'POWERSOUND',
            low_stock_limit: 5,
            email_notifications: false,
            auto_backup: true,
          },
        };

        setUser(userObj);
        setIsAuthenticated(true);

        // Save user and token in localStorage
        localStorage.setItem('authUser', JSON.stringify(userObj));
        localStorage.setItem('accessToken', token);

        // Set token for supabase client to authenticate future requests
        supabase.auth.setAuth(token);
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('authUser');
      localStorage.removeItem('accessToken');
      supabase.auth.setAuth(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
