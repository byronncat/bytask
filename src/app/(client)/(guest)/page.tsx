import Image from 'next/image';
import Link from 'next/link';
import { cookies } from 'next/headers';
import clsx from 'clsx';

import { Brand, ThemeSelection } from '@/components';
import { ROUTE } from '@/constants/serverConfig';
import backgroundPattern from '@/assets/images/background-pattern.png';
import illustration from '@/assets/images/illustration.png';

export default function LandingPage() {
  return (
    <div className="w-full h-screen">
      <Header className={clsx('px-4 py-2', 'bg-foreground')} />
      <div className={clsx('h-[calc(100vh-3rem-1px)]', 'overflow-y-auto')}>
        <Content />
      </div>
    </div>
  );
}

async function Header({ className }: Readonly<{ className?: string }>) {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;

  const isLogged = session ? true : false;
  return (
    <div className={clsx('w-full', 'border-b border-divider', className)}>
      <div className={clsx('flex items-center justify-between', 'h-8')}>
        <Brand className="h-8" />
        <div className={clsx('flex items-center', 'space-x-3')}>
          <Link
            href={isLogged ? ROUTE.DASHBOARD : ROUTE.LOGIN}
            className="font-semibold text-sm"
          >
            {isLogged ? 'Dashboard' : 'Log in'}
          </Link>
          <span className={clsx('h-6', 'border-r border-divider')} />
          <ThemeSelection />
        </div>
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
        'flex items-center justify-center',
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
            'dark:invert',
          )}
        />
      </div>

      <div
        className={clsx('relative', 'h-full max-w-7xl', 'px-4 sm:px-6 lg:px-8')}
      >
        <div
          className={clsx(
            'h-full',
            'grid gap-y-16',
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
                'text-black dark:text-white',
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
                'bg-primary text-background',
                'transition-opacity duration-200 hover:opacity-60',
                'border border-transparent rounded',
              )}
            >
              Sign up for free
            </Link>
          </div>

          <div
            className={clsx(
              'relative',
              'w-full h-full aspect-video	',
              'xl:col-span-1',
            )}
          >
            <Image
              src={illustration.src}
              alt="illustration"
              fill
              sizes="100%"
              className="object-contain"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
