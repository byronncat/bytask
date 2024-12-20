import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { missionAction } from '@/api';
import { ROUTE } from '@/constants/server';
import { Field } from '@/components';
import type { IMission } from 'schema';

interface MissionBoardsProps {
  data?: IMission[];
  isFetching?: boolean;
  fetchMissions: () => Promise<boolean>;
}

export default function MissionsBoard({
  data = [],
  isFetching,
  fetchMissions,
}: Readonly<MissionBoardsProps>) {
  const Wrapper = ({ children }: Readonly<{ children?: React.ReactNode }>) => (
    <section className="grid md:grid-cols-3 lg:grid-cols-4 pt-6 gap-4">
      {children}
    </section>
  );

  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  if (isFetching)
    return (
      <Wrapper>
        <FetchingBoards />
      </Wrapper>
    );

  async function createMissionHandler(data: Partial<IMission>) {
    if (!data.title) return;
    const { success, data: missionId } = await missionAction.create({
      title: data.title,
    });
    if (success) router.push(`${ROUTE.BOARD_VIEW}/${missionId}`);
  }

  const CreateBoardModal = () => (
    <div className="relative">
      {showModal && (
        <CreateBoardPopup
          onCreate={createMissionHandler}
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
            'bg-surface-1/[.6] text-on-surface-1/[.6]',
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
      {data.map((mission) => (
        <Link href={`${ROUTE.BOARD_VIEW}/${mission.id}`} key={mission.id}>
          <Container
            className={clsx(
              'relative',
              'bg-surface-1 text-on-surface-1',
              'flex items-center justify-center',
              'font-semibold',
              'hover:opacity-70',
            )}
          >
            {mission.title}
            <button
              className={clsx(
                'absolute top-0 right-0',
                'p-2',
                'hover:text-red-400',
              )}
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();

                await missionAction.remove(mission.id);
                fetchMissions();
              }}
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </Container>
        </Link>
      ))}
    </Wrapper>
  );
}

function FetchingBoards() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, index) => (
        <Container key={index} className="bg-surface-1 animate-pulse" />
      ))}
    </>
  );
}

function Container({
  children,
  className,
}: Readonly<{ children?: React.ReactNode; className?: string }>) {
  return (
    <div className={clsx('h-24', 'rounded-lg', 'text-sm', className)}>
      {children}
    </div>
  );
}

const CreateBoardPopup = ({
  onCreate,
  onExit,
  className,
}: Readonly<{
  onCreate: (data: Partial<IMission>) => void;
  onExit: () => void;
  className?: string;
}>) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  function submitHandler({ title }: Partial<IMission>) {
    onCreate({ title });
  }

  // const backgrounds = [
  //   'bg-gray-200', // Plain
  //   'bg-yellow-300', // Gradient/Yellow
  //   'bg-blue-500', // Blue
  //   'bg-purple-500', // Purple
  //   'bg-green-500', // Green
  //   'bg-red-500', // Red
  // ];

  return (
    <div
      className={clsx(
        'w-80 p-3',
        'bg-foreground text-on-foreground',
        'border border-border',
        'rounded-lg shadow-lg ',
        className,
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className={clsx('text-sm font-semibold', 'mb-4', 'text-center')}>
        Create board
      </h2>

      {/* <div className={clsx('flex space-x-2', 'mb-4')}>
        {backgrounds.map((bg, index) => (
          <div
            key={index}
            className={clsx('h-8 w-40', 'rounded-lg cursor-pointer', bg)}
          />
        ))}
      </div> */}

      <form onSubmit={handleSubmit(submitHandler)}>
        <div className="mb-6">
          <Field
            key="title"
            id="title"
            type="text"
            label={
              <label
                htmlFor="title"
                className={clsx('block', 'text-sm font-semibold')}
              >
                Board title <span className="text-red-500">*</span>
              </label>
            }
            placeholder=""
            register={register}
            validation={{
              required: 'This field is required',
            }}
            error={errors['title'] as any}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            className={clsx(
              'px-4 py-2',
              'text-sm font-semibold',
              'rounded-md',
              'hover:opacity-60',
            )}
            onClick={onExit}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={clsx(
              'px-4 py-2',
              'rounded-md',
              'text-sm font-semibold',
              'bg-on-foreground text-foreground',
              'hover:opacity-60',
            )}
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
};
