'use client';

import clsx from 'clsx';
import { useState } from 'react';
import {
  // faStar as faSolidStar,
  faEarthAfrica,
  faChartSimple,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { TaskList } from 'schema';
import { temp_missions } from '@/__mocks__';

export default function BoardViewPage() {
  const [
    mission,
    // setMission
  ] = useState<any>(temp_missions[0]);
  const [lists, setLists] = useState(temp_missions[0].taskLists || []);

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

  const addListHandler = () => {
    const newList = { id: `list-${Date.now()}`, title: 'New list', tasks: [] };
    setLists([...lists, newList]);
  };

  return (
    <>
      <Heading title={mission.title} />
      <div
        className={clsx(
          'p-3 h-[calc(100%-3.5rem)]',
          'flex gap-x-3',
          'overflow-x-auto',
        )}
      >
        {lists.map((list: any) => (
          <List key={list.id} {...list} className="flex-shrink-0" />
        ))}
        <AddListButton onClick={addListHandler} className="flex-shrink-0" />
      </div>
    </>
  );
}

function Heading({ title }: Readonly<{ title: string }>) {
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

interface ListProps extends TaskList {
  className?: string;
}

function List({ title, tasks, className }: Readonly<ListProps>) {
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
          {/* {tasks.map((task) => (
            <li key={task.id}>
              <Card {...task} />
            </li>
          ))} */}
        </ol>
      )}

      <div className={clsx('p-2 pt-0', 'w-full')}>
        <button
          className={clsx(
            'px-2 pt-2 pb-1',
            'flex items-center',
            'hover:bg-on-surface-1/[.2] rounded-lg w-full',
          )}
        >
          <FontAwesomeIcon icon={faPlus} className="size-4 mr-2" />
          <div className="text-on-surface-2">Add a card</div>
        </button>
      </div>
    </div>
  );
}

// interface CardProps extends Task {
//   className?: string;
// }

// function Card({ title, className }: Readonly<CardProps>) {
//   return (
//     <div
//       className={clsx(
//         'bg-surface-2',
//         'px-3 pt-2 pb-1',
//         'rounded-lg shadow',
//         'cursor-pointer',
//         className,
//       )}
//     >
//       {title}
//     </div>
//   );
// }

interface AddListButtonProps {
  onClick: () => void;
  className?: string;
}

function AddListButton({ onClick, className }: Readonly<AddListButtonProps>) {
  return (
    <div
      onClick={onClick}
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
}
