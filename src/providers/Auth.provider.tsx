'use client';

import { useRouter } from 'next/navigation';
import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
} from 'react';
import { authAction } from '@/api';
import { ROUTE } from '@/constants/server';
import type { IUser } from 'schema';

const AuthContext = createContext(
  {} as {
    user?: IUser;
    login: () => void;
    logout: () => void;
  },
);
export const useAuth = () => useContext(AuthContext);

export default function AuthenticationProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const [user, setUser] = useState<IUser>();

  const fetchUser = useCallback(async () => {
    const { success, data } = await authAction.authenticate();
    if (success) setUser(data);
  }, []);

  const login = useCallback(() => {
    router.push(ROUTE.DASHBOARD);
    fetchUser();
  }, [router, fetchUser]);

  const logout = useCallback(async () => {
    const { success } = await authAction.logout();
    if (!success) return;
    router.push(ROUTE.LOGIN);
    setUser(undefined);
  }, [router]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
