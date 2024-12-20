import Image from 'next/image';
import Link from 'next/link';
import { cookies } from 'next/headers';
import clsx from 'clsx';

import { Brand, ThemeSelection } from '@/components';
import { ROUTE } from '@/constants/server';
import backgroundPattern from '@/assets/images/background-pattern.png';
import illustration from '@/assets/images/illustration.webp';

export default function LandingPage() {
  return (
    <div className="w-full h-screen">
      <Header className={clsx('h-12 px-4', 'bg-foreground')} />
      <div className={clsx('h-[calc(100vh-3rem)]', 'overflow-y-auto')}>
        <Content />
      </div>
    </div>
  );
}

async function Header({ className }: Readonly<{ className?: string }>) {
  const session = (await cookies()).get('session')?.value;

  return (
    <div
      className={clsx(
        className,
        'w-full',
        'flex items-center justify-between',
        'border-b border-border',
      )}
    >
      <Brand />
      <div className="flex items-center space-x-3">
        {session ? (
          <Link
            href={ROUTE.SIGNUP}
            className="font-semibold text-sm text-on-foreground"
          >
            Dashboard
          </Link>
        ) : (
          <Link
            href={ROUTE.LOGIN}
            className="font-semibold text-sm text-on-foreground"
          >
            Log in
          </Link>
        )}
        <span className={clsx('h-6', 'border-r border-border')} />
        <ThemeSelection />
      </div>
    </div>
  );
}

function Content() {
  return (
    <section
      className={clsx(
        'relative',
        'min-h-full lg:h-full',
        'py-12 sm:py-16 lg:pb-20',
      )}
    >
      <div className={clsx('absolute bottom-0 right-0', 'overflow-hidden')}>
        <Image
          src={backgroundPattern.src}
          alt="background-pattern"
          width={backgroundPattern.width}
          height={backgroundPattern.height}
          className={clsx(
            'origin-bottom-right',
            'transform scale-150 lg:scale-75',
            'theme-invert',
          )}
        />
      </div>

      <div
        className={clsx(
          'relative',
          'h-full max-w-7xl',
          'px-4 mx-auto sm:px-6 lg:px-8',
        )}
      >
        <div
          className={clsx(
            'h-full',
            'grid gap-y-4',
            'grid-cols-1 lg:items-center lg:grid-cols-2',
          )}
        >
          <div
            className={clsx(
              'xl:col-span-1',
              'md:px-16 lg:px-0 xl:pr-20',
              'text-center lg:text-left',
            )}
          >
            <h1
              className={clsx(
                'text-4xl font-bold leading-tight',
                'sm:text-5xl sm:leading-tight',
                'lg:text-6xl lg:leading-tight',
                'text-contrast/[.9]',
              )}
            >
              Simple, flexible, and powerful.
            </h1>
            <p className={clsx('mt-2 sm:mt-6', 'text-lg')}>
              All it takes are boards, lists, and cards to get a clear view of
              what needs to get done.
            </p>

            <Link
              href={ROUTE.SIGNUP}
              className={clsx(
                'inline-flex',
                'px-8 py-4 mt-8 sm:mt-10',
                'text-lg font-bold',
                'bg-contrast/[.93] text-background',
                'transition-opacity duration-200 hover:opacity-60',
                'border border-transparent rounded',
                'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-on-background',
              )}
            >
              Sign up for free
            </Link>
          </div>

          <div
            className={clsx(
              'relative',
              'h-full',
              'aspect-square lg:aspect-auto',
              'xl:col-span-1',
            )}
          >
            <Image
              src={illustration.src}
              alt="illustration"
              fill
              sizes="100%"
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
