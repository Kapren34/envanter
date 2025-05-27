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

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (session) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (userData) {
          setUser({
            id: userData.id,
            name: userData.full_name,
            role: userData.role,
            settings: userData.settings
          });
          setIsAuthenticated(true);
        }
      }
    };

    checkSession();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const { data, error } = await supabase.rpc('authenticate_user', {
        p_username: username,
        p_password: password
      });

      if (error) throw error;

      if (data && data.length > 0) {
        const userData = data[0];
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: `${username}@example.com`,
          password: password
        });

        if (authError) throw authError;

        setUser({
          id: userData.user_id,
          name: username,
          role: userData.role,
          settings: {
            company_name: 'POWERSOUND',
            low_stock_limit: 5,
            email_notifications: false,
            auto_backup: true
          }
        });
        setIsAuthenticated(true);
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated,
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