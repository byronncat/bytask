import type { Task } from 'schema';
import clsx from 'clsx';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatDate, isDueSoon, isOverdue, isStarted } from '@/utilities';
import { DueDateTag, StartDateTag } from '@/components';
import { TASK_STATUS } from '@/constants/metadata';
import { colors } from './helper/colors';

interface DatesTagProps {
  start_date?: Task['start_date'];
  due_date?: Task['due_date'];
  status: Task['status'];
}

export default function DatesTag({
  start_date,
  due_date,
  status,
}: Readonly<DatesTagProps>) {
  if (!start_date && !due_date) return null;
  const done = status === TASK_STATUS.DONE;
  const started = isStarted(start_date);
  const overdue = isOverdue(due_date);
  const dueSoon = isDueSoon(due_date);

  if (start_date && due_date)
    return (
      <div
        className={clsx(
          'flex items-center',
          'text-xs',
          'rounded',
          done && colors.greenBg + ' text-foreground',
          overdue && colors.regBg + ' text-foreground',
          started && colors.green,
          dueSoon && colors.yellow,
          done || overdue || started || dueSoon
            ? 'px-1'
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
