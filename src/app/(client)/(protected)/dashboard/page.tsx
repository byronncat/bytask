'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { Divider } from '@/components';
import icon from '@/assets/workspace-icon.webp';

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
};

export default function DashboardPage() {
  const [selections, setSelectedOptions] = useState<Selection>({
    'Sort by': {
      show: false,
      options: [
        { id: 1, name: 'Most recently active', selected: true },
        { id: 2, name: 'Least recently active' },
        { id: 3, name: 'Alphabetically A-Z' },
        { id: 4, name: 'Alphabetically Z-A' },
      ],
    },
    'Filter by': {
      show: false,
      options: [
        { id: 1, name: 'All', selected: true },
        { id: 2, name: 'Active' },
        { id: 3, name: 'Archived' },
        { id: 4, name: 'Completed' },
      ],
    },
  });

  const dropdownRefs = useRef(new Map<string, HTMLDivElement>());

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
    <div className="size-full max-w-7xl mx-auto">
      <header className={clsx('flex items-center', 'p-8')}>
        <div className={clsx('size-15', 'rounded-md overflow-hidden')}>
          <Image width={60} height={60} src={icon} alt="Workspace Icon" />
        </div>
        <h1 className={clsx('text-lg font-semibold', 'ml-4')}>Dashboard</h1>
      </header>

      <Divider className="mx-8" />

      <div className="p-8">
        <section>
          <h2 className="font-semibold tracking-wide">Missions</h2>
          <div
            className={clsx('pt-8 pb-2', 'flex justify-between items-center')}
          >
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
                  <div className="relative">
                    <div
                      className={clsx(
                        'w-48 h-10 px-3 flex items-center justify-between',
                        'border-[1px] border-border',
                        'rounded text-sm bg-background cursor-pointer',
                      )}
                      onClick={() =>
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
                            'px-3 py-2 text-sm cursor-pointer',
                            option.selected
                              ? 'bg-on-background/[.12] border-l-2 border-contrast/[.7]'
                              : 'hover:bg-on-background/[.07]',
                          )}
                          onClick={() =>
                            selectHandler(selectionName, option.id)
                          }
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

        <section className="grid md:grid-cols-3 lg:grid-cols-4 pt-6 gap-4">
          <div className="h-24 bg-white rounded-lg"></div>
          <div className="h-24 bg-white rounded-lg"></div>

          <div className="h-24 bg-white rounded-lg"></div>

          <div className="h-24 bg-white rounded-lg"></div>
        </section>
      </div>
    </div>
  );
}
