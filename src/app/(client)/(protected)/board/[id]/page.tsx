'use client';

import clsx from 'clsx';
import { useEffect, useState } from 'react';
import {
  // faStar as faSolidStar,
  faEarthAfrica,
  faChartSimple,
  faPlus,
  faX,
} from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Mission, ITask, ITaskList } from 'schema';
import { listAction, missionAction, taskAction } from '@/api';
import { usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Field } from '@/components';

export default function BoardViewPage() {
  const [lists, setLists] = useState<ITaskList[]>();
  const [mission, setMission] = useState<Mission>();
  const pathname = usePathname();

  useEffect(() => {
    const missionId = pathname.split('/').pop() || '';
    async function fetchMission() {
      if (!missionId) return;
      const { success, data } = await missionAction.getOne(missionId);
      if (success) {
        setMission(data);
        await fetchLists(missionId);
      }
    }

    async function fetchLists(missionId: string) {
      const { success, data } = await listAction.getListByMission(missionId);
      if (success) setLists(data);
    }

    fetchMission();
  }, [pathname]);

  // const [draggingCard, setDraggingCard] = useState<string | null>(null);
  // const [draggingFromList, setDraggingFromList] = useState<string | null>(null);
  // const [hoveredListId, setHoveredListId] = useState<string | null>(null);

  // const handleDragStart = (cardId: string, sourceListId: string) => {
  //   setDraggingCard(cardId);
  //   setDraggingFromList(sourceListId);
  // };

  // const handleDrop = (destinationListId: string) => {
  //   if (!draggingCard) return;

  //   // If dropped into the same list
  //   if (draggingFromList === destinationListId) {
  //     setDraggingCard(null);
  //     setDraggingFromList(null);
  //     setHoveredListId(null);
  //     return;
  //   }

  //   const newLists = lists.map((list) => {
  //     if (list.id === draggingFromList) {
  //       return {
  //         ...list,
  //         tasks: list.tasks.filter((card) => card !== draggingCard),
  //       };
  //     }
  //     if (list.id === destinationListId) {
  //       return {
  //         ...list,
  //         tasks: [...list.tasks, draggingCard],
  //       };
  //     }
  //     return list;
  //   });

  //   setLists(newLists);
  //   setDraggingCard(null);
  //   setDraggingFromList(null);
  //   setHoveredListId(null);
  // };

  // const handleDragEnter = (listId: string) => {
  //   setHoveredListId(listId);
  // };

  // const handleDragLeave = (listId: string) => {
  //   if (hoveredListId === listId) setHoveredListId(null);
  // };

  const addListHandler = async (data: Pick<ITaskList, 'title'>) => {
    if (!mission) return;
    const { success, data: listId } = await listAction.create({
      title: data.title,
      mission_id: mission.id,
    });

    if (success) {
      setLists([...(lists || []), { id: listId, ...data } as ITaskList]);
    }
  };

  return (
    <>
      <Heading title={mission?.title} />
      <div
        className={clsx(
          'p-3 h-[calc(100%-3.5rem)]',
          'flex gap-x-3',
          'overflow-x-auto',
        )}
      >
        {mission &&
          lists?.map((list) => (
            <List
              key={list.id}
              {...list}
              missionId={mission.id}
              className="flex-shrink-0"
            />
          ))}
        <AddListModal onCreate={addListHandler} className="flex-shrink-0" />
      </div>
    </>
  );
}

function Heading({ title }: Readonly<{ title?: string }>) {
  return (
    <div
      className={clsx(
        'w-full h-14 px-4 py-3',
        'bg-foreground/[.9] backdrop-blur',
        'flex items-center',
      )}
    >
      <span className={clsx('text-contrast/[.9] font-semibold', 'px-2')}>
        {title}
      </span>
      <div className="ml-2 flex space-x-1">
        <button
          className={clsx(
            'size-7',
            'flex items-center justify-center',
            'hover:bg-on-foreground/[.12]',
            'rounded',
          )}
        >
          <FontAwesomeIcon icon={faStar} className="size-4" />
        </button>
        <button
          className={clsx(
            'size-7',
            'flex items-center justify-center',
            'hover:bg-on-foreground/[.12]',
            'rounded',
          )}
        >
          <FontAwesomeIcon icon={faEarthAfrica} className="size-4" />
        </button>
        <button
          className={clsx(
            'h-7 pl-1 pr-2',
            'flex items-center justify-center',
            'hover:bg-on-foreground/[.12]',
            'rounded',
          )}
        >
          <div className={clsx('size-6', 'flex items-center justify-center')}>
            <FontAwesomeIcon
              icon={faChartSimple}
              className="size-4 rotate-180"
            />
          </div>
          Board
        </button>
      </div>
    </div>
  );
}

