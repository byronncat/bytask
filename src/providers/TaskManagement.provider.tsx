'use client';

import type { Task } from 'schema';
import type { Query } from '@/constants/metadata';

import { SORT_BY, SORT_ORDER } from '@/constants/metadata';

import {
  useContext,
  createContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { taskAction } from '@/api';
import { usePathname } from 'next/navigation';
import { ROUTE } from '@/constants/serverConfig';

const TaskManagementContext = createContext(
  {} as {
    tasks: Task[] | undefined;
    setTasks: React.Dispatch<React.SetStateAction<Task[] | undefined>>;
    isLoaded: boolean;
    isFetching: boolean;
    setIsFetching: React.Dispatch<React.SetStateAction<boolean>>;
    fetchTask: (
      taskId: Task['id'],
    ) => Promise<{ success: boolean; data?: Task }>;
    fetchTasks: () => Promise<boolean>;
    createTask: (data: Partial<Task>) => ReturnType<typeof taskAction.create>;
    updateTask: (data: Partial<Task>) => ReturnType<typeof taskAction.update>;
    removeTask: (taskId: Task['id']) => ReturnType<typeof taskAction.remove>;
    setQuery: React.Dispatch<React.SetStateAction<Query>>;
  },
);

export const useTask = () => useContext(TaskManagementContext);

export default function TaskManagementProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [tasks, setTasks] = useState<Task[]>();
  const [isFetching, setIsFetching] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [query, setQuery] = useState<Query>({
    sortBy: SORT_BY.RECENTLY_UPDATED,
    sortOrder: SORT_ORDER.DESC,
    search: '',
  });
  const pathname = usePathname();

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
    if (
      pathname === ROUTE.CARD_VIEW ||
      pathname === ROUTE.TALBE_VIEW ||
      pathname === ROUTE.CALENDAR_VIEW
    ) {
      fetchTasks();
    }
  }, [fetchTasks, pathname]);

  useEffect(() => {
    if (isLoaded) fetchTasks(query);
  }, [query, fetchTasks, isLoaded]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <TaskManagementContext.Provider
      value={{
        tasks,
        setTasks,
        isLoaded,
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
