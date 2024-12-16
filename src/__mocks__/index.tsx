import type { Mission } from 'schema';

export const temp_missions: Mission[] = [
  {
    id: '1',
    title: 'Social Media App',
    description: 'This is the first mission',
    taskLists: [
      {
        id: 'list-1',
        title: 'This is a list',
        tasks: [],
      },
      {
        id: 'list-2',
        title: 'Another list',
        tasks: [],
      },
      { id: 'list-3', title: 'Empty list', tasks: [] },
      { id: 'list-4', title: 'Empty list', tasks: [] },
      { id: 'list-5', title: 'Empty list', tasks: [] },
    ],
  },
  {
    id: '2',
    title: 'Mission 2',
    description: 'This is the second mission',
  },
  {
    id: '3',
    title: 'Mission 3',
    description: 'This is the third mission',
  },
];

export const mock_tasks = [
  {
    id: 'card-1',
    title: 'Task 1',
    description: 'Design updates',
    label: {
      color: 'red',
    },
    startDate: new Date('2021-09-01'),
    dueDate: new Date('2021-09-30'),
  },
  {
    id: 'card-2',
    title: 'Task 2',
    description: 'Implement new features',
    label: {
      color: 'green',
    },
    startDate: new Date('2021-09-01'),
    dueDate: new Date('2021-09-30'),
  },
  {
    id: 'card-3',
    title: 'Task 3',
    description: 'Fix bugs',
    label: {
      color: 'blue',
    },
    startDate: new Date('2021-09-01'),
    dueDate: new Date('2021-09-30'),
  },
  {
    id: 'card-4',
    title: 'Task 4',
    description: 'Refactor code',
    label: {
      color: 'yellow',
    },
    startDate: new Date('2021-09-01'),
    dueDate: new Date('2021-09-30'),
  },
  {
    id: 'card-5',
    title: 'Task 5',
    description: 'Write tests',
    label: {
      color: 'purple',
    },
    startDate: new Date('2021-09-01'),
    dueDate: new Date('2021-09-30'),
  },
];
