'use client';

import type { Mission } from 'schema';
import type { Option } from '@/app/(client)/(protected)/(management)/(container)/dashboard/_components';

import {
  useContext,
  createContext,
  useState,
  // useEffect,
  useCallback,
} from 'react';
import { missionAction } from '@/api';

const MissionManagementContext = createContext(
  {} as {
    missions: Mission[] | undefined;
    setMissions: React.Dispatch<React.SetStateAction<Mission[] | undefined>>;
    isFetching: boolean;
    setIsFetching: React.Dispatch<React.SetStateAction<boolean>>;
    fetchMissions: (query?: Option['query']) => Promise<boolean>;
  },
);

export const useMission = () => useContext(MissionManagementContext);

export default function MissionManagementProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [missions, setMissions] = useState<Mission[]>();
  const [isFetching, setIsFetching] = useState(true);

  const fetchMissions = useCallback(async function (query?: Option['query']) {
    setIsFetching(true);
    const { success, data } = await missionAction.getMany(query);
    if (success) setMissions(data);
    setIsFetching(false);
    return success;
  }, []);

  // useEffect(() => {
  //   fetchMissions();
  // }, [fetchMissions]);

  return (
    <MissionManagementContext.Provider
      value={{
        missions,
        setMissions,
        isFetching,
        setIsFetching,
        fetchMissions,
      }}
    >
      {children}
    </MissionManagementContext.Provider>
  );
}
