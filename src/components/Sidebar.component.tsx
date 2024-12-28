'use client';

import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import type { Mission } from 'schema';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
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
  faUser,
  faThumbTack,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// import { missionAction } from '@/api';
import { useAuth } from '@/providers';
import { Divider } from '@/components';
import { ROUTE } from '@/constants/serverConfig';
import workspace from '@/assets/images/workspace-icon.webp';

export default function Sidebar({
  className,
}: Readonly<{ className: string }>) {
  const [minimized, setMinimized] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [
    missions,
    //  setMissions
  ] = useState<Mission[] | null>();
  const { user, logout, fetchUser } = useAuth();

  async function fetchMissions() {
    setFetching(true);
    // const { success, data } = await missionAction.getMany();
    // if (success) setMissions(data);
    // else setMissions(null);
    setFetching(false);
  }

  useEffect(() => {
    fetchUser();
    fetchMissions();
  }, [fetchUser]);

  return (
    <div
      className={clsx(
        className,
        'flex flex-col',
        'group box-content',
        'backdrop-blur',
        'border-r border-divider',
        'transition-[width] duration-200',
        minimized
          ? 'w-4 cursor-pointer hover:bg-background bg-background/[.9]'
          : 'w-64 overflow-y-auto bg-background/[.8]',
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
              src={workspace.src}
              alt="workspace-icon"
              width={32}
              height={32}
              className="mr-2 rounded"
            />
            <h1
              className={clsx(
                'font-semibold',
                'w-36 text-ellipsis overflow-hidden whitespace-nowrap',
              )}
            >
              {user?.name}
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

          <div className={clsx('grow', 'text-sm', 'pt-3 pb-2', 'space-y-3')}>
            <ul>
              <ListItem
                type="icon"
                data={faHouse}
                text="Dashboard"
                href={ROUTE.DASHBOARD}
              />
              <ListItem
                type="icon"
                data={faUser}
                text="Profile"
                href={ROUTE.PROFILE}
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
                {fetching
                  ? Array.from({ length: 7 }).map((_, index) => (
                      <MissionSkeleton key={index} />
                    ))
                  : missions?.map((mission) => (
                      <ListItem
                        key={mission.id}
                        type="icon"
                        data={faThumbTack}
                        iconClassName="rotate-45"
                        text={mission.title}
                        href={`${ROUTE.BOARD_VIEW}/${mission.id}`}
                      />
                    ))}
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
          'h-6',
          'flex items-center',
          'font-semibold whitespace-nowrap',
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
  data?: NextImage | IconProp;
  href?: string;
  className?: string;
  iconClassName?: string;
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
  iconClassName,
  onClick,
}: Readonly<ListItemProps>) {
  const Item = (
    <li
      className={clsx(
        'h-8 px-3',
        'flex items-center',
        'cursor-pointer',
        'hover:bg-on-background/[.12]',
        className,
      )}
    >
      {type === 'icon' ? (
        <div className={clsx('flex justify-center', 'w-5 mr-2')}>
          <FontAwesomeIcon icon={data as IconProp} className={iconClassName} />
        </div>
      ) : type === 'image' ? (
        <div
          className={clsx(
            'relative',
            'w-6 h-5 mr-2',
            'rounded overflow-hidden',
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
        'bg-background box-content',
        'border-divider',
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
          'hover:bg-on-background/[.12]',
          minimized && 'group-hover:bg-on-background/[.12]',
        )}
        onClick={onClick}
      >
        <FontAwesomeIcon
          icon={minimized ? faChevronRight : faChevronLeft}
          className="text-on-background size-3"
        />
      </div>
    </button>
  );
}

function MissionSkeleton() {
  return (
    <div
      className={clsx('pl-3 h-8 w-full', 'animate-pulse', 'flex items-center')}
    >
      <div
        className={clsx(
          'h-3 w-1/2',
          'flex items-center',
          'bg-surface-1',
          'rounded',
        )}
      ></div>
    </div>
  );
}
