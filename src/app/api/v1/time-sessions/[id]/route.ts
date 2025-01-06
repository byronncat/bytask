import type { NextRequest } from 'next/server';
import type { TimeSession } from 'schema';

import { authAction_v2 } from '@/api';
import { TimeSessionModel } from '@/database';
import { STATUS_CODE } from '@/constants/serverConfig';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: TimeSession['id'] }> },
) {
  try {
    const sessionPayload = await authAction_v2.authenticate();
    if (!sessionPayload) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: STATUS_CODE.UNAUTHORIZED,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const timeSessionId = (await params).id;
    const timeSession = await TimeSessionModel.findById(timeSessionId);

    if (!timeSession) {
      return new Response(
        JSON.stringify({ message: 'Time session not found' }),
        {
          status: STATUS_CODE.NOT_FOUND,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }

    await TimeSessionModel.deleteOne({ _id: timeSessionId });

    return new Response(
      JSON.stringify({ message: 'Time session deleted successfully' }),
      {
        status: STATUS_CODE.OK,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    const message = typeof error === 'string' ? error : 'Internal server error';
    console.error('[Error]:', message);
    return new Response(JSON.stringify(message), {
      status: STATUS_CODE.INTERNAL_SERVER_ERROR,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
