'use client';

import type { FieldError } from 'react-hook-form';
import type { Task } from 'schema';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import {
  TextInput,
  TextArea,
  Selection,
  StatusTag,
  Datepicker,
} from '@/components';
import { Label, Overlay, ColorPicker } from './_components';
import { useOutsideAlerter } from '@/hooks';
import { useTask } from '@/providers';
import { TASK_STATUS } from '@/constants/metadata';

interface TaskModalProps {
  taskId?: Task['id'];
  onExit: () => void;
  className?: string;
}

export default function TaskModal({
  taskId,
  onExit,
  className,
}: Readonly<TaskModalProps>) {
  const [cover, setCover] = useState<HexColor>('');
  const [defaultTask, setDefaultTask] = useState<Task | null>(null);
  const { createTask, fetchTask, updateTask, removeTask } = useTask();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const ref = useRef<HTMLDivElement>(null);
  useOutsideAlerter(ref, onExit);

  const initialTask = useCallback(async () => {
    if (!taskId) return;
    const { success, data: task } = await fetchTask(taskId);
    if (success && task) {
      setCover(task.cover || '');
      setValue('title', task.title);
      setValue('description', task.description || '');
      setValue('status', task.status || TASK_STATUS.TODO);
      setValue('start_date', task.start_date || '');
      setValue('due_date', task.due_date || '');
      setDefaultTask(task);
    }
  }, [taskId, fetchTask, setValue]);

  async function createTaskHandler(data: Partial<Task>) {
    if (!data.title) return;
    await createTask({
      title: data.title,
      status: data.status,
      start_date: data.start_date,
      due_date: data.due_date,
      description: data.description,
      cover,
    });
  }

  async function updateTaskHandler(data: Partial<Task>) {
    if (!data.title || !taskId) return;
    await updateTask({
      id: taskId,
      title: data.title,
      status: data.status,
      start_date: data.start_date,
      due_date: data.due_date,
      description: data.description,
      cover,
    });
  }

  async function removeTaskHandler() {
    if (!taskId) return;
    onExit();
    await removeTask(taskId);
  }

  function submitHandler(data: Partial<Task>) {
    onExit();
    if (taskId) updateTaskHandler(data);
    else createTaskHandler(data);
  }

  useEffect(() => {
    initialTask();
  }, [taskId, initialTask]);

  return (
    <Overlay>
      <div
        ref={ref}
        className={clsx(
          'relative',
          'w-[37.5rem] max-w-full max-h-full',
          'bg-foreground text-on-foreground',
          'border border-divider',
          'rounded-lg shadow-lg',
          'overflow-hidden',
          className,
        )}
      >
        <div
          className={clsx(
            'px-6 pt-6 pb-4',
            'border-b border-divider',
            'flex items-center justify-between',
          )}
        >
          <h2 className="text-lg font-semibold">
            {taskId ? 'Update' : 'Create'} Task
          </h2>
          <button
            onClick={onExit}
            aria-label="Close"
            className={clsx(
              'size-8 flex items-center justify-center',
              'hover:opacity-60 transition-opacity duration-200',
            )}
          >
            <FontAwesomeIcon icon={faXmark} className="size-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(submitHandler)}
          className="pb-[calc(4.25rem+1px)]"
        >
          <div
            className={clsx(
              'px-6 pt-3 pb-10',
              'overflow-y-auto max-h-[calc(100vh-8.75rem-2px)]',
            )}
          >
            <div className={clsx('grid grid-cols-2', 'gap-4')}>
              <ColorPicker
                label={<Label label="Color" />}
                onSelect={setCover}
                className="col-span-2"
                defaultValue={cover}
              />
              <Selection
                label={<Label label="Status" />}
                options={STATUS_OPTIONS}
                onClick={() => {}}
                onSelect={(value) => {
                  setValue('status', value);
                }}
                className="col-span-1"
                inputClassName="bg-input"
                defaultValue={defaultTask?.status}
              />
              <TextInput
                id="title"
                type="text"
                label={<Label label="Title" id="title" dot />}
                placeholder="Enter a task title"
                register={register}
                validation={{
                  required: 'This field is required',
                }}
                error={errors['title'] as FieldError}
                className="col-span-2"
                inputClassName="bg-input"
              />
              <TextArea
                id="description"
                label={<Label label="Description" id="description" />}
                placeholder="Add a more detailed description..."
                register={register}
                error={errors['description'] as FieldError}
                className="col-span-2"
                inputClassName="bg-input"
              />
              <Datepicker
                id="start_date"
                label={<Label label="Start date" id="start_date" />}
                register={register}
                className="col-span-1"
                inputClassName="bg-input"
                defaultValue={defaultTask?.start_date}
              />
              <Datepicker
                id="due_date"
                label={<Label label="Due date" id="due_date" />}
                register={register}
                className="col-span-1"
                inputClassName="bg-input"
                defaultValue={defaultTask?.due_date}
              />
            </div>
          </div>

          <div
            className={clsx(
              'flex',
              taskId ? 'justify-between' : 'justify-end',
              'px-6 py-4 border-t border-divider',
              'bg-foreground',
              'absolute inset-x-0 bottom-0',
            )}
          >
            {taskId && (
              <button
                type="button"
                className={clsx(
                  'px-4 py-2',
                  'text-sm font-semibold',
                  'rounded-md',
                  'bg-red-500 dark:bg-red-400 text-foreground',
                  'hover:opacity-60 transition-opacity duration-200',
                )}
                onClick={removeTaskHandler}
              >
                Delete
              </button>
            )}
            <div className="flex space-x-2">
              <button
                type="button"
                className={clsx(
                  'px-4 py-2',
                  'text-sm font-semibold',
                  'rounded-md',
                  'hover:opacity-60 transition-opacity duration-200',
                )}
                onClick={onExit}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={clsx(
                  'px-4 py-2',
                  'rounded',
                  'text-sm font-semibold',
                  'bg-primary text-foreground',
                  'hover:opacity-60 transition-opacity duration-200',
                )}
              >
                {taskId ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Overlay>
  );
}

const STATUS_OPTIONS = [
  {
    id: TASK_STATUS.TODO,
    option: <StatusTag status={TASK_STATUS.TODO} />,
    value: TASK_STATUS.TODO,
    default: true,
  },
  {
    id: TASK_STATUS.IN_PROGRESS,
    option: <StatusTag status={TASK_STATUS.IN_PROGRESS} />,
    value: TASK_STATUS.IN_PROGRESS,
  },
  {
    id: TASK_STATUS.BLOCKED,
    option: <StatusTag status={TASK_STATUS.BLOCKED} />,
    value: TASK_STATUS.BLOCKED,
  },
  {
    id: TASK_STATUS.ON_HOLD,
    option: <StatusTag status={TASK_STATUS.ON_HOLD} />,
    value: TASK_STATUS.ON_HOLD,
  },
  {
    id: TASK_STATUS.REVIEW,
    option: <StatusTag status={TASK_STATUS.REVIEW} />,
    value: TASK_STATUS.REVIEW,
  },
  {
    id: TASK_STATUS.DONE,
    option: <StatusTag status={TASK_STATUS.DONE} />,
    value: TASK_STATUS.DONE,
  },
  {
    id: TASK_STATUS.ARCHIVED,
    option: <StatusTag status={TASK_STATUS.ARCHIVED} />,
    value: TASK_STATUS.ARCHIVED,
  },
  {
    id: TASK_STATUS.CANCELED,
    option: <StatusTag status={TASK_STATUS.CANCELED} />,
    value: TASK_STATUS.CANCELED,
  },
];
