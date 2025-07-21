import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { UserModel } from '@/common/models/user.model';
import { useQuery } from '@tanstack/react-query';
import { AuthService } from '@/services/auth.service';
import { TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from '@/constants';

type SessionContextType = {
  token: string | null;
  user: UserModel | null;
  isLoggedIn: boolean;
  login: (token: string, userData: UserModel) => void;
  logout: () => void;
  setUser: (userData: UserModel | null) => void;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string>('');
  const [user, setUserState] = useState<UserModel | null>(null);

  const { data } = useQuery({
    queryKey: ['me'],
    queryFn: () => AuthService.me(),
    enabled: Boolean(token),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data]);

  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    const savedUser = localStorage.getItem(USER_STORAGE_KEY);

    if (savedToken) {
      setTokenState(savedToken);
    }

    if (savedUser) {
      try {
        setUserState(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }
  }, []);

  const setToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
      setTokenState(newToken);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      setTokenState('');
    }
  };

  const setUser = (userData: UserModel | null) => {
    if (userData) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      setUserState(userData);
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
      setUserState(null);
    }
  };

  const login = (newToken: string, userData: UserModel) => {
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const value: SessionContextType = {
    token,
    user,
    isLoggedIn: !!token,
    login,
    logout,
    setUser,
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
