'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

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