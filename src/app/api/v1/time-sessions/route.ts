import type { NextRequest } from 'next/server';
import type { TimeSession } from 'schema';

import { authAction_v2 } from '@/api';
import { TaskModel, TimeSessionModel } from '@/database';
import { TASK_STATUS } from '@/constants/metadata';
import { STATUS_CODE } from '@/constants/serverConfig';

export async function POST(request: NextRequest) {
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

    const data = (await request.json()) as TimeSession;

    const timeSessionData: Partial<TimeSession> = {
      uid: sessionPayload.user.id,
      task_id: data.task_id,
      start_at: data.start_at,
      end_at: data.end_at,
    };

    const timeSession = await TimeSessionModel.create(timeSessionData);
    const task = await TaskModel.findById(data.task_id);
    task.status = TASK_STATUS.IN_PROGRESS;
    await task.save();

    return new Response(JSON.stringify(timeSession), {
      status: STATUS_CODE.CREATED,
      headers: {
        'Content-Type': 'application/json',
      },
    });
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

export async function GET() {
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

    const timeSessions = await TimeSessionModel.aggregate([
      { $match: { uid: sessionPayload.user.id } },
      {
        $addFields: {
          task_id: { $toObjectId: '$task_id' }, // Convert task_id to ObjectId
        },
      },
      {
        $lookup: {
          from: 'tasks',
          localField: 'task_id',
          foreignField: '_id',
          as: 'task',
        },
      },
      { $unwind: '$task' },
      {
        $project: {
          id: '$_id',
          uid: 1,
          task_id: 1,
          start_at: 1,
          end_at: 1,
          type: 1,
          title: '$task.title',
          due_date: '$task.due_date',
          cover: '$task.cover',
        },
      },
      {
        $sort: {
          start_at: -1,
        },
      },
    ]);

    return new Response(JSON.stringify(timeSessions), {
      status: STATUS_CODE.OK,
      headers: {
        'Content-Type': 'application/json',
      },
    });
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
