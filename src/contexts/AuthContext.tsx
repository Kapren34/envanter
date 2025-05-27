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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Aktif session kontrolü
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setUser({
          id: data.session.user.id,
          email: data.session.user.email,
          role: 'user', // istersen role'u DB'den çekebilirsin
        });
      }
    });

    // Auth state değişikliklerini dinle (login, logout, expire)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          role: 'user', // istersen role'u DB'den çekebilirsin
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = async (identifier: string, password: string) => {
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
  let emailToUse = identifier;

  if (!isEmail) {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('email')
      .eq('username', identifier)
      .single();

    if (userError) {
      console.error('Kullanıcı sorgu hatası:', userError);
      throw new Error('Kullanıcı adı bulunamadı');
    }

    if (!userData?.email) {
      throw new Error('Kullanıcıya ait email bulunamadı');
    }
    emailToUse = userData.email;
  }

  const { error } = await supabase.auth.signInWithPassword({ email: emailToUse, password });

  if (error) {
    console.error('Supabase giriş hatası:', error);
    throw new Error('Geçersiz kullanıcı adı veya şifre');
  }
};


  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
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
