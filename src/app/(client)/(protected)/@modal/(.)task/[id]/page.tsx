'use client';

import { usePathname, useRouter } from 'next/navigation';
import { TaskForm, Modal } from '@/components';

export default function DetailsModal() {
  const router = useRouter();
  const pathname = usePathname();
  const taskId = pathname.split('/').pop();

  function onExit() {
    router.back();
  }

  return (
    <Modal>
      <TaskForm onExit={onExit} taskId={taskId} timerShown />
    </Modal>
  );
}
