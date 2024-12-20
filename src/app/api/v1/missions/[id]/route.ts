import { MissionModel } from '@/database/model';
import { getUser } from '@/helpers';
import { STATUS_CODE } from '@/constants/server';
import type { NextRequest } from 'next/server';

export async function DELETE(request: NextRequest) {
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

    const missionId = request.nextUrl.pathname.split('/').pop();
    await MissionModel.deleteOne({ _id: missionId, user_id: user.id });
    return new Response(JSON.stringify('Mission deleted successfully'), {
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
