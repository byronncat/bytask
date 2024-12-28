'use client';

import { MissionManagementProvider } from '@/providers';
import { QueryControls, MissionBoards } from './_components';

export default function DashboardPage() {
  return (
    <MissionManagementProvider>
      <div className="p-8">
        <QueryControls />
        <MissionBoards />
      </div>
    </MissionManagementProvider>
  );
}
