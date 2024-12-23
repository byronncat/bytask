'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import clsx from 'clsx';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSun as faSunRegular,
  faMoon as faMoonRegular,
} from '@fortawesome/free-regular-svg-icons';
import {
  faSun as faSunSolid,
  faMoon as faMoonSolid,
  faLaptop,
} from '@fortawesome/free-solid-svg-icons';

export default function ThemeSelection({
  className,
}: Readonly<{ className?: string }>) {
  const [open, setOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  const options = [
    {
      label: 'Light',
      onClick: () => setTheme('light'),
      icon: faSunSolid,
      active: theme === 'light',
    },
    {
      label: 'Dark',
      onClick: () => setTheme('dark'),
      icon: faMoonSolid,
      active: theme === 'dark',
    },
    {
      label: 'System',
      onClick: () => setTheme('system'),
      icon: faLaptop,
      active: theme === 'system',
    },
  ];

  function toggleDropdown() {
    setOpen(!open);
  }

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className={className}>
      <button
        className={clsx(
          'size-8 rounded-full',
          'relative z-10',
          'transistion-colors duration-300',
          'flex items-center justify-center',
          open ? 'bg-on-background/[.12]' : 'hover:bg-on-background/[.12]',
        )}
        onClick={toggleDropdown}
      >
        {isClient &&
          (resolvedTheme === 'dark' ? (
            <FontAwesomeIcon
              icon={theme === 'system' ? faMoonRegular : faMoonSolid}
              className="size-6"
            />
          ) : (
            <FontAwesomeIcon
              icon={theme === 'system' ? faSunRegular : faSunSolid}
              className="size-6"
            />
          ))}
      </button>

      {open && (
        <>
          <span
            className={clsx('w-screen h-screen', 'absolute top-0 right-0 z-10')}
            onClick={toggleDropdown}
          />

          <div
            className={clsx(
              'w-40 mr-5',
              'absolute top-14 right-0 z-10',
              'rounded-md shadow-xl',
              'font-semibold',
              'bg-background text-on-background/[.9]',
              'border border-divider divide-y divide-divider',
            )}
          >
            {options.map(({ label, onClick, icon, active }) => (
              <button
                disabled={active}
                key={label}
                className={clsx(
                  'text-left',
                  'w-full px-4 py-2',
                  'flex items-center',
                  active
                    ? clsx('animate-pulse text-on-background dark:text-white')
                    : 'hover:bg-on-foreground/[0.08]',
                )}
                onClick={() => {
                  onClick();
                  setOpen(false);
                }}
              >
                {isClient && (
                  <FontAwesomeIcon
                    icon={icon}
                    className={clsx('size-4 mr-2', 'inline-block')}
                  />
                )}
                {label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
