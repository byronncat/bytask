import { redirect } from 'next/navigation';
import clsx from 'clsx';
import { authAction_v2 } from '@/api';
import { Brand, ThemeSelection, Sidebar } from '@/components';
import { ROUTE } from '@/constants/serverConfig';

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await authAction_v2.authenticate();
  if (!session) redirect(ROUTE.LOGIN);

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
