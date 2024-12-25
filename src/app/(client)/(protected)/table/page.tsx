'use client';

import clsx from 'clsx';

// const tableData = {
//   columns: [
//     { name: 'Task', size: 3 },
//     { name: 'List', size: 3 },
//     { name: 'Labels', size: 2 },
//     { name: 'Start date', size: 2 },
//     { name: 'Due date', size: 2 },
//     { size: 1 },
//   ],
//   rows: mock_tasks.map((task) => ({
//     id: task.id,
//     Task: task.title,
//     List: 'List 1',
//     Labels: 'Label 1',
//     'Start date': task.startDate?.toLocaleDateString(),
//     'Due date': task.dueDate?.toLocaleDateString(),
//   })),
// } as TableData;

const tableData = {
  columns: [
    { name: 'Task', size: 3 },
    { name: 'List', size: 3 },
    { name: 'Labels', size: 2 },
    { name: 'Start date', size: 2 },
    { name: 'Due date', size: 2 },
    { size: 1 },
  ],
  rows: [
    {
      id: '1',
      Task: 'Task 1',
      List: 'List 1',
      Labels: 'Label 1',
      'Start date': '2021-10-01',
      'Due date': '2021-10-10',
    },
    {
      id: '2',
      Task: 'Task 2',
      List: 'List 2',
      Labels: 'Label 2',
      'Start date': '2021-10-02',
      'Due date': '2021-10-11',
    },
    {
      id: '3',
      Task: 'Task 3',
      List: 'List 3',
      Labels: 'Label 3',
      'Start date': '2021-10-03',
      'Due date': '2021-10-12',
    },
  ],
} as TableData;

type TableData = {
  columns: { name?: string; size: number }[];
  rows: Record<string, string>[];
};

export default function TableViewPage() {
  const totalSize = tableData.columns.reduce(
    (sum, column) => sum + column.size,
    0,
  );

  return (
    <div className="p-3">
      <div className={clsx('min-w-full px-3', 'bg-foreground rounded-lg')}>
        <table
          className={clsx('text-sm', 'w-full', 'divide-y-2 divide-border')}
        >
          <thead className="text-left text-on-foreground font-semibold">
            <tr>
              {tableData.columns.map((column, index) => (
                <th
                  key={index}
                  className={clsx('whitespace-nowrap', 'px-3 py-2')}
                  style={{ width: `${(column.size / totalSize) * 100}%` }} // Set column width dynamically
                >
                  {column.name}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-border text-on-foreground">
            {tableData.rows.map((row) => {
              const { id, ...rowData } = row;
              console.log(id);
              return (
                <tr key={id}>
                  {Object.values(rowData).map((value, index) => (
                    <td
                      key={index}
                      className={clsx('whitespace-nowrap', 'px-3 py-2')}
                    >
                      {value}
                    </td>
                  ))}
                  <td className={clsx('whitespace-nowrap', 'px-3 py-2')}>
                    <a
                      href="#"
                      className={clsx(
                        'px-3 py-2 text-xs inline-block',
                        'rounded-md focus:outline-none',
                        'bg-foreground text-on-foreground',
                        'border border-on-foreground',
                        'hover:bg-on-foreground hover:text-foreground',
                      )}
                    >
                      View
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
