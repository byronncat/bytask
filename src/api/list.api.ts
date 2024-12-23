'use client';

import type { Api } from 'api';
import { IMission, ITaskList } from 'schema';

const serverHost = process.env.NEXT_PUBLIC_DOMAIN;
if (!serverHost) throw Error('Server Host is not defined');

const apiUrl = {
  createList: `${serverHost}/v1/lists`,
  getListByMission: (missionId: IMission['id']) =>
    `${serverHost}/v1/missions/${missionId}/lists`,
  updateList: `${serverHost}/v1/lists`,
  deleteList: `${serverHost}/v1/lists`,
};

export async function create(
  data: Pick<ITaskList, 'title' | 'mission_id'>,
): Promise<Api<ITaskList['id']>> {
  return await fetch(apiUrl.createList, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw Error('List creation failed');
      return {
        success: true,
        message: 'List created successfully',
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

export async function getListByMission(
  missionId: IMission['id'],
): Promise<Api<ITaskList[]>> {
  return await fetch(apiUrl.getListByMission(missionId))
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw Error(data);
      return {
        success: true,
        message: 'Lists fetched successfully',
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
