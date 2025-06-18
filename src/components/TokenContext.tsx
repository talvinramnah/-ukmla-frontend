'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// TokenContext provides React context for tokens and helpers for use in components.
// Also provides get/set/clear helpers for use in non-component code (API utilities, etc).
// - useTokens(): React hook for components
// - getCurrentTokens(): get tokens from localStorage (client-side only)
// - setTokensInStorage(): set tokens in localStorage
// - clearTokensInStorage(): clear tokens from localStorage

interface TokenContextType {
  accessToken: string | null;
  refreshToken: string | null;
  setTokens: (access: string, refresh: string) => void;
  clearTokens: () => void;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export function TokenProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  const setTokens = (access: string, refresh: string) => {
    setAccessToken(access);
    setRefreshToken(refresh);
    // Optionally persist to localStorage here
  };

  const clearTokens = () => {
    setAccessToken(null);
    setRefreshToken(null);
    // Optionally clear from localStorage here
  };

  return (
    <TokenContext.Provider value={{ accessToken, refreshToken, setTokens, clearTokens }}>
      {children}
    </TokenContext.Provider>
  );
}

export function useTokens() {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error('useTokens must be used within a TokenProvider');
  }
  return context;
}

// Helper to get tokens outside of React components (for API utilities)
// Note: Use with care. Reads from localStorage, so only works client-side.
export function getCurrentTokens(): { accessToken: string | null; refreshToken: string | null } {
  if (typeof window === 'undefined') return { accessToken: null, refreshToken: null };
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');
  return { accessToken, refreshToken };
}

// Helper to set tokens in localStorage (for use after login or refresh)
export function setTokensInStorage(accessToken: string, refreshToken: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }
}

// Helper to clear tokens from localStorage (for use on logout)
export function clearTokensInStorage() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
} 