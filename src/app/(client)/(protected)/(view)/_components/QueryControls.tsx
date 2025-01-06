import { useCallback, useEffect, useRef, useState, Fragment } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import clsx from 'clsx';

import { useTask } from '@/providers';
import { useOutsideAlerter } from '@/hooks';
import { Selection, StatusTag } from '@/components';
import {
  FILTER_BY,
  SORT_BY,
  SORT_ORDER,
  TASK_STATUS,
} from '@/constants/metadata';

interface QueryControlsProps {
  sort?: boolean;
  filter?: boolean;
  search?: boolean;
}

export default function QueryControls({
  sort = true,
  filter = true,
  search = true,
}: QueryControlsProps) {
  const { setQuery } = useTask();

  const [sortValue, setSortValue] = useState<[SORT_BY, SORT_ORDER]>([
    SORT_BY.RECENTLY_UPDATED,
    SORT_ORDER.DESC,
  ]);
  const selectHandler = useCallback((value: Option['value']) => {
    const [sortBy, sortOrder] = (value as string).split(',');
    setSortValue([sortBy as SORT_BY, sortOrder as SORT_ORDER]);
  }, []);

  const checkboxRef = useRef<HTMLInputElement>(null);
  useOutsideAlerter(checkboxRef, () => setIsFilterOpen(false));

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [checkboxValue, setCheckboxValue] = useState<Option['value'][]>([]);
  const [checkboxDisplay, setCheckboxDisplay] = useState<Option['value'][]>([]);
  const debouncedCheckboxValue = useDebouncedCallback((value) => {
    setCheckboxValue(value);
  }, 1200);

  function checkboxHandler(value: Option['value']) {
    setCheckboxDisplay((prev) => {
      if (prev.includes(value)) {
        return prev.filter((item) => item !== value);
      }
      return [...prev, value];
    });
  }
  function resetFilterHandler() {
    setCheckboxDisplay([]);
  }

  useEffect(() => {
    // FIXME: Trigger API call two times at the first render
    debouncedCheckboxValue(checkboxDisplay);
  }, [checkboxDisplay, debouncedCheckboxValue]);

  const [searchValue, setSearchValue] = useState<string>('');
  const searchElementRef = useRef<HTMLInputElement>(null);
  const searchHandler = useCallback(async (_value: string) => {
    _value = _value.trim();
    if (_value === searchElementRef.current?.value) {
      setSearchValue(_value);
    }
  }, []);
  const debouncedSearchHandler = useDebouncedCallback((searchValueRef) => {
    searchHandler(searchValueRef);
  }, 1200);

  useEffect(() => {
    const searchHandler = async () => {
      const search = searchElementRef.current?.value;
      debouncedSearchHandler(search);
    };

    const searchInput = searchElementRef.current;
    searchInput?.addEventListener('input', searchHandler);
    return () => {
      searchInput?.removeEventListener('input', searchHandler);
    };
  }, [searchHandler, debouncedSearchHandler]);

  const fetchQuery = useCallback(async () => {
    const filterValueStr = checkboxValue.join(',');
    setQuery({
      sortBy: sortValue[0] || SORT_BY.RECENTLY_UPDATED,
      sortOrder: sortValue[1] || SORT_ORDER.DESC,
      filterBy: checkboxValue.length > 0 ? FILTER_BY.STATUS : undefined,
      filterValue: filterValueStr,
      search: searchValue,
    });
  }, [sortValue, checkboxValue, searchValue, setQuery]);

  const [queryLoaded, setQueryLoaded] = useState(false);
  useEffect(() => {
    if (queryLoaded) fetchQuery();
    else setQueryLoaded(true);
  }, [sortValue, checkboxValue, searchValue, fetchQuery, queryLoaded]);

  return (
    <section className="block">
      <div className={clsx('h-auto', 'flex justify-between lg:items-center')}>
        {(sort || filter) && (
          <div className={clsx('flex gap-x-1 gap-y-3', 'flex-col lg:flex-row')}>
            {sort && (
              <Selection
                label={<Label name="Sort by" />}
                options={sortOptions}
                onSelect={selectHandler}
                className="w-48"
                inputClassName="bg-foreground text-on-foreground"
              />
            )}

            {filter && (
              <div className="w-48" ref={checkboxRef}>
                <Label name="Filter by" />
                <div className="relative">
                  <div
                    className={clsx(
                      'gap-2',
                      'rounded h-10 px-3',
                      'border border-divider',
                      'bg-foreground text-on-foreground',
                      'cursor-pointer transition',
                      'flex justify-between items-center',
                    )}
                    onClick={() => setIsFilterOpen((prev) => !prev)}
                  >
                    <span
                      className={clsx(
                        'text-sm font-medium whitespace-nowrap',
                        'w-36 overflow-x-scroll no-scrollbar',
                      )}
                    >
                      {checkboxDisplay.length > 0
                        ? checkboxDisplay.map((value, index) => {
                            const option = filterOptions.find(
                              (option) => option.value === value,
                            );
                            return (
                              <Fragment key={option?.id}>
                                <StatusTag
                                  status={option?.value as TASK_STATUS}
                                />
                                {index < checkboxDisplay.length - 1 && ' '}
                              </Fragment>
                            );
                          })
                        : 'Filter by'}
                    </span>
                    <span className="text-xs">▼</span>
                  </div>

                  <div
                    className={clsx(
                      'mt-1',
                      'absolute z-10 w-full',
                      'bg-foreground',
                      'rounded border border-divider',
                      isFilterOpen ? 'block' : 'hidden',
                    )}
                  >
                    <ul className="px-3 pt-2">
                      {filterOptions.map((option) => (
                        <li key={option.id}>
                          <label
                            htmlFor={`Filter-${option.id}`}
                            className={clsx(
                              'h-8',
                              'gap-2',
                              'inline-flex items-center',
                            )}
                          >
                            <input
                              type="checkbox"
                              id={`Filter-${option.id}`}
                              className={clsx(
                                'size-4',
                                'rounded border border-divider',
                              )}
                              value={option.value}
                              onChange={() => checkboxHandler(option.value)}
                              checked={checkboxDisplay.includes(option.value)}
                            />

                            <span className="text-sm font-medium text-on-foreground">
                              {option.name}
                            </span>
                          </label>
                        </li>
                      ))}
                    </ul>

                    <button
                      type="button"
                      className={clsx(
                        'text-sm',
                        'text-right w-full pr-3',
                        'hover:underline pb-2',
                      )}
                      onClick={resetFilterHandler}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {search && (
          <div className="flex flex-col">
            <Label id="search" name="Search" />
            <input
              id="search"
              className={clsx(
                'text-sm',
                'block rounded w-60 h-10 px-3',
                'border border-divider',
                'bg-foreground text-on-foreground',
                'focus:outline-none',
              )}
              type="text"
              placeholder="Search"
              ref={searchElementRef}
            />
          </div>
        )}
      </div>
    </section>
  );
}

function Label({ id, name }: Readonly<{ id?: string; name: string }>) {
  if (id)
    return (
      <label
        htmlFor={id}
        className={clsx(
          'text-xs font-semibold tracking-wide',
          'mb-1 inline-block',
        )}
      >
        {name}
      </label>
    );

  return (
    <div className={clsx('text-xs font-semibold tracking-wide', 'mb-1')}>
      {name}
    </div>
  );
}

const sortOptions = [
  {
    id: 1,
    option: 'Most recently active',
    value: `${SORT_BY.RECENTLY_UPDATED},${SORT_ORDER.DESC}`,
    default: true,
  },
  {
    id: 2,
    option: 'Least recently active',
    value: `${SORT_BY.RECENTLY_UPDATED},${SORT_ORDER.ASC}`,
  },
  {
    id: 10,
    option: 'Highest priority',
    value: `${SORT_BY.PRIORITY},${SORT_ORDER.DESC}`,
  },
  {
    id: 11,
    option: 'Lowest priority',
    value: `${SORT_BY.PRIORITY},${SORT_ORDER.ASC}`,
  },
  {
    id: 5,
    option: 'Status',
    value: `${SORT_BY.STATUS},${SORT_ORDER.ASC}`,
  },
  {
    id: 3,
    option: 'Alphabetically A-Z',
    value: `${SORT_BY.TITLE},${SORT_ORDER.ASC}`,
  },
  {
    id: 4,
    option: 'Alphabetically Z-A',
    value: `${SORT_BY.TITLE},${SORT_ORDER.DESC}`,
  },
  {
    id: 8,
    option: 'Start date earliest',
    value: `${SORT_BY.START_DATE},${SORT_ORDER.ASC}`,
  },
  {
    id: 9,
    option: 'Start date latest',
    value: `${SORT_BY.START_DATE},${SORT_ORDER.DESC}`,
  },
  {
    id: 6,
    option: 'Due date earliest',
    value: `${SORT_BY.DUE_DATE},${SORT_ORDER.ASC}`,
  },
  {
    id: 7,
    option: 'Due date latest',
    value: `${SORT_BY.DUE_DATE},${SORT_ORDER.DESC}`,
  },
];

const filterOptions = [
  {
    id: 1,
    name: <StatusTag status={TASK_STATUS.TODO} />,
    value: TASK_STATUS.TODO,
  },
  {
    id: 2,
    name: <StatusTag status={TASK_STATUS.IN_PROGRESS} />,
    value: TASK_STATUS.IN_PROGRESS,
  },
  {
    id: 3,
    name: <StatusTag status={TASK_STATUS.BLOCKED} />,
    value: TASK_STATUS.BLOCKED,
  },
  {
    id: 4,
    name: <StatusTag status={TASK_STATUS.ON_HOLD} />,
    value: TASK_STATUS.ON_HOLD,
  },
  {
    id: 5,
    name: <StatusTag status={TASK_STATUS.REVIEW} />,
    value: TASK_STATUS.REVIEW,
  },
  {
    id: 6,
    name: <StatusTag status={TASK_STATUS.DONE} />,
    value: TASK_STATUS.DONE,
  },
  {
    id: 7,
    name: <StatusTag status={TASK_STATUS.ARCHIVED} />,
    value: TASK_STATUS.ARCHIVED,
  },
  {
    id: 8,
    name: <StatusTag status={TASK_STATUS.CANCELED} />,
    value: TASK_STATUS.CANCELED,
  },
  {
    id: 9,
    name: <StatusTag status="overdue" />,
    value: 'overdue',
  },
];
