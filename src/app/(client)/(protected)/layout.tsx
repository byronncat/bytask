'use client';

import clsx from 'clsx';
import { Brand, ThemeSelection, Sidebar } from '@/components';

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="w-screen h-screen">
      <Header className="py-2 px-4" />
      <div className={clsx('h-[calc(100vh-3rem-1px)]', 'flex')}>
        <Sidebar className={clsx('h-full', 'flex-shrink-0', 'relative z-10')} />
        <main className="flex-grow relative">{children}</main>
      </div>
    </div>
  );
}

function Header({ className }: Readonly<{ className?: string }>) {
  return (
    <div
      className={clsx(
        className,
        'w-full',
        'flex items-center justify-between',
        'border-b border-divider',
      )}
    >
      <Brand className="h-8" />
      <ThemeSelection />
    </div>
  );
}
