import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import clsx from 'clsx';

import { authAction_v2 } from '@/api';
import { Brand, ThemeSelection } from '@/components';
import { ROUTE } from '@/constants/serverConfig';
import font from '@/assets/fonts';

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await authAction_v2.authenticate();
  if (session) redirect(ROUTE.DASHBOARD);

  return (
    <div className={clsx('relative', 'w-screen h-screen overflow-y-auto')}>
      <div
        className={clsx(
          'py-2 px-4',
          'sticky top-0 left-0',
          'w-full flex justify-between items-center',
        )}
      >
        <Brand className="h-8" />
        <ThemeSelection />
      </div>

      <main className={clsx('flex justify-center', 'pt-12 pb-20')}>
        <div className="w-80">
          <Link className="block mb-2" href={ROUTE.LANDING}>
            <span className="sr-only">Home</span>
            <Image src="/logo.svg" alt="logo" width={52} height={52} />
          </Link>

          <h1 className="font-bold text-2xl mb-1">Think it. Make it.</h1>

          <p
            className={clsx(
              font.roboto.className,
              'text-on-background/[.7]',
              'w-full mb-5',
            )}
          >
            Turn ideas into action with effortless task management.
          </p>

          {children}
        </div>
      </main>
    </div>
  );
}
