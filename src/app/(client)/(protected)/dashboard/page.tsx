'use client';

import clsx from 'clsx';
import { Divider } from '@/components';
import { MissionManagementProvider } from '@/providers';
import { Header, QueryControls, MissionBoards } from './_components';

export default function DashboardPage() {
  return (
    <MissionManagementProvider>
      <div
        className={clsx('size-full max-w-7xl', 'mx-auto', 'overflow-y-auto')}
      >
        <Header />
        <Divider className="mx-8" />
        <div className="p-8">
          <QueryControls />
          <MissionBoards />
        </div>
      </div>
    </MissionManagementProvider>
  );
}
