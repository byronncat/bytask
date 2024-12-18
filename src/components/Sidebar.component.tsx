'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import clsx from 'clsx';
import {
  faChevronLeft,
  faChevronRight,
  faTableList,
  faCalendarDays,
  faGear,
  faHouse,
  faChartSimple,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAuth } from '@/providers';
import { Divider } from '@/components';
import { ROUTE } from '@/constants/server';
import workSpace from '@/assets/images/workspace-icon.webp';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';

export default function Sidebar({
  className,
}: Readonly<{ className: string }>) {
  const [minimized, setMinimized] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div
      className={clsx(
        className,
        'flex flex-col',
        'group box-content',
        'bg-foreground/[.7] backdrop-blur',
        'border-r border-border',
        'transition-[width] duration-300',
        minimized
          ? 'w-4 cursor-pointer hover:bg-foreground'
          : 'w-64 overflow-y-auto',
      )}
      onClick={minimized ? () => setMinimized(false) : undefined}
    >
      <div
        className={clsx(
          'py-2 h-14',
          'relative',
          'flex items-center',
          !minimized && 'px-3',
        )}
      >
        {!minimized && (
          <div className={clsx('flex items-center', minimized && 'hidden')}>
            <Image
              src={user?.profile_photo?.url || workSpace.src}
              alt="workspace-icon"
              width={32}
              height={32}
              className="mr-2 rounded"
            />
            <h1
              className={clsx(
                'text-on-foreground font-semibold',
                'w-36 text-ellipsis overflow-hidden',
              )}
            >
              {user?.username}
            </h1>
          </div>
        )}
        <ToggleMinimizedButton
          onClick={() => setMinimized(!minimized)}
          minimized={minimized}
        />
      </div>

      {!minimized && (
        <>
          <Divider className="w-full" />

          <div className={clsx('grow', 'text-sm', 'pt-3 pb-2 space-y-3')}>
            <ul>
              <ListItem
                type="icon"
                data={faHouse}
                text="Dashboard"
                href={ROUTE.DASHBOARD}
              />
              <ListItem
                type="icon"
                data={faChartSimple}
                text="Statistics"
                href={ROUTE.STATISTICS}
              />
              <ListItem type="icon" data={faGear} text="Workspace settings" />
            </ul>

            <div className="w-full">
              <Heading>Workspace views</Heading>
              <ul className="pt-1">
                <ListItem
                  type="icon"
                  data={faTableList}
                  text="Table"
                  href={ROUTE.TALBE_VIEW}
                  textItalic
                />
                <ListItem
                  type="icon"
                  data={faCalendarDays}
                  text="Calendar"
                  href={ROUTE.CALENDAR_VIEW}
                  textItalic
                />
              </ul>
            </div>

            <div className="w-full">
              <Heading>Missions</Heading>
              <ul className="pt-1">
                <ListItem
                  type="image"
                  data={{
                    src: 'https://via.placeholder.com/24',
                    alt: 'Workspace',
                  }}
                  text="Music App"
                  href={ROUTE.BOARD_VIEW}
                />
              </ul>
            </div>
          </div>

          <Divider className="w-full" />

          <div className="py-2">
            <ListItem
              type="icon"
              data={faRightFromBracket}
              text="Logout"
              className="text-sm"
              onClick={logout}
            />
          </div>
        </>
      )}
    </div>
  );
}

function Heading({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="pl-3 py-1">
      <h2
        className={clsx(
          'font-semibold whitespace-nowrap',
          'h-6',
          'flex items-center',
        )}
      >
        {children}
      </h2>
    </div>
  );
}

interface ListItemProps {
  children?: React.ReactNode;
  text?: string;
  textItalic?: boolean;
  type: 'icon' | 'image' | 'text-only';
  data: NextImage | IconProp;
  href?: string;
  className?: string;
  onClick?: () => void;
}

function ListItem({
  children,
  textItalic = false,
  type = 'text-only',
  data,
  text = '',
  href,
  className,
  onClick,
}: Readonly<ListItemProps>) {
  const Item = (
    <li
      className={clsx(
        'h-8 px-3',
        'flex items-center',
        'cursor-pointer',
        'hover:bg-on-foreground/[.1]',
        className,
      )}
    >
      {type === 'icon' ? (
        <div className={clsx('flex justify-center', 'w-5 mr-2')}>
          <FontAwesomeIcon icon={data as IconProp} />
        </div>
      ) : type === 'image' ? (
        <div
          className={clsx(
            'w-6 h-5 mr-2',
            'rounded overflow-hidden',
            'relative',
          )}
        >
          <Image
            src={(data as NextImage).src}
            alt={(data as NextImage).alt}
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
      ) : null}
      <span className={clsx(textItalic && 'italic', 'whitespace-nowrap')}>
        {text || children}
      </span>
    </li>
  );

  if (href) return <Link href={href}>{Item}</Link>;
  if (onClick)
    return (
      <button type="button" onClick={onClick} className="w-full">
        {Item}
      </button>
    );
  return Item;
}

interface ToggleMinimizedButtonProps {
  onClick: () => void;
  minimized: boolean;
}

function ToggleMinimizedButton({
  onClick,
  minimized,
}: Readonly<ToggleMinimizedButtonProps>) {
  return (
    <button
      type="button"
      className={clsx(
        'absolute top-1/2 transform -translate-y-1/2',
        'bg-foreground box-content',
        'border-on-foreground/[.2]',
        'cursor-pointer overflow-hidden',
        minimized
          ? 'size-6 rounded-full border-2 -right-4'
          : 'size-8 rounded right-3',
      )}
    >
      <div
        className={clsx(
          'size-full',
          'flex items-center justify-center',
          'hover:bg-on-foreground/[.1]',
          minimized
            ? 'group-hover:bg-on-foreground/[.1]'
            : 'bg-on-foreground/[.03]',
        )}
        onClick={onClick}
      >
        <FontAwesomeIcon
          icon={minimized ? faChevronRight : faChevronLeft}
          className="text-on-foreground size-3"
        />
      </div>
    </button>
  );
}
