import type { Task } from 'schema';
import clsx from 'clsx';
import { faAlignLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { formatDate, isOverdue } from '@/utilities';
import Container from './Container';
import { DueDateTag, StartDateTag, StatusTag } from '@/components';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { TASK_STATUS } from '@/constants/metadata';

export default function Card({ data }: Readonly<{ data: Task }>) {
  return (
    <Container
      className={clsx(
        'relative',
        'bg-foreground text-on-foreground dark:text-white',
        'hover:opacity-60',
        'overflow-hidden',
      )}
      colorLine={data.cover}
    >
      <div className={clsx('px-3 py-2', 'flex flex-col items-start')}>
        <StatusTag status={data.status} />
        <span className={clsx('title', 'mt-2', 'font-bold')}>{data.title}</span>
        <div className={clsx('flex items-center', 'mt-1 space-x-2')}>
          {
            <DatesTag
              start_date={data.start_date}
              due_date={data.due_date}
              status={data.status}
            />
          }
          {data.description && (
            <FontAwesomeIcon
              icon={faAlignLeft}
              className={clsx('size-4', 'text-on-foreground/[.6]')}
            />
          )}
        </div>
      </div>
    </Container>
  );
}

interface DatesTagProps {
  start_date?: Task['start_date'];
  due_date?: Task['due_date'];
  status: Task['status'];
}

function DatesTag({ start_date, due_date, status }: Readonly<DatesTagProps>) {
  if (!start_date && !due_date) return null;
  const done = status === TASK_STATUS.DONE;
  const overdue = due_date && isOverdue(due_date);

  if (start_date && due_date)
    return (
      <div
        className={clsx(
          'flex items-center',
          'text-xs',
          'rounded',
          done
            ? 'px-1 bg-green-500 dark:bg-green-500 text-foreground'
            : overdue
            ? 'px-1 bg-red-500 dark:bg-red-400 text-foreground'
            : 'text-on-foreground/[.8]',
        )}
      >
        <FontAwesomeIcon icon={faClock} className="size-3 mr-1" />
        {formatDate(start_date)} - {formatDate(due_date)}
      </div>
    );

  if (start_date) return <StartDateTag date={start_date} textDescription />;
  return (
    <DueDateTag date={due_date} type={done ? 'date' : 'text'} done={done} />
  );
}
