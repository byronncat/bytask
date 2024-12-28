'use client';

import Image from 'next/image';
import clsx from 'clsx';
import workspaceIcon from '@/assets/images/workspace-icon.webp';
import { useAuth } from '@/providers';

export default function Header() {
  const { user } = useAuth();
  return (
    <header className={clsx('flex items-center')}>
      <div className={clsx('size-15', 'rounded-md overflow-hidden')}>
        <Image
          width={60}
          height={60}
          src={workspaceIcon.src}
          alt="workspace-icon"
        />
      </div>
      <div className="flex flex-col">
        <h1 className={clsx('text-xl font-bold tracking-wide', 'ml-4')}>
          {user?.name || 'Workspace'}
        </h1>
        <h2 className={clsx('text-sm text-on-background/[.6]', 'ml-4')}>
          {user?.email}
        </h2>
      </div>
    </header>
  );
}
