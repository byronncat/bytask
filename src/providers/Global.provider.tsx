'use client';

import { useContext, useState, createContext } from 'react';
import { ThemeProvider } from 'next-themes';
import { AuthProvider, TaskManagementProvider, TimerProvider } from '.';

const GlobalContext = createContext(
  {} as {
    _refresh: boolean;
    refresh: () => void;
  },
);

export const useGlobal = () => useContext(GlobalContext);

export default function GlobalProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [_refresh, setTrigger] = useState(false);

  function refresh() {
    setTrigger((prev) => !prev);
  }

  return (
    <GlobalContext.Provider
      value={{
        _refresh,
        refresh,
      }}
    >
      <ThemeProvider>
        <AuthProvider>
          <TaskManagementProvider>
            <TimerProvider>{children}</TimerProvider>
          </TaskManagementProvider>
        </AuthProvider>
      </ThemeProvider>
    </GlobalContext.Provider>
  );
}
