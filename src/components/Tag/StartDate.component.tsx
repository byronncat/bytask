import type { Task } from 'schema';
import clsx from 'clsx';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatDate } from '@/utilities';
import { colors } from './helper/colors';

interface StartDateProps {
  date?: Task['start_date'];
  textDescription?: boolean;
}

export default function StartDate({
  date,
  textDescription,
}: Readonly<StartDateProps>) {
  if (!date) return null;

  const isStarted = new Date(date) < new Date();
  const label = textDescription ? (isStarted ? 'Started' : 'Starts') : '';

  return (
    <div
      className={clsx(
        'flex items-center px-1 w-fit rounded',
        'text-xs tracking-wide',
        isStarted ? colors.green : colors.gray,
      )}
    >
      <FontAwesomeIcon icon={faClock} className="size-3 mr-1" />
      {label && `${label}: `}
      {formatDate(date)}
    </div>
  );
}
