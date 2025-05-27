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

  // Load user from localStorage on mount (persist login)
  useEffect(() => {
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem('authUser');
      }
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      // Call your custom RPC to verify username/password
      const { data, error } = await supabase.rpc('authenticate_user', {
        p_username: username,
        p_password: password,
      });
      console.log('RPC data:', data, 'RPC error:', error);

      if (error) throw error;

      if (data && data.length > 0) {
        const userData = data[0];

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

        localStorage.setItem('authUser', JSON.stringify(userObj));
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
      // You may or may not want to sign out from Supabase Auth,
      // since you use custom RPC auth, but calling it won't hurt.
      await supabase.auth.signOut();

      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('authUser');
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
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
