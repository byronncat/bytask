import type { Task } from 'schema';
import clsx from 'clsx';
import { faAlignLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Container from './Container';
import { DateTag, StatusTag } from '@/components';
import Priority from '@/components/Tag/Priority.componenet';

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
        <div className="flex items-center space-x-2">
          <Priority priority={data.priority} textShown={false} />
          <StatusTag status={data.status} />
        </div>
        <span className={clsx('title', 'mt-1', 'font-bold whitespace-nowrap')}>
          {data.title}
        </span>
        <div className={clsx('flex items-center', 'mt-2 space-x-2')}>
          <DateTag
            start_date={data.start_date}
            due_date={data.due_date}
            status={data.status}
          />
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
