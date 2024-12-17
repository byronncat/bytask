import Image from 'next/image';
import Link from 'next/link';
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

function Header({ className }: Readonly<{ className?: string }>) {
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
      <ThemeSelection />
    </div>
  );
}

function Content() {
  return (
    <section className={clsx('relative lg:h-full', 'py-12 sm:py-16 lg:pb-20')}>
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
          'relative h-full',
          'px-4 mx-auto max-w-7xl sm:px-6 lg:px-8',
        )}
      >
        <div
          className={clsx(
            'grid gap-y-16 lg:gap-y-4 h-full',
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
                'px-8 py-4 mt-8',
                'text-lg font-bold',
                'bg-contrast/[.9] text-background',
                'transition-opacity duration-200 hover:opacity-60',
                'border border-transparent rounded',
                'sm:mt-10',
                'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-on-background',
              )}
            >
              Sign up for free
            </Link>
          </div>

          <div className="xl:col-span-1 w-full aspect-square lg:aspect-auto	 lg:h-full relative">
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
