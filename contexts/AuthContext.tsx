import React, { createContext, useMemo, useContext, useState } from 'react';

type AuthContextValue = {
  isAuthenticated: boolean;
  setAuthenticated: (value: boolean) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const value = useMemo(
    () => ({ isAuthenticated, setAuthenticated }),
    [isAuthenticated],
  );
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
