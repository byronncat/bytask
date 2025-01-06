'use client';

import type { Api } from 'api';
import type { TimeSession } from 'schema';
import type { TimeSessionDisplay } from 'display';
import { SERVER_API } from '@/constants/serverConfig';

const apiUrl = {
  createTimeSession: `${SERVER_API}/v1/time-sessions`,
  getManyTimeSessions: `${SERVER_API}/v1/time-sessions`,
  removeSession: (id: TimeSession['id']) =>
    `${SERVER_API}/v1/time-sessions/${id}`,
};

export async function create(
  data: Partial<TimeSession>,
): Promise<Api<TimeSession>> {
  return await fetch(apiUrl.createTimeSession, {
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
        message: 'Time session created successfully',
        data: reponse as TimeSession,
      };
    })
    .catch((error) => {
      return {
        success: false,
        message: error,
      };
    });
}

export async function getMany(): Promise<Api<TimeSessionDisplay[]>> {
  return await fetch(apiUrl.getManyTimeSessions)
    .then(async (res) => {
      const response = await res.json();
      if (!res.ok) throw response as Api['message'];
      return {
        success: true,
        message: 'Time sessions fetched successfully',
        data: response as TimeSessionDisplay[],
      };
    })
    .catch((error) => {
      return {
        success: false,
        message: error,
      };
    });
}

export async function remove(id: TimeSession['id']): Promise<Api> {
  return await fetch(apiUrl.removeSession(id), {
    method: 'DELETE',
  })
    .then(async (res) => {
      const response = (await res.json()) as Api['message'];
      if (!res.ok) throw response;
      return {
        success: true,
        message: 'Time session removed successfully',
      };
    })
    .catch((error) => {
      return {
        success: false,
        message: error,
      };
    });
}
