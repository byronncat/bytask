'use client';

import { useRouter } from 'next/navigation';
import { createContext, useContext, useCallback } from 'react';
import { authAction } from '@/api';
import { ROUTE } from '@/constants/server';

const AuthContext = createContext(
  {} as {
    login: () => void;
    logout: () => void;
  },
);
export const useAuth = () => useContext(AuthContext);

export default function AuthenticationProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();

  const login = () => {
    router.push(ROUTE.DASHBOARD);
  };

  const logout = useCallback(async () => {
    const { success } = await authAction.logout();
    if (!success) return;
    router.push(ROUTE.LOGIN);
  }, [router]);

  return (
    <AuthContext.Provider value={{ login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
