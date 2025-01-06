import clsx from 'clsx';
import { colors } from './helper/colors';
import { TASK_PRIORITY } from '@/constants/metadata';

interface PriorityProps {
  priority: TASK_PRIORITY;
  className?: string;
  textShown?: boolean;
}

export default function Priority({
  priority,
  className,
  textShown = true,
}: Readonly<PriorityProps>) {
  return (
    <div
      className={clsx(
        'inline-block px-1 rounded',
        'text-xs font-semibold tracking-wide',
        className,
        priorityStyles[priority],
      )}
    >
      {priorityIcon[priority]}
      {textShown && priorityText[priority]}
    </div>
  );
}

const priorityStyles = {
  [TASK_PRIORITY.LOW]: colors.blue,
  [TASK_PRIORITY.MEDIUM]: colors.yellow,
  [TASK_PRIORITY.HIGH]: colors.red,
};

const priorityIcon = {
  [TASK_PRIORITY.LOW]: '🛌',
  [TASK_PRIORITY.MEDIUM]: '🚨',
  [TASK_PRIORITY.HIGH]: '🔥',
};

const priorityText = {
  [TASK_PRIORITY.LOW]: ' LOW',
  [TASK_PRIORITY.MEDIUM]: ' MEDIUM',
  [TASK_PRIORITY.HIGH]: ' HIGH',
};
