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

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const options = [
    {
      label: 'Light',
      onClick: () => setTheme('light'),
      icon: (
        <FontAwesomeIcon
          icon={faSunSolid}
          className={clsx(
            'size-4 mr-2',
            'inline-block',
            'text-on-foreground/[.6]',
          )}
        />
      ),
      active: theme === 'light',
    },
    {
      label: 'Dark',
      onClick: () => setTheme('dark'),
      icon: (
        <FontAwesomeIcon
          icon={faMoonSolid}
          className={clsx(
            'size-4 mr-2',
            'inline-block',
            'text-on-foreground/[.6]',
          )}
        />
      ),
      active: theme === 'dark',
    },
    {
      label: 'System',
      onClick: () => setTheme('system'),
      icon: (
        <FontAwesomeIcon
          icon={faLaptop}
          className={clsx(
            'size-4 mr-2',
            'inline-block',
            'text-on-foreground/[.6]',
          )}
        />
      ),
      active: theme === 'system',
    },
  ];

  function toggleDropdown() {
    setOpen(!open);
  }

  return (
    <div className={className}>
      <button
        className={clsx(
          'size-8',
          'relative z-10',
          'rounded-full',
          'transistion-colors duration-300',
          'flex items-center justify-center',
          open ? 'bg-on-foreground/[.12]' : 'hover:bg-on-foreground/[.12]',
        )}
        onClick={toggleDropdown}
      >
        {isClient &&
          (resolvedTheme === 'dark' ? (
            <FontAwesomeIcon
              icon={theme === 'system' ? faMoonRegular : faMoonSolid}
              className="size-6 text-on-foreground/[.8]"
            />
          ) : (
            <FontAwesomeIcon
              icon={theme === 'system' ? faSunRegular : faSunSolid}
              className="size-6 text-on-foreground/[.8]"
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
              'w-40 mr-6',
              'absolute top-20 right-0 z-10',
              'shadow-xl overflow-hidden',
              'bg-foreground rounded-md',
              'font-semibold text-on-foreground/[.8]',
              'border border-on-foreground/[.2] divide-y divide-on-foreground/[.1]',
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
                    ? 'text-on-foreground/[0.5] bg-on-surface/[0.12] animate-pulse'
                    : 'hover:bg-on-foreground/[0.08]',
                )}
                onClick={() => {
                  onClick();
                  setOpen(false);
                }}
              >
                {isClient && icon}
                {label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