interface ListProps extends ITaskList {
  className?: string;
  missionId: string;
}

function List({
  id: listId,
  title,
  className,
  missionId,
}: Readonly<ListProps>) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const { register, handleSubmit } = useForm<Pick<ITask, 'title'>>();

  async function taskHandler(data: Pick<ITask, 'title'>) {
    console.log(data);
    const { success, data: taskId } = await taskAction.create({
      title: data.title,
      list_id: listId,
      mission_id: missionId,
    });

    if (success) {
      setTasks([...tasks, { id: taskId, ...data }]);
    }
  }

  return (
    <div
      className={clsx(
        'bg-surface-1 text-on-surface-1',
        'h-min basis-64 rounded-xl',
        className,
      )}
    >
      <div className="p-2 pb-0">
        <h2 className="font-semibold text-sm pl-2 py-2">{title}</h2>
      </div>

      {tasks.length > 0 && (
        <ol className="space-y-2 p-2">
          {tasks.map((task: any) => (
            <li key={task.id}>
              <Card {...task} />
            </li>
          ))}
        </ol>
      )}

      {showModal ? (
        <form
          onSubmit={handleSubmit(taskHandler)}
          className="flex mt-4 bg-white flex-col px-2"
        >
          <Field
            id="title"
            key="title"
            type="text"
            register={register}
            placeholder=""
            validation={{
              required: 'Title is required',
            }}
          />

          <div className="flex items-center space-x-2 ">
            <button
              type="submit"
              className={clsx(
                'px-2 py-1',
                'bg-blue-400 text-surface-1',
                'rounded',
                'hover:opacity-80',
              )}
            >
              Add Card
            </button>

            <button
              type="button"
              onClick={() => setShowModal(false)}
              className={clsx(
                'size-8',
                'text-on-surface-2',
                'rounded',
                'hover:bg-contrast/[.12]',
              )}
            >
              <FontAwesomeIcon icon={faX} className="size-4" />
            </button>
          </div>
        </form>
      ) : (
        <div className={clsx('p-2 pt-0', 'w-full')}>
          <button
            className={clsx(
              'px-2 pt-2 pb-1',
              'flex items-center',
              'hover:bg-on-surface-1/[.2] rounded-lg w-full',
            )}
            onClick={() => setShowModal(true)}
          >
            <FontAwesomeIcon icon={faPlus} className="size-4 mr-2" />
            <div className="text-on-surface-2">Add a card</div>
          </button>
        </div>
      )}
    </div>
  );
}

interface CardProps {
  title: string;
  className?: string;
}

function Card({ title, className }: Readonly<CardProps>) {
  return (
    <div
      className={clsx(
        'bg-surface-2',
        'px-3 pt-2 pb-1',
        'rounded-lg shadow',
        'cursor-pointer',
        className,
      )}
    >
      {title}
    </div>
  );
}

interface AddListModalProps {
  onCreate: (data: Pick<ITaskList, 'title'>) => void;
  className?: string;
}

function AddListModal({ onCreate, className }: Readonly<AddListModalProps>) {
  const [isCreating, setIsCreating] = useState(false);
  const { register, handleSubmit } = useForm<Pick<ITaskList, 'title'>>();

  async function createList(data: Pick<ITaskList, 'title'>) {
    onCreate(data);
    setIsCreating(false);
  }

  if (!isCreating)
    return (
      <div
        onClick={() => setIsCreating(true)}
        className={clsx(
          'w-64 h-fit p-3 rounded-xl',
          'cursor-pointer shadow',
          'bg-on-background/[.07] hover:bg-on-background/[.2]',
          className,
        )}
      >
        <FontAwesomeIcon icon={faPlus} className="size-4 mr-2" />
        Add another list
      </div>
    );

  return (
    <form
      onSubmit={handleSubmit(createList)}
      className={clsx(
        'w-64 h-fit',
        'p-3',
        'rounded-xl',
        'shadow',
        'bg-surface-1',
        className,
      )}
    >
      <Field
        id="title"
        key="title"
        type="text"
        register={register}
        placeholder=""
        validation={{
          required: 'Title is required',
        }}
      />
      <div className="flex items-center mt-4 space-x-2">
        <button
          type="submit"
          className={clsx(
            'px-2 py-1',
            'bg-blue-400 text-surface-1',
            'rounded',
            'hover:opacity-80',
          )}
        >
          Add List
        </button>
        <button
          type="button"
          onClick={() => setIsCreating(false)}
          className={clsx(
            'size-8',
            'text-on-surface-2',
            'rounded',
            'hover:bg-contrast/[.12]',
          )}
        >
          <FontAwesomeIcon icon={faX} className="size-4" />
        </button>
      </div>
    </form>
  );
}
