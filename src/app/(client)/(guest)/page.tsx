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
      <div className="h-[calc(100vh-3rem)]">
        <Content />
      </div>
    </div>
  );
}

async function Header({ className }: Readonly<{ className?: string }>) {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');

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
      <div className="flex items-center space-x-4 h-8">
        <Link
          href={ROUTE.LOGIN}
          className={clsx(
            'test-sm font-semibold',
            'px-2 h-full',
            'flex items-center',
            'transition-opacity duration-200 hover:opacity-60',
          )}
        >
          {session ? 'Dashboard' : 'Login'}
        </Link>
        <span className="border-r border-border h-6" />
        <ThemeSelection />
      </div>
    </div>
  );
}

function Content() {
  return (
    <section className={clsx('relative lg:h-full', 'py-12 sm:py-16 lg:pb-20')}>
      <BackgroundPattern className="absolute bottom-0 right-0" />

      <div
        className={clsx(
          'relative h-full',
          'px-4 sm:px-6 lg:px-8',
          'mx-auto max-w-7xl',
        )}
      >
        <div
          className={clsx(
            'h-full',
            'grid gap-y-16 lg:gap-y-4',
            'grid-cols-1 lg:grid-cols-2',
            'lg:items-center',
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
                'sm:text-5xl',
                'lg:text-6xl',
                'text-contrast/[.9]',
              )}
            >
              Simple, flexible, and powerful.
            </h1>
            <p className={clsx('mt-2 sm:mt-6', 'text-lg')}>
              All it takes are boards, lists, and cards to get a clear view of
              what needs to get done.
            </p>

            <Button
              href={ROUTE.SIGNUP}
              className={clsx(
                'px-8 py-4',
                'mt-8 sm:mt-10',
                'text-lg font-bold',
              )}
            >
              Sign up for free
            </Button>
          </div>

          <div
            className={clsx(
              'relative',
              'xl:col-span-1 xl:h-full',
              'aspect-square xl:aspect-auto',
            )}
          >
            <Image
              src={illustration.src}
              alt="illustration"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function BackgroundPattern({ className }: Readonly<{ className?: string }>) {
  return (
    <div className={clsx('overflow-hidden', className)}>
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
  );
}

interface ButtonProps {
  children: string;
  href: string;
  className?: string;
}

function Button({ children, href, className }: Readonly<ButtonProps>) {
  return (
    <Link href={href}>
      <button
        className={clsx(
          'inline-flex',
          'bg-contrast/[.9] text-background',
          'transition-opacity duration-200 hover:opacity-60',
          'border border-transparent rounded',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-on-background',
          className,
        )}
      >
        {children}
      </button>
    </Link>
  );
}
