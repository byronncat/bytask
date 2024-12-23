import type { NextRequest } from 'next/server';
import { getUser } from '@/helpers';
import { STATUS_CODE } from '@/constants/serverConfig';
import { TaskModel } from '@/database';

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return new Response(JSON.stringify({ message: 'User not logged in!' }), {
        status: STATUS_CODE.FORBIDDEN,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const data = await request.json();
    const task = await TaskModel.create({
      title: data.title,
      list_id: data.list_id,
      mission_id: data.mission_id,
    });

    return new Response(JSON.stringify(task.id), {
      status: STATUS_CODE.CREATED,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('[Error]:', error);
    const errorMessage =
      typeof error === 'string' ? error : 'Internal server error';
    return new Response(JSON.stringify({ message: errorMessage }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
