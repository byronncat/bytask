import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { Brand, ThemeSelection } from '@/components';

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={clsx('relative', 'w-screen h-screen')}>
      <div
        className={clsx(
          'pt-5 px-4',
          'absolute top-0 left-0',
          'w-full flex justify-between items-center',
        )}
      >
        <Brand hyperlink />
        <ThemeSelection />
      </div>
      <main className={clsx('flex items-center justify-center', 'size-full')}>
        <div className="w-80">
          <Link className="block mb-6" href="/">
            <span className="sr-only">Home</span>
            <Image src="/logo.svg" alt="logo" width={80} height={80} />
          </Link>

          <h1 className={clsx('font-bold text-3xl', 'mb-2')}>
            Think it. Make it.
          </h1>

          <p className={clsx('text-on-background/[.6] text-lg', 'w-full')}>
            Turn ideas into action with effortless task management.
          </p>
          {children}
        </div>
      </main>
    </div>
  );
}
