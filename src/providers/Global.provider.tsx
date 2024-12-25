'use client';

import { useContext, useState, createContext } from 'react';

const GlobalContext = createContext(
  {} as {
    reloadTrigger: boolean;
    reload: () => void;
  },
);

export const useGlobal = () => useContext(GlobalContext);

export default function GlobalProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [_, set_] = useState(true);

  return (
    <GlobalContext.Provider
      value={{
        reloadTrigger: _,
        reload: () => set_((prev) => !prev),
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
