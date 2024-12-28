'use client';

import type { User } from 'schema';
import type { SessionPayload } from 'api';
import type { LoginFormData } from '@/constants/form';

import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
} from 'react';
import { authAction_v2 } from '@/api';
import { toast } from '@/libraries/toast';

const AuthContext = createContext(
  {} as {
    user?: SessionPayload;
    updateUserData: (data: Partial<User>) => void;
    login: (
      type: 'credentials' | 'google',
      data?: LoginFormData,
    ) => Promise<void>;
    logout: () => void;
    fetchUser: () => Promise<void>;
  },
);
export const useAuth = () => useContext(AuthContext);

export default function AuthenticationProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [user, setUser] = useState<SessionPayload>();

  const fetchUser = useCallback(async () => {
    const session = await authAction_v2.authenticate();
    if (!session) return;
    setUser(session.user);
  }, []);

  const login = async (
    type: 'credentials' | 'google',
    data?: LoginFormData,
  ) => {
    if (type === 'google') await authAction_v2.googleLogin();

    if (!data) return;
    const { success, message } = await authAction_v2.login(data);
    if (!success) toast.error(message);
  };

  const logout = async () => {
    setUser(undefined);
    await authAction_v2.logout();
  };

  const updateUserData = (data: Partial<User>) => {
    setUser({
      ...user,
      name: data.username,
    } as SessionPayload);
  };

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        updateUserData,
        login,
        logout,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
