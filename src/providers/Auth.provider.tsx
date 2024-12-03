'use client';

import { useRouter } from 'next/navigation';
import { createContext, useContext } from 'react';

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
    router.push('/');
  };
  const logout = () => {
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
