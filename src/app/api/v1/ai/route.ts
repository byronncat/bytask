import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const { prompt } = await request.json().catch(() => {
    throw new Error('Invalid request body!');
  });

  if (!prompt) {
    return new Response(
      JSON.stringify({ error: 'Missing text query parameter' }),
      { status: 400 },
    );
  }

  try {
    const response = await fetch('https://api.cohere.ai/generate', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'command-xlarge-nightly',
        prompt,
        max_tokens: 100,
      }),
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching inference:', error); // Log the error for debugging

    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
      }),
      { status: 500 },
    );
  }
}
