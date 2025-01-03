'use client';

import { usePathname } from 'next/navigation';

export default function TaskViewPage() {
  const pathname = usePathname();
  const taskId = pathname.split('/').pop();

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <h2>Task: {taskId}</h2>
    </div>
  );
}
