'use client';

import { useCallback, useEffect, useState } from 'react';
import { missionAction } from '@/api';
import { Divider } from '@/components';
import { Header, QueryControls, MissionBoards } from './_components';

import type { IMission } from 'schema';
import type { Option } from './_components';

export default function DashboardPage() {
  const [missions, setMissions] = useState<IMission[]>();
  const [isFetching, setIsFetching] = useState(true);

  const fetchMissions = useCallback(async function (query?: Option['query']) {
    setIsFetching(true);
    const { success, data } = await missionAction.get(query);
    if (success) setMissions(data);
    setIsFetching(false);
    return success;
  }, []);

  useEffect(() => {
    fetchMissions();
  }, [fetchMissions]);

  return (
    <div className="size-full max-w-7xl mx-auto">
      <Header />
      <Divider className="mx-8" />
      <div className="p-8">
        <QueryControls fetchMissions={fetchMissions} />
        <MissionBoards
          data={missions}
          isFetching={isFetching}
          fetchMissions={fetchMissions}
        />
      </div>
    </div>
  );
}
