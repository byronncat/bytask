'use client';

import type { Task } from 'schema';
import type { Query } from '@/constants/metadata';

import { SORT_BY, SORT_ORDER, TASK_STATUS } from '@/constants/metadata';

import {
  useContext,
  createContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { taskAction } from '@/api';
import { useGlobal } from './Global.provider';

const TaskManagementContext = createContext(
  {} as {
    tasks: Task[] | undefined;
    setTasks: React.Dispatch<React.SetStateAction<Task[] | undefined>>;
    isFetching: boolean;
    setIsFetching: React.Dispatch<React.SetStateAction<boolean>>;
    fetchTask: (
      taskId: Task['id'],
    ) => Promise<{ success: boolean; data?: Task }>;
    fetchTasks: () => Promise<boolean>;
    createTask: (data: Partial<Task>) => ReturnType<typeof taskAction.create>;
    updateTask: (data: Partial<Task>) => ReturnType<typeof taskAction.update>;
    removeTask: (taskId: Task['id']) => ReturnType<typeof taskAction.remove>;
    setQuery: React.Dispatch<React.SetStateAction<Query | undefined>>;
  },
);

export const useTask = () => useContext(TaskManagementContext);

export default function TaskManagementProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [tasks, setTasks] = useState<Task[]>();
  const [isFetching, setIsFetching] = useState(true);
  const [query, setQuery] = useState<Query>();
  const { _refresh } = useGlobal();

  const fetchTasks = useCallback(async function (query?: Query) {
    setIsFetching(true);
    const { success, data } = await taskAction.getMany(query);
    if (success) setTasks(data);
    setIsFetching(false);
    return success;
  }, []);

  const createTask = useCallback(async function (data: Partial<Task>) {
    const response = await taskAction.create(data);
    if (response.success) {
      setTasks((prev) => [response.data as Task, ...(prev || [])]);
    }
    return response;
  }, []);

  const fetchTask = useCallback(async function (taskId: Task['id']) {
    const { success, data } = await taskAction.getById(taskId);
    return { success, data };
  }, []);

  const updateTask = useCallback(async function (data: Partial<Task>) {
    const response = await taskAction.update(data);
    if (response.success) {
      setTasks((prev) => {
        if (!prev) return prev;
        const index = prev.findIndex((task) => task.id === data.id);
        if (index === -1) return prev;
        prev[index] = { ...prev[index], ...data };
        return [...prev];
      });
    }
    return response;
  }, []);

  const removeTask = useCallback(async function (taskId: Task['id']) {
    const response = await taskAction.remove(taskId);
    if (response.success) {
      setTasks((prev) => {
        if (!prev) return prev;
        const index = prev.findIndex((task) => task.id === taskId);
        if (index === -1) return prev;
        prev.splice(index, 1);
        return [...prev];
      });
    }
    return response;
  }, []);

  useEffect(() => {
    if (!query) return;
    fetchTasks(query);
  }, [query, fetchTasks, _refresh]);

  return (
    <TaskManagementContext.Provider
      value={{
        tasks,
        setTasks,
        isFetching,
        setIsFetching,
        fetchTask,
        fetchTasks,
        createTask,
        updateTask,
        removeTask,
        setQuery,
      }}
    >
      {children}
    </TaskManagementContext.Provider>
  );
}
