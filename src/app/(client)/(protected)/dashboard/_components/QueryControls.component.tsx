import { useEffect, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import clsx from 'clsx';

import { FILTER_BY, SORT_BY, SORT_ORDER } from '@/constants/taskMetadata';
import { useMission } from '@/providers';

type Selection = Record<
  string,
  {
    show: boolean;
    options: Option[];
  }
>;

export type Option = {
  id: number;
  name: string;
  selected?: boolean;
  query?: {
    sortBy?: `${SORT_BY}`;
    sortOrder?: `${SORT_ORDER}`;
    filterBy?: `${FILTER_BY}`;
    search?: string;
  };
};

export default function QueryControls() {
  const { fetchMissions } = useMission();

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
        {
          id: 1,
          name: 'All',
          selected: true,
        },
        { id: 2, name: 'Todo', query: { filterBy: FILTER_BY.TODO } },
        {
          id: 3,
          name: 'In Progress',
          query: { filterBy: FILTER_BY.IN_PROGRESS },
        },
        { id: 4, name: 'Done', query: { filterBy: FILTER_BY.DONE } },
        { id: 5, name: 'Archived', query: { filterBy: FILTER_BY.ARCHIVED } },
      ],
    },
  });

  const dropdownRefs = useRef(new Map<string, HTMLDivElement>());
  useEffect(() => {
    const clickOutsideHandler = (event: MouseEvent) => {
      const allClosed = Object.values(selections).every(
        (selection) => !selection.show,
      );
      if (allClosed) return;

      let clickedInside = false;
      dropdownRefs.current.forEach((ref) => {
        if (ref && ref.contains(event.target as Node)) {
          clickedInside = true;
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

    document.addEventListener('mousedown', clickOutsideHandler);
    return () => {
      document.removeEventListener('mousedown', clickOutsideHandler);
    };
  }, [selections]);

  const searchElement = useRef<HTMLInputElement>(null);
  const debouncedSearch = useDebouncedCallback((search) => {
    fetchMissionsHandler({ search });
  }, 1200);
  useEffect(() => {
    const searchHandler = async () => {
      const search = searchElement.current?.value;
      debouncedSearch(search);
    };

    const searchInput = searchElement.current;
    searchInput?.addEventListener('input', searchHandler);
    return () => {
      searchInput?.removeEventListener('input', searchHandler);
    };
  }, [fetchMissions, debouncedSearch]);

  async function fetchMissionsHandler(_query: Option['query']) {
    const query = {
      sortBy:
        _query?.sortBy ??
        selections['Sort by'].options.find((option) => option.selected)?.query
          ?.sortBy,
      sortOrder:
        _query?.sortOrder ??
        selections['Sort by'].options.find((option) => option.selected)?.query
          ?.sortOrder,
      filterBy:
        _query?.filterBy ??
        selections['Filter by'].options.find((option) => option.selected)?.query
          ?.filterBy,
      search: _query?.search ?? searchElement.current?.value,
    };
    await fetchMissions(query);
  }

  function selectHandler(selectionName: string, optionId: number) {
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
  }

  return (
    <section>
      <h2 className="font-semibold tracking-wide">Missions</h2>
      <div className={clsx('pt-8 pb-2', 'flex justify-between items-center')}>
        <div className="flex gap-x-1">
          {Object.entries(selections).map(([selectionName, setting]) => {
            const Selection = ({ name }: Readonly<{ name?: string }>) => (
              <div
                className={clsx(
                  'rounded',
                  'w-48 h-10 px-3',
                  'flex items-center justify-between',
                  'text-sm capitalize',
                  'bg-surface-1 text-on-surface-1',
                  'border border-divider',
                  'cursor-pointer',
                )}
                onClick={async () => {
                  setSelectedOptions({
                    ...Object.keys(selections).reduce((acc, key) => {
                      acc[key] = {
                        ...selections[key],
                        show: key === selectionName ? !setting.show : false,
                      };
                      return acc;
                    }, {} as Selection),
                  });
                }}
              >
                {name}
                <span className="text-xs">▼</span>
              </div>
            );

            const Dropdown = ({ options }: Readonly<{ options: Option[] }>) => (
              <div
                className={clsx(
                  'absolute top-full mt-1',
                  'w-48 z-10 py-2',
                  'bg-surface-1 text-on-surface-1',
                  'border border-divider',
                  'rounded shadow',
                  setting.show ? 'block' : 'hidden',
                )}
              >
                {options.map((option) => (
                  <div
                    key={option.id}
                    className={clsx(
                      'px-3 py-2',
                      'text-sm capitalize',
                      'cursor-pointer',
                      option.selected
                        ? 'bg-primary/[.12] border-l-2 border-primary text-primary font-semibold'
                        : 'hover:bg-on-surface-1/[.07]',
                    )}
                    onClick={() => {
                      selectHandler(selectionName, option.id);
                      fetchMissionsHandler(option.query);
                    }}
                  >
                    {option.name}
                  </div>
                ))}
              </div>
            );

            return (
              <div
                key={selectionName}
                className="flex flex-col gap-y-1"
                ref={(el) => {
                  if (el) {
                    dropdownRefs.current.set(selectionName, el);
                  }
                }}
              >
                <Label name={selectionName} />
                <div className="relative">
                  <Selection
                    name={
                      setting.options.find((option) => option.selected)?.name
                    }
                  />
                  <Dropdown options={setting.options} />
                </div>
              </div>
            );
          })}
        </div>

        <div>
          <Label name="Search" />
          <input
            className={clsx(
              'block',
              'w-60 h-10 px-3',
              'bg-surface-1 text-on-surface-1',
              'rounded',
              'text-sm',
              'border border-divider',
              'focus:outline-none focus:border-contrast',
            )}
            type="text"
            placeholder="Search"
            ref={searchElement}
          />
        </div>
      </div>
    </section>
  );
}

function Label({ name }: Readonly<{ name: string }>) {
  return <label className="text-xs font-semibold tracking-wide">{name}</label>;
}
