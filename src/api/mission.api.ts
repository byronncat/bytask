'use client';

import { FILTER_BY, SORT_BY, SORT_ORDER } from '@/constants/taskMetadata';
import type { IApi } from 'api';
import { IMission } from 'schema';

const serverHost = process.env.NEXT_PUBLIC_DOMAIN;
if (!serverHost) throw Error('Server Host is not defined');

const apiUrl = {
  createMission: `${serverHost}/v1/missions`,
  getMissions: `${serverHost}/v1/missions`,
  deleteMission: `${serverHost}/v1/missions`,
};

export async function create(
  data: Pick<IMission, 'title'>,
): Promise<IApi<IMission['id']>> {
  return await fetch(apiUrl.createMission, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw Error('Mission creation failed');
      return {
        success: true,
        message: 'Mission created successfully',
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

interface IGetMissions {
  sortBy?: `${SORT_BY}`;
  sortOrder?: `${SORT_ORDER}`;
  filterBy?: `${FILTER_BY}`;
  search?: string;
}

export async function get(
  { sortBy, sortOrder, filterBy, search }: IGetMissions = {
    sortBy: SORT_BY.ACTIVED_AT,
    sortOrder: SORT_ORDER.DESC,
  },
): Promise<IApi<IMission[]>> {
  return await fetch(
    `${apiUrl.getMissions}?sortBy=${sortBy}&sortOrder=${sortOrder}${
      filterBy ? '&filterBy=' + filterBy : ''
    }${search ? '&search=' + search : ''}`,
  )
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw Error(data);
      return {
        success: true,
        message: 'Missions fetched successfully',
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

export async function remove(id: string): Promise<IApi> {
  return await fetch(`${apiUrl.deleteMission}/${id}`, {
    method: 'DELETE',
  })
    .then(async (res) => {
      const message = await res.json();
      if (!res.ok) throw Error(message);
      return {
        success: true,
        message,
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
