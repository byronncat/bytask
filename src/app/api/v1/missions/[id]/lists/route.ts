import type { NextRequest } from 'next/server';
import { getUser } from '@/helpers';
import { STATUS_CODE } from '@/constants/serverConfig';
import { TaskListModel } from '@/database';

export async function GET(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return new Response(JSON.stringify('User not logged in!'), {
        status: STATUS_CODE.FORBIDDEN,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const missionId = request.nextUrl.pathname.split('/')[4];
    const lists = await TaskListModel.find({
      mission_id: missionId,
    });

    return new Response(JSON.stringify(lists), {
      status: STATUS_CODE.OK,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('[Error]:', error);
    const errorMessage =
      typeof error === 'string' ? error : 'Internal server error';
    return new Response(JSON.stringify(errorMessage), {
      status: STATUS_CODE.INTERNAL_SERVER_ERROR,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
