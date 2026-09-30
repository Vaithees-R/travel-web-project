import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, LoginCredentials, RegisterCredentials } from '../types/auth';
import { api, tokenStorage, ApiError } from '../services/api';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  register: (credentials: RegisterCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore authenticated session from backend on mount/refresh
  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      const token = tokenStorage.get();
      if (!token) {
        if (isMounted) {
          setUser(null);
          setIsLoading(false);
        }
        return;
      }

      try {
        const me = await api.auth.me();
        if (isMounted) {
          setUser(me);
        }
      } catch (err) {
        console.warn('Session verification failed, resetting token', err);
        tokenStorage.clear();
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const res = await api.auth.login(credentials);
      setUser(res.user);
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      const message = err instanceof ApiError ? err.message : 'Invalid email or password.';
      return { success: false, error: message };
    }
  }, []);

  const register = useCallback(async (credentials: RegisterCredentials): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const res = await api.auth.register(credentials);
      setUser(res.user);
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      const message = err instanceof ApiError ? err.message : 'Registration failed. Please try again.';
      return { success: false, error: message };
    }
  }, []);

  const logout = useCallback(() => {
    api.auth.logout();
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
