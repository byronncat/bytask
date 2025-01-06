'use client';

import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { TaskForm, Divider } from '@/components';
import { ROUTE } from '@/constants/serverConfig';
import { TimerButton } from '../../_components';

export default function DetailsModal() {
  const router = useRouter();
  const pathname = usePathname();
  const taskId = pathname.split('/').pop();

  return (
    <div className={clsx('size-full', 'overflow-y-auto')}>
      <div className={clsx('p-4 pt-8', 'max-w-xl', 'mx-auto')}>
        <div className={clsx('mb-5', 'flex items-center justify-between')}>
          <h2 className="text-2xl font-semibold">Task</h2>
          <TimerButton taskId={taskId} />
        </div>
        <Divider />
        <TaskForm
          onExit={() => router.push(ROUTE.CARD_VIEW)}
          taskId={taskId}
          type="form"
        />
      </div>
    </div>
  );
}
