'use client';

import Link from 'next/link';
import clsx from 'clsx';
import { useTask } from '@/providers';
import { FetchingCards, Card, QueryControls } from '../_components';
import { ROUTE } from '@/constants/serverConfig';

export default function Page() {
  const { tasks, isFetching } = useTask();

  return (
    <div className="p-4 min-h-full">
      <h2 className={clsx('text-2xl font-semibold italic', 'mb-5')}>Cards</h2>
      <QueryControls />
      <section
        className={clsx('grid md:grid-cols-3 lg:grid-cols-4', 'pt-6 gap-4')}
      >
        {!isFetching ? (
          tasks?.map((task) => (
            <Link href={`${ROUTE.TASK}/${task.id}`} key={task.id}>
              <Card data={task} />
            </Link>
          ))
        ) : (
          <FetchingCards />
        )}
      </section>
    </div>
  );
}
