'use client';

import Image from 'next/image';
import clsx from 'clsx';
import { useAuth } from '@/providers';
import { Divider } from '@/components';
import workspaceIcon from '@/assets/images/workspace-icon.webp';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={clsx('size-full max-w-7xl', 'mx-auto p-8', 'overflow-y-auto')}
    >
      <Header />
      <Divider className="my-8" />
      {children}
    </div>
  );
}

function Header() {
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
