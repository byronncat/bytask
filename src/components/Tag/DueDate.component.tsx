import type { Task } from 'schema';

import {
  isBefore,
  isToday,
  isTomorrow,
  differenceInCalendarDays,
} from 'date-fns';
import clsx from 'clsx';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatDate } from '@/utilities';
import { colors } from './helper/colors';

interface DueDateProps {
  date?: Task['due_date'];
  className?: string;
  type?: 'date' | 'text';
  done?: boolean;
}

export default function DueDate({
  date,
  className,
  type = 'date',
  done,
}: Readonly<DueDateProps>) {
  if (!date) return null;
  const today = new Date();
  const parsedDate = typeof date === 'string' ? new Date(date) : date;

  const daysDifference = differenceInCalendarDays(parsedDate, today);
  let label = '';
  let styles = '';

  if (done) {
    label = 'Done';
    styles = colors.green;
  } else if (isToday(parsedDate)) {
    label = 'Today';
    styles = colors.orange;
  } else if (isTomorrow(parsedDate)) {
    label = 'Tomorrow';
    styles = colors.orange;
  } else if (daysDifference <= 7 && daysDifference > 1) {
    label = `${daysDifference} days left`;
    styles = colors.yellow;
  } else if (daysDifference <= 30 && daysDifference > 7) {
    const weeksLeft = Math.ceil(daysDifference / 7);
    label = `${weeksLeft} week${weeksLeft > 1 ? 's' : ''} left`;
    styles = colors.blue;
  } else if (daysDifference <= 365 && daysDifference > 30) {
    const monthsLeft = Math.ceil(daysDifference / 30);
    label = `${monthsLeft} month${monthsLeft > 1 ? 's' : ''} left`;
    styles = colors.blue;
  } else if (daysDifference > 365) {
    const yearsLeft = Math.ceil(daysDifference / 365);
    label = `${yearsLeft} year${yearsLeft > 1 ? 's' : ''} left`;
    styles = colors.green;
  } else if (isBefore(parsedDate, today)) {
    label = 'Overdue';
    styles = colors.red;
  }

  return (
    <div
      className={clsx(
        'inline-block px-1 rounded',
        'text-xs tracking-wide',
        styles,
        className,
      )}
    >
      <FontAwesomeIcon icon={faClock} className="size-3 mr-1" />
      {type === 'date' ? formatDate(date) : label}
    </div>
  );
}
