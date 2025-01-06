'use client';

import type { Api } from 'api';
import { SERVER_API } from '@/constants/serverConfig';
import { ANALYTICS_RANGE, ANALYTICS_REQUIREMENT } from '@/constants/analytics';

const apiUrl = {
  analyzeTaskStatus: ({ field, range }: analyzeTaskStatusParams) =>
    `${SERVER_API}/v1/analytics?range=${range}&field=${field}`,
};

interface analyzeTaskStatusParams {
  field: ANALYTICS_REQUIREMENT;
  range: ANALYTICS_RANGE;
}
export async function analyzeTaskStatus<T>(
  data: analyzeTaskStatusParams,
): Promise<Api<T[]>> {
  return await fetch(apiUrl.analyzeTaskStatus(data))
    .then(async (res) => {
      const response = await res.json();
      if (!res.ok) throw response as Api['message'];
      return {
        success: true,
        message: 'Task status analyzed successfully',
        data: response as T[],
      };
    })
    .catch((error) => {
      return {
        success: false,
        message: error,
      };
    });
}
