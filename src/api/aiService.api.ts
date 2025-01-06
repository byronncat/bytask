import type { Api } from 'api';
import { AI_KEY } from '@/constants/serverConfig';

export async function analyzeSchedule(prompt: string): Promise<Api<string>> {
  return await fetch('https://api.cohere.ai/generate', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${AI_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'command-xlarge-nightly',
      prompt,
      max_tokens: 100,
      api_version: '2022-12-06',
    }),
  })
    .then(async (res) => {
      const reponse = await res.json();
      if (!res.ok) throw reponse as Api['message'];
      return {
        success: true,
        message: 'Time session created successfully',
        data: (reponse as AI_Response).text,
      };
    })
    .catch((error) => {
      return {
        success: false,
        message: error,
      };
    });
}

interface AI_Response {
  id: string;
  text: string;
  meta: {
    api_version: {
      version: string;
      is_deprecated: boolean;
    };
    warnings: string[];
    billed_units: {
      input_tokens: number;
      output_tokens: number;
    };
  };
  finish_reason: string;
}
