'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { Divider } from '@/components';
import icon from '@/assets/images/workspace-icon.webp';
import { IMission } from 'schema';
import { missionAction } from '@/api';
import { SORT_BY, SORT_ORDER, STATUS } from '@/constants/convention';

export default function DashboardPage() {
  const [missions, setMissions] = useState<IMission[]>();
  const [isFetching, setIsFetching] = useState(true);

  const fetchMissions = useCallback(async function (query?: Option['query']) {
    setIsFetching(true);
    const { success, data } = await missionAction.get(query);
    if (success) setMissions(data);
    setIsFetching(false);
    return success;
  }, []);

  useEffect(() => {
    fetchMissions();
  }, [fetchMissions]);

  return (
    <div className="size-full max-w-7xl mx-auto">
      <header className={clsx('flex items-center', 'p-8')}>
        <div className={clsx('size-15', 'rounded-md overflow-hidden')}>
          <Image width={60} height={60} src={icon} alt="Workspace Icon" />
        </div>
        <h1 className={clsx('text-lg font-semibold', 'ml-4')}>Dashboard</h1>
      </header>

      <Divider className="mx-8" />

      <div className="p-8">
        <QuerySection setMissions={fetchMissions} />

        <MissionBoards
          data={missions}
          isFetching={isFetching}
          fetchMissions={fetchMissions}
        />
      </div>
    </div>
  );
}

type Selection = Record<
  string,
  {
    show: boolean;
    options: Option[];
  }
>;

type Option = {
  id: number;
  name: string;
  selected?: boolean;
  query?: {
    sortBy?: `${SORT_BY}`;
    sortOrder?: `${SORT_ORDER}`;
  };
};

function QuerySection({
  setMissions,
}: Readonly<{ setMissions: (query: Option['query']) => Promise<boolean> }>) {
  const dropdownRefs = useRef(new Map<string, HTMLDivElement>());
  const [selections, setSelectedOptions] = useState<Selection>({
    'Sort by': {
      show: false,
      options: [
        {
          id: 1,
          name: 'Most recently active',
          query: { sortBy: SORT_BY.ACTIVED_AT, sortOrder: SORT_ORDER.DESC },
          selected: true,
        },
        {
          id: 2,
          name: 'Least recently active',
          query: { sortBy: SORT_BY.ACTIVED_AT, sortOrder: SORT_ORDER.ASC },
        },
        {
          id: 3,
          name: 'Alphabetically A-Z',
          query: { sortBy: SORT_BY.TITLE, sortOrder: SORT_ORDER.ASC },
        },
        {
          id: 4,
          name: 'Alphabetically Z-A',
          query: { sortBy: SORT_BY.TITLE, sortOrder: SORT_ORDER.DESC },
        },
      ],
    },
    'Filter by': {
      show: false,
      options: [
        { id: 1, name: 'all', selected: true },
        { id: 2, name: 'todo' },
        { id: 3, name: 'in progress' },
        { id: 4, name: 'done' },
        { id: 5, name: 'archived' },
      ],
    },
  });

  const selectHandler = (selectionName: string, optionId: number) => {
    setSelectedOptions({
      ...selections,
      [selectionName]: {
        ...selections[selectionName],
        show: false,
        options: selections[selectionName].options.map((option) => ({
          ...option,
          selected: option.id === optionId,
        })),
      },
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const allClosed = Object.values(selections).every(
        (selection) => !selection.show,
      );
      if (allClosed) return;

      let clickedInside = false;
      dropdownRefs.current.forEach((ref, key) => {
        if (ref && ref.contains(event.target as Node)) {
          clickedInside = true;
        } else {
          setSelectedOptions((prevSelections) => ({
            ...prevSelections,
            [key]: {
              ...prevSelections[key],
              show: false,
            },
          }));
        }
      });

      if (!clickedInside) {
        setSelectedOptions((prevSelections) => {
          const newSelections = { ...prevSelections };
          Object.keys(newSelections).forEach((key) => {
            newSelections[key].show = false;
          });
          return newSelections;
        });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selections]);

  return (
    <section>
      <h2 className="font-semibold tracking-wide">Missions</h2>
      <div className={clsx('pt-8 pb-2', 'flex justify-between items-center')}>
        <div className="flex gap-x-1">
          {Object.entries(selections).map(([selectionName, setting]) => (
            <div
              key={selectionName}
              className="flex flex-col gap-y-1"
              ref={(el) => {
                if (el) {
                  dropdownRefs.current.set(selectionName, el);
                }
              }}
            >
              <label className="text-xs font-semibold tracking-wide">
                {selectionName}
              </label>

              {/* Selection */}
              <div className="relative">
                <div
                  className={clsx(
                    'w-48 h-10 px-3 flex items-center justify-between',
                    'border-[1px] border-border',
                    'rounded text-sm capitalize bg-background cursor-pointer',
                  )}
                  onClick={async () =>
                    setSelectedOptions({
                      ...selections,
                      [selectionName]: {
                        ...setting,
                        show: !setting.show,
                      },
                    })
                  }
                >
                  {setting.options.find((option) => option.selected)?.name}
                  <span className="text-xs">▼</span>
                </div>

                {/* Dropdown */}
                <div
                  className={clsx(
                    'absolute top-full mt-1 w-48 overflow-auto z-10 py-2',
                    'bg-background border border-border rounded shadow',
                    setting.show ? 'block' : 'hidden',
                  )}
                >
                  {setting.options.map((option) => (
                    <div
                      key={option.id}
                      className={clsx(
                        'px-3 py-2 text-sm capitalize cursor-pointer',
                        option.selected
                          ? 'bg-on-background/[.12] border-l-2 border-contrast/[.7]'
                          : 'hover:bg-on-background/[.07]',
                      )}
                      onClick={async () => {
                        const success = await setMissions(option.query);
                        if (success) {
                          selectHandler(selectionName, option.id);
                        }
                      }}
                    >
                      {option.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface MissionBoardsProps {
  data?: IMission[];
  isFetching?: boolean;
  fetchMissions: () => Promise<boolean>;
}

function MissionBoards({
  data = [],
  isFetching,
  fetchMissions,
}: Readonly<MissionBoardsProps>) {
  async function createMissionHandler() {
    const { success } = await missionAction.create({ title: 'New Board' });
    if (success) fetchMissions();
  }

  const Card = ({
    data,
  }: Readonly<{
    data?: IMission;
  }>) => (
    <div
      className={clsx(
        'h-24',
        'font-semibold text-sm',
        'flex justify-center items-center',
        'bg-surface-1 text-on-surface-1',
        'rounded-lg',
        isFetching && 'animate-pulse',
      )}
    >
      {data?.title}
    </div>
  );

  return (
    <section
      className={clsx('grid md:grid-cols-3 lg:grid-cols-4', 'pt-6 gap-4')}
    >
      {isFetching ? (
        Array.from({ length: 8 }).map((_, index) => <Card key={index} />)
      ) : (
        <>
          {data.map((mission) => (
            <Card data={mission} key={mission.id} />
          ))}
          <button
            type="button"
            className={clsx(
              'h-24',
              'text-sm',
              'flex justify-center items-center',
              'bg-surface-2 text-on-surface-2',
              'rounded-lg',
              'hover:opacity-60 cursor-pointer',
            )}
            onClick={createMissionHandler}
          >
            Create new board
          </button>
        </>
      )}
    </section>
  );
}
