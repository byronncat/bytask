import type { Api } from 'api';
import { AI_KEY } from '@/constants/serverConfig';

export async function analyzeSchedule(prompt: string): Promise<Api<string>> {
  try {
    const response = await fetch('https://api.cohere.ai/v2/chat', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${AI_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'command',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 100,
        stream: false
      }),
    });

    const responseData = await response.json();
    console.log('AI Response:', JSON.stringify(responseData, null, 2));

    if (!response.ok) {
      console.error('API Error:', responseData);
      throw responseData as Api['message'];
    }

    if (!responseData.message?.content) {
      console.error('Invalid response format:', responseData);
      throw new Error('Invalid response format from AI service');
    }

    // Extract the text content from the response
    let content = responseData.message.content;
    if (Array.isArray(content)) {
      content = content[0];
    }
    
    // If content is an object with a text property, extract it
    if (typeof content === 'object' && content !== null && 'text' in content) {
      content = content.text;
    }

    if (typeof content !== 'string') {
      console.error('Unexpected content format:', content);
      throw new Error('Unexpected content format from AI service');
    }

    return {
      success: true,
      message: 'Time session created successfully',
      data: content,
    };
  } catch (error) {
    console.error('AI Service Error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An error occurred while analyzing schedule',
    };
  }
}

interface AI_Response {
  id: string;
  finish_reason: 'COMPLETE' | 'MAX_TOKENS' | 'ERROR' | 'STOP_SEQUENCE' | 'TOOL_CALL';
  message: {
    content: string | Array<{text: string}>;
    role: 'assistant';
  };
  usage: {
    billed_units: {
      input_tokens: number;
      output_tokens: number;
    };
    tokens: {
      input_tokens: number;
      output_tokens: number;
    };
  };
}
