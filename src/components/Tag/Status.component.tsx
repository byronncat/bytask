import clsx from 'clsx';
import { colors } from './helper/colors';
import { TASK_STATUS } from '@/constants/metadata';

interface StatusProps {
  status: TASK_STATUS | 'overdue';
  className?: string;
}

export default function Status({ status, className }: Readonly<StatusProps>) {
  const statusStyles: Record<string, string> = {
    [TASK_STATUS.TODO]: colors.gray,
    [TASK_STATUS.IN_PROGRESS]: colors.blue,
    [TASK_STATUS.DONE]: colors.green,
    [TASK_STATUS.ARCHIVED]: colors.gray,
    [TASK_STATUS.BLOCKED]: colors.red,
    [TASK_STATUS.ON_HOLD]: colors.yellow,
    [TASK_STATUS.REVIEW]: colors.purple,
    [TASK_STATUS.CANCELED]: colors.orange,
    overdue: colors.red,
  };

  const statusText: Record<string, string> = {
    [TASK_STATUS.TODO]: 'TO DO',
    [TASK_STATUS.IN_PROGRESS]: 'IN PROGRESS',
    [TASK_STATUS.DONE]: 'DONE',
    [TASK_STATUS.ARCHIVED]: 'ARCHIVED',
    [TASK_STATUS.BLOCKED]: 'BLOCKED',
    [TASK_STATUS.ON_HOLD]: 'ON HOLD',
    [TASK_STATUS.REVIEW]: 'REVIEW',
    [TASK_STATUS.CANCELED]: 'CANCELED',
    overdue: 'OVERDUE',
  };

  return (
    <div
      className={clsx(
        'inline-block px-1 rounded',
        'text-xs font-semibold tracking-wide',
        className,
        statusStyles[status],
      )}
    >
      {statusText[status]}
    </div>
  );
}
