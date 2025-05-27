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
  // Supabase expects email for signIn, so your "username" must be an email or adapt accordingly
  const { data, error } = await supabase.auth.signInWithPassword({
    email: username,
    password,
  });

  if (error) throw error;

  if (data.session?.access_token && data.user) {
    const token = data.session.access_token;

    const userObj: User = {
      id: data.user.id,
      name: data.user.email || username,
      role: 'user', // you can extend this by fetching role separately if needed
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
    localStorage.setItem('accessToken', token);

    // This sets the auth token internally for future requests
    supabase.auth.setSession({ access_token: token, refresh_token: data.session.refresh_token });
  } else {
    throw new Error('No access token received from server');
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
