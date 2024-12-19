import Link from 'next/link';
import { useState } from 'react';
import clsx from 'clsx';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { missionAction } from '@/api';
import { ROUTE } from '@/constants/server';
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

  if (isFetching)
    return (
      <Wrapper>
        <FetchingBoards />
      </Wrapper>
    );

  async function createMissionHandler() {
    setShowModal(true);
    // const { success } = await missionAction.create({ title: 'New Board' });
    // if (success) fetchMissions();
  }

  const CreateBoardModal = () => (
    <button onClick={createMissionHandler}>
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
  );

  return (
    <Wrapper>
      {showModal && <CreateBoardPopup onExit={() => setShowModal(false)} />}
      <CreateBoardModal />
      {data.map((mission) => (
        <Link href={ROUTE.BOARD_VIEW} key={mission.id}>
          <Container
            className={clsx(
              'relative',
              'bg-surface-1 text-on-surface-1',
              'flex items-center justify-center',
              'font-semibold',
            )}
          >
            {mission.title}
            <button
              className={clsx('absolute top-0 right-0', 'p-2', 'text-red-400')}
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
  onExit,
}: Readonly<{
  onExit?: () => void;
}>) => {
  const [boardTitle, setBoardTitle] = useState('');
  const [visibility, setVisibility] = useState('Workspace');

  const backgrounds = [
    'bg-gray-200', // Plain
    'bg-yellow-300', // Gradient/Yellow
    'bg-blue-500', // Blue
    'bg-blue-600', // Dark Blue
    'bg-purple-500', // Purple
    'bg-orange-400', // Orange
  ];

  function Overlay({ children }: Readonly<{ children?: React.ReactNode }>) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10"
        onClick={onExit}
      >
        {children}
      </div>
    );
  }

  return (
    <Overlay>
      <div
        className="w-[400px] bg-white rounded-lg shadow-lg p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <h2 className="text-xl font-semibold mb-4">Create board</h2>

        {/* Backgrounds */}
        <div className="flex space-x-2 mb-4">
          {backgrounds.map((bg, index) => (
            <div
              key={index}
              className={`h-12 w-16 rounded-lg cursor-pointer ${bg}`}
            ></div>
          ))}
        </div>

        {/* Board Title */}
        <div className="mb-4">
          <label
            htmlFor="boardTitle"
            className="block text-sm font-medium text-gray-700"
          >
            Board title <span className="text-red-500">*</span>
          </label>
          <input
            id="boardTitle"
            type="text"
            value={boardTitle}
            onChange={(e) => setBoardTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g. Project Management"
          />
          {!boardTitle && (
            <p className="text-sm text-red-500 mt-1">
              🔥 Board title is required
            </p>
          )}
        </div>

        {/* Visibility */}
        <div className="mb-4">
          <label
            htmlFor="visibility"
            className="block text-sm font-medium text-gray-700"
          >
            Visibility
          </label>
          <select
            id="visibility"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option>Workspace</option>
            <option>Private</option>
          </select>
        </div>

        {/* Remaining Boards */}
        <p className="text-sm text-gray-500 mb-4">
          This Workspace has 6 boards remaining. Free Workspaces can only have
          10 open boards. For unlimited boards, upgrade your Workspace.
        </p>

        {/* Actions */}
        <div className="flex justify-end">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md mr-2"
            onClick={() => console.log('Cancel')}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
            onClick={() => alert(`Board '${boardTitle}' created!`)}
            disabled={!boardTitle}
          >
            Create
          </button>
        </div>
      </div>
    </Overlay>
  );
};
