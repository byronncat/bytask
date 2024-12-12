'use client';

import { useState } from 'react';
import clsx from 'clsx';
import test from '@/assets/test.jpg';
import { Brand, Divider, ThemeSelection } from '@/components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faTableList,
  faCalendarDays,
  faGear,
  faListCheck,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import workSpace from '@/assets/workspace-icon.webp';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import Image from 'next/image';

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className="w-screen h-screen"
      // style={{
      //   backgroundImage: `url(${test.src})`,
      //   backgroundSize: 'cover',
      // }}
    >
      <div
        className={clsx(
          'w-full h-12 px-4',
          'bg-foreground',
          'flex items-center justify-between',
          'border-b border-border',
        )}
      >
        <Brand />
        <ThemeSelection />
      </div>
      <div className={clsx('h-[calc(100vh-3rem)]', 'flex')}>
        <Sidebar className="flex-shrink-0" />
        <main className="overflow-x-auto flex-grow">{children}</main>
      </div>
    </div>
  );
}

type Workspace = {
  name: string;
  description?: string;
  icon?: string;
};

const TEMP_WORKSPACE = {
  name: 'WorkspaceWorkspaceWorkspaceWorkspaceWorkspaceWorkspaceWorkspaceWorkspace',
  description: 'Workspace description',
  icon: workSpace.src,
} as Workspace;

function Sidebar({ className }: any) {
  const [minimized, setMinimized] = useState(false);
  return (
    <div
      className={clsx(
        className,
        'h-full group box-content',
        'bg-foreground/[.8] backdrop-blur',
        'border-r border-border',
        'transition-[width] duration-300',
        minimized ? 'w-4 cursor-pointer hover:bg-foreground' : 'w-64',
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
        <div className={clsx('flex items-center', minimized && 'hidden')}>
          <img
            src={TEMP_WORKSPACE.icon}
            alt="workspace-icon"
            className={clsx('size-8 mr-2', 'rounded')}
          />
          <h1
            className={clsx(
              'text-on-foreground font-semibold',
              'w-36 text-ellipsis overflow-hidden',
            )}
          >
            {TEMP_WORKSPACE.name}
          </h1>
        </div>
        <ToggleMinimizedButton
          onClick={() => setMinimized(!minimized)}
          minimized={minimized}
        />
      </div>
      <Divider className="w-full" />
      <div className={clsx('text-sm', 'py-3', 'space-y-3')}>
        <ul>
          <li
            className={clsx('h-8 px-3', 'flex items-center', 'cursor-pointer')}
          >
            <div className={clsx('flex justify-center', 'w-5 mr-2')}>
              <FontAwesomeIcon icon={faListCheck} />
            </div>
            Missions
          </li>
          <li
            className={clsx('h-8 px-3', 'flex items-center', 'cursor-pointer')}
          >
            <div className={clsx('flex justify-center', 'w-5 mr-2')}>
              <FontAwesomeIcon icon={faUser} />
            </div>
            Members
          </li>
          <li
            className={clsx('h-8 px-3', 'flex items-center', 'cursor-pointer')}
          >
            <div className={clsx('flex justify-center', 'w-5 mr-2')}>
              <FontAwesomeIcon icon={faGear} />
            </div>
            Workspace settings
          </li>
        </ul>

        <div className="w-full">
          <div className="pl-3 py-1">
            <h2 className={clsx('font-semibold', 'h-6', 'flex items-center')}>
              Workspace views
            </h2>
          </div>

          <ul className={clsx('pt-1', 'italic')}>
            <li
              className={clsx(
                'h-8 px-3',
                'flex items-center',
                'cursor-pointer',
              )}
            >
              <div className={clsx('flex justify-center', 'w-5 mr-2')}>
                <FontAwesomeIcon icon={faTableList} />
              </div>
              Table
            </li>
            <li
              className={clsx(
                'h-8 px-3',
                'flex items-center',
                'cursor-pointer',
              )}
            >
              <div className={clsx('flex justify-center', 'w-5 mr-2')}>
                <FontAwesomeIcon icon={faCalendarDays} />
              </div>
              Calendar
            </li>
          </ul>
        </div>

        <div className="w-full">
          <div className="pl-3 py-1">
            <h2 className={clsx('font-semibold', 'h-6', 'flex items-center')}>
              Your missions
            </h2>
          </div>

          <ul className="pt-1">
            <li
              className={clsx(
                'h-8 px-3',
                'flex items-center',
                'cursor-pointer',
              )}
            >
              <img
                src="https://via.placeholder.com/24"
                alt="Music App"
                className="w-6 h-5 rounded mr-2"
              />
              <span>Music App</span>
            </li>
          </ul>
          <ul className="pt-1">
            <li
              className={clsx(
                'h-8 px-3',
                'flex items-center',
                'cursor-pointer',
              )}
            >
              <img
                src="https://via.placeholder.com/24"
                alt="Music App"
                className="w-6 h-5 rounded mr-2"
              />
              <span>Music App</span>
            </li>
          </ul>
          <ul className="pt-1">
            <li
              className={clsx(
                'h-8 px-3',
                'flex items-center',
                'cursor-pointer',
              )}
            >
              <img
                src="https://via.placeholder.com/24"
                alt="Music App"
                className="w-6 h-5 rounded mr-2"
              />
              <span>Music App</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function isIconProp(data: any): data is IconProp {
  if (
    typeof data === 'string' ||
    Array.isArray(data) ||
    typeof data === 'object'
  ) {
    return true;
  }
  return false;
}

function ListItem({
  children,
  textTransform = 'normal-case	',
  type = 'text-only',
  data,
}: Readonly<{
  children: React.ReactNode;
  textTransform?: 'normal-case	' | 'capitalize' | 'uppercase' | 'lowercase';
  type: 'icon' | 'image' | 'text-only';
  data: string | any | IconProp;
}>) {
  return (
    <li className={clsx('h-8 px-3', 'flex items-center', 'cursor-pointer')}>
      {type === 'icon' ? (
        isIconProp(data) && (
          <FontAwesomeIcon icon={data} className="w-6 h-5 mr-2" />
        )
      ) : type === 'image' ? (
        <Image
          src={data.src}
          alt={data.alt}
          className="rounded mr-2"
          height={20}
          width={26}
        />
      ) : null}
      <span
        className={clsx(
          `${textTransform} whitespace-nowrap overflow-hidden text-ellipsis`,
        )}
      >
        {children}
      </span>
    </li>
  );
}

function ToggleMinimizedButton({ onClick, minimized }: any) {
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
