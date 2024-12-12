'use client';

import { useRouter } from 'next/navigation';
import { createContext, useContext } from 'react';
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
  const logout = () => {
    router.push(ROUTE.LOGIN);
  };

  return (
    <AuthContext.Provider value={{ login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
