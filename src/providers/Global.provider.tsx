'use client';

import { useContext, useState, createContext } from 'react';

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
      {children}
    </GlobalContext.Provider>
  );
}
