'use client';

import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { TaskModal } from '@/components';

export default function CreateModal() {
  const router = useRouter();
  function onExit() {
    router.back();
  }

  return (
    <Modal>
      <TaskModal onExit={onExit} />
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
