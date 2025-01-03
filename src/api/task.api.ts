'use client';

import type { Api } from 'api';
import type { Task } from 'schema';
import type { Query } from '@/constants/metadata';
import { SORT_BY, SORT_ORDER } from '@/constants/metadata';
import { SERVER_API } from '@/constants/serverConfig';

const apiUrl = {
  createTask: `${SERVER_API}/v1/tasks`,
  updateTask: `${SERVER_API}/v1/tasks`,
  removeTask: (id: Task['id']) => `${SERVER_API}/v1/tasks/${id}`,
  getById: (id: Task['id']) => `${SERVER_API}/v1/tasks/${id}`,
  getManyTasks: ({ sortBy, sortOrder, filterBy, filterValue, search }: Query) =>
    `${SERVER_API}/v1/tasks?sortBy=${sortBy}&sortOrder=${sortOrder}${
      filterBy ? '&filterBy=' + filterBy + '&filterValue=' + filterValue : ''
    }${search ? '&search=' + search : ''}`,
};

export async function create(data: Partial<Task>): Promise<Api<Task>> {
  return await fetch(apiUrl.createTask, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(async (res) => {
      const reponse = await res.json();
      if (!res.ok) throw reponse as Api['message'];
      return {
        success: true,
        message: 'Task created successfully',
        data: reponse as Task,
      };
    })
    .catch((error) => {
      return {
        success: false,
        message: error,
      };
    });
}

export async function getById(id: Task['id']): Promise<Api<Task>> {
  return await fetch(apiUrl.getById(id))
    .then(async (res) => {
      const response = await res.json();
      if (!res.ok) throw response as Api['message'];
      return {
        success: true,
        message: 'Task fetched successfully',
        data: response as Task,
      };
    })
    .catch((error) => {
      return {
        success: false,
        message: error,
      };
    });
}

export async function update(data: Partial<Task>): Promise<Api<Task>> {
  return await fetch(apiUrl.updateTask, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(async (res) => {
      const response = await res.json();
      if (!res.ok) throw response as Api['message'];
      return {
        success: true,
        message: 'Task updated successfully',
        data: response as Task,
      };
    })
    .catch((error) => {
      return {
        success: false,
        message: error,
      };
    });
}

export async function remove(id: Task['id']): Promise<Api> {
  return await fetch(apiUrl.removeTask(id), {
    method: 'DELETE',
  })
    .then(async (res) => {
      const response = (await res.json()) as Api['message'];
      if (!res.ok) throw response;
      return {
        success: true,
        message: 'Task deleted successfully',
      };
    })
    .catch((error) => {
      return {
        success: false,
        message: error,
      };
    });
}

export async function getMany(
  { sortBy, sortOrder, filterBy, filterValue, search }: Query = {
    sortBy: SORT_BY.RECENTLY_UPDATED,
    sortOrder: SORT_ORDER.DESC,
  },
): Promise<Api<Task[]>> {
  return await fetch(
    apiUrl.getManyTasks({ sortBy, sortOrder, filterBy, filterValue, search }),
  )
    .then(async (res) => {
      const response = await res.json();
      if (!res.ok) throw response as Api['message'];
      return {
        success: true,
        message: 'Tasks fetched successfully',
        data: response as Task[],
      };
    })
    .catch((error) => {
      return {
        success: false,
        message: error,
      };
    });
}
