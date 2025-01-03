'use client';

import type { Task } from 'schema';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useTask } from '@/providers';
import { StartDateTag, DueDateTag, StatusTag } from '@/components';

type TableData = {
  columns: { name?: string; size: number; className?: string }[];
  rows: Record<string, string | React.ReactNode>[];
};

export default function TableViewPage() {
  const { tasks, isLoaded } = useTask();
  const router = useRouter();
  const tableData = {
    columns: [
      { name: 'Title', size: 3, className: 'ml-4' },
      { name: 'Status', size: 2 },
      { name: 'Start date', size: 2 },
      { name: 'Due date', size: 2 },
    ],
    rows:
      tasks?.map((task) => ({
        id: task.id,
        title: (
          <Title
            title={task.title}
            color={task.cover}
            due_date={task.due_date}
          />
        ),
        status: <StatusTag status={task.status} />,
        start_date: <StartDateTag date={task.start_date} />,
        due_date: (
          <DueDateTag
            date={task.due_date}
            type="date"
            done={task.status === TASK_STATUS.DONE}
          />
        ),
      })) || [],
  } as TableData;

  const totalSize = tableData.columns.reduce(
    (sum, column) => sum + column.size,
    0,
  );

  return (
    <div className="p-4 min-h-full">
      <h2 className={clsx('text-2xl font-semibold italic', 'mb-5')}>Table</h2>
      <QueryControls />
      <div
        className={clsx(
          'relative pt-10',
          'h-[calc(100%-3.25rem)]',
          'border-b border-divider',
        )}
      >
        <div className={clsx('min-w-full', 'overflow-y-auto h-full')}>
          <table className={clsx('text-sm', 'w-full')}>
            <thead className={clsx('text-left font-semibold')}>
              <tr>
                {tableData.columns.map((column, index) => (
                  <th
                    key={index}
                    className="p-0"
                    style={{ width: `${(column.size / totalSize) * 100}%` }}
                  >
                    <span
                      className={clsx(
                        'absolute top-0',
                        'px-3 h-10',
                        'flex items-center',
                        'whitespace-nowrap',
                        column.className,
                      )}
                    >
                      {column.name}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="shadow-md">
              <tr
                className={clsx(
                  'h-[1px] w-full',
                  'bg-divider',
                  'absolute top-[calc(2.5rem-1px)] left-0',
                )}
              >
                <td colSpan={tableData.columns.length} className="p-0"></td>
              </tr>
              {isLoaded
                ? tableData.rows.map((row, index) => {
                    const { id, ...rest } = row;
                    return (
                      <tr
                        key={id as string}
                        className={clsx(
                          'h-10',
                          'bg-foreground',
                          'border border-divider ',
                          index === 0 && 'border-t-0',
                          index === tableData.rows.length - 1 && 'border-b-0',
                          'hover:bg-primary/[.12] cursor-pointer',
                        )}
                        onClick={() => router.push(`${ROUTE.TASK}/${id}`)}
                      >
                        {Object.values(rest).map((column, index) => (
                          <td
                            key={index}
                            className={clsx('whitespace-nowrap', 'px-3 py-2')}
                          >
                            {column}
                          </td>
                        ))}
                      </tr>
                    );
                  })
                : new Array(3).fill(0).map((_, index) => (
                    <tr
                      key={index}
                      className={clsx(
                        'h-10',
                        'bg-foreground',
                        'border border-divider ',
                        index === 0 && 'border-t-0',
                        index === 2 && 'border-b-0',
                        'animate-pulse',
                      )}
                    >
                      {tableData.columns.map((_, index) => (
                        <td className="px-3 py-2" key={index}>
                          <div
                            className={clsx(
                              'h-4 rounded',
                              'bg-gray-200 dark:bg-gray-700',
                            )}
                          ></div>
                        </td>
                      ))}
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { isOverdue } from '@/utilities';
import { TASK_STATUS } from '@/constants/metadata';
import { ROUTE } from '@/constants/serverConfig';
import { QueryControls } from '../_components';

function Title({
  title,
  color,
  due_date,
}: Readonly<{ title: string; color?: HexColor; due_date?: Task['due_date'] }>) {
  return (
    <div className="flex items-center">
      <span
        className={clsx(
          'size-2 mr-2',
          'rounded-full',
          'flex justify-center items-center',
          'font-semibold text-white',
        )}
        style={{ backgroundColor: color }}
      />
      {title}
      {isOverdue(due_date) && <StatusTag status="overdue" className="ml-2" />}
    </div>
  );
}
