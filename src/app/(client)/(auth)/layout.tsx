import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

import { Brand, ThemeSelection } from '@/components';
import { ROUTE } from '@/constants/serverConfig';
import font from '@/assets/fonts';

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={clsx('relative', 'w-screen h-screen')}>
      <div
        className={clsx(
          'py-2 px-4',
          'absolute top-0 left-0',
          'w-full flex justify-between items-center',
        )}
      >
        <Brand className="h-8" />
        <ThemeSelection />
      </div>

      <main className={clsx('flex items-center justify-center', 'size-full')}>
        <div className="w-80">
          <Link className="block mb-3" href={ROUTE.LANDING}>
            <span className="sr-only">Home</span>
            <Image src="/logo.svg" alt="logo" width={60} height={60} />
          </Link>

          <h1 className={clsx('font-bold text-2xl', 'mb-2')}>
            Think it. Make it.
          </h1>

          <p
            className={clsx(
              font.roboto.className,
              'text-on-background/[.7]',
              'w-full mb-6',
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
