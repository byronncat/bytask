'use client';

import type { Api } from 'api';
import { SERVER_API } from '@/constants/serverConfig';

const apiUrl = {
  analyzeSchedule: `${SERVER_API}/v1/ai/analyze-schedule`,
};

export async function analyzeSchedule(): Promise<Api<any>> {
  return await fetch(apiUrl.analyzeSchedule, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(async (res) => {
      const reponse = await res.json();
      if (!res.ok) throw reponse as Api['message'];
      return {
        success: true,
        message: 'Analysis completed successfully',
        data: reponse as any,
      };
    })
    .catch((error) => {
      return {
        success: false,
        message: error,
      };
    });
}
