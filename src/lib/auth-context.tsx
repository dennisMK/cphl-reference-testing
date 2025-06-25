"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { checkTokenExpiration, getTokenFromCookie } from './token-utils';
import { clearAuthCookie } from './auth-utils-client';

interface User {
  id: number;
  username: string;
  name: string;
  email: string | null;
  facility_id: number | null;
  facility_name: string | null;
  hub_id: number | null;
  hub_name: string | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  tokenExpiresAt: Date | null;
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tokenExpiresAt, setTokenExpiresAt] = useState<Date | null>(null);
  const router = useRouter();

  // Check authentication status and fetch user data
  const checkAuth = async () => {
    try {
      // First check token expiration client-side
      const token = getTokenFromCookie();
      if (token) {
        const tokenInfo = checkTokenExpiration(token);
        setTokenExpiresAt(tokenInfo.expiresAt);
        
        if (!tokenInfo.isValid) {
          console.log('Token expired, clearing auth state');
          // Don't call logout() to avoid infinite loops, just clear state
          clearAuthCookie();
          setUser(null);
          setIsAuthenticated(false);
          setTokenExpiresAt(null);
          setIsLoading(false);
          return;
        }
      } else {
        // No token found, clear auth state
        setUser(null);
        setIsAuthenticated(false);
        setTokenExpiresAt(null);
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/auth/me');
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        // If auth check fails (token expired/invalid), clear state
        console.log('Server auth check failed, clearing auth state');
        clearAuthCookie();
        setUser(null);
        setIsAuthenticated(false);
        setTokenExpiresAt(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      clearAuthCookie();
      setUser(null);
      setIsAuthenticated(false);
      setTokenExpiresAt(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update auth state immediately
        setUser(data.user);
        setIsAuthenticated(true);
        setIsLoading(false);
        
        // Redirect to dashboard
        window.location.href = '/dashboard';
        return; // Success - don't throw error
      } else {
        // Login failed - throw error for form to handle
        setIsLoading(false);
        throw new Error(data.error || 'Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      throw error; // Re-throw for form error handling
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear client-side auth state and cookies
      clearAuthCookie();
      setUser(null);
      setIsAuthenticated(false);
      setTokenExpiresAt(null);
      
      // Use window.location.href for immediate redirect
      window.location.href = '/auth/login';
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    await checkAuth();
  };

  // Check authentication on mount only
  useEffect(() => {
    checkAuth();
  }, []); // Empty dependency array - only run on mount

  // Set up periodic token validation
  useEffect(() => {
    // Check token validity every 5 minutes, but only if authenticated
    const interval = setInterval(() => {
      if (isAuthenticated) {
        checkAuth();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshUser,
    tokenExpiresAt,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook to get user data (convenience hook)
export function useUser() {
  const { user, isLoading } = useAuth();
  return { user, isLoading };
} 