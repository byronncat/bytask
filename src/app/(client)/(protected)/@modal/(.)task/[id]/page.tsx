'use client';

import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { TaskModal } from '@/components';

export default function DetailsModal() {
  const router = useRouter();
  const pathname = usePathname();
  const taskId = pathname.split('/').pop();

  function onExit() {
    router.back();
  }

  return (
    <Modal>
      <TaskModal onExit={onExit} taskId={taskId} />
    </Modal>
  );
}

function Modal({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();

  function onExit() {
    router.back();
  }

  return (
    <div
      className={clsx(
        'absolute inset-0 z-20',
        'bg-black/[.2]',
        'flex items-center justify-center',
      )}
      onClick={onExit}
    >
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
