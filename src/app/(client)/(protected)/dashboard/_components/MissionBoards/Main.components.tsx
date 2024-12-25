import Link from 'next/link';
import { useState } from 'react';
import clsx from 'clsx';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Container, FetchingBoards, CreateModal } from './';
import { useMission } from '@/providers';
import { ROUTE } from '@/constants/serverConfig';

export default function MissionsBoard() {
  const Wrapper = ({ children }: Readonly<{ children?: React.ReactNode }>) => (
    <section
      className={clsx('grid md:grid-cols-3 lg:grid-cols-4', 'pt-6 gap-4')}
    >
      {children}
    </section>
  );

  const [showModal, setShowModal] = useState(false);
  const { missions, isFetching } = useMission();

  if (isFetching)
    return (
      <Wrapper>
        <FetchingBoards />
      </Wrapper>
    );

  const CreateBoardModal = () => (
    <div className="relative">
      {showModal && (
        <CreateModal
          onExit={() => setShowModal(false)}
          className={clsx(
            'z-10',
            'left-full top-0 translate-x-2 -translate-y-1/2',
            'absolute transform',
          )}
        />
      )}
      <button onClick={() => setShowModal(true)} className="size-full">
        <Container
          className={clsx(
            'flex items-center justify-center',
            'bg-surface-1/[.6] text-on-surface-1/[.9]',
            'hover:opacity-60 cursor-pointer',
          )}
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Create new board
        </Container>
      </button>
    </div>
  );

  return (
    <Wrapper>
      <CreateBoardModal />
      {missions?.map((mission) => (
        <Link href={`${ROUTE.BOARD_VIEW}/${mission.id}`} key={mission.id}>
          <Container
            className={clsx(
              'relative',
              'bg-surface-1 text-on-surface-1 dark:text-white',
              'flex items-center justify-center',
              'font-semibold',
              'hover:opacity-60',
            )}
          >
            {mission.title}
          </Container>
        </Link>
      ))}
    </Wrapper>
  );
}
