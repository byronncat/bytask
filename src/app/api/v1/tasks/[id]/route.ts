import type { NextRequest } from 'next/server';
import type { Task } from 'schema';

import { authAction_v2 } from '@/api';
import { TaskModel } from '@/database';
import { STATUS_CODE } from '@/constants/serverConfig';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: Task['id'] }> },
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

    const taskId = (await params).id;
    const task = await TaskModel.findById(taskId);

    if (!task) {
      return new Response(JSON.stringify({ message: 'Task not found' }), {
        status: STATUS_CODE.NOT_FOUND,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify(task), {
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: Task['id'] }> },
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

    const taskId = (await params).id;
    const task = await TaskModel.findById(taskId);

    if (!task) {
      return new Response(JSON.stringify({ message: 'Task not found' }), {
        status: STATUS_CODE.NOT_FOUND,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    await TaskModel.deleteOne({ _id: taskId });

    return new Response(
      JSON.stringify({ message: 'Task deleted successfully' }),
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
