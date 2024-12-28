'use client';

import type { Api } from 'api';
import type { ITask } from 'schema';
import { SERVER_API } from '@/constants/serverConfig';

const apiUrl = {
  createTask: `${SERVER_API}/v1/tasks`,
};

export async function create(
  data: Pick<ITask, 'title' | 'list_id' | 'mission_id'>,
): Promise<Api<ITask['id']>> {
  console.log('data', data);
  return await fetch(apiUrl.createTask, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw Error('Task creation failed');
      return {
        success: true,
        message: 'Task created successfully',
        data,
      };
    })
    .catch((error) => {
      console.error(error);
      return {
        success: false,
        message: error,
      };
    });
}
