'use client';

import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { TaskForm, Modal } from '@/components';

export default function CreateModal() {
  const router = useRouter();
  function onExit() {
    router.back();
  }

  return (
    <Modal>
      <TaskForm onExit={onExit} />
    </Modal>
  );
}
