import type { NextRequest } from 'next/server';
import type { FilterQuery } from 'mongoose';
import type { Task } from 'schema';

import { authAction_v2 } from '@/api';
import { TaskModel } from '@/database';
import { SORT_BY, SORT_ORDER } from '@/constants/metadata';
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

    const data = (await request.json()) as Pick<
      Task,
      'title' | 'status' | 'start_date' | 'due_date' | 'description' | 'cover'
    >;

    if (!data.title) {
      return new Response(JSON.stringify('Title is required'), {
        status: STATUS_CODE.BAD_REQUEST,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const taskData: Partial<Task> = {
      title: data.title,
      uid: sessionPayload.user.id,
    };
    if (data.status) taskData.status = data.status;
    if (data.start_date) taskData.start_date = data.start_date;
    if (data.due_date) taskData.due_date = data.due_date;
    if (data.description) taskData.description = data.description;
    if (data.cover) taskData.cover = data.cover;

    const task = await TaskModel.create(taskData);
    return new Response(JSON.stringify(task), {
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

export async function PUT(request: NextRequest) {
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

    const data = (await request.json()) as Pick<
      Task,
      | 'id'
      | 'title'
      | 'status'
      | 'start_date'
      | 'due_date'
      | 'description'
      | 'cover'
    >;

    if (!data.id || !data.title) {
      return new Response(JSON.stringify('ID and Title are required'), {
        status: STATUS_CODE.BAD_REQUEST,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const task = await TaskModel.findById(data.id);
    if (!task) {
      return new Response(JSON.stringify('Task not found'), {
        status: STATUS_CODE.NOT_FOUND,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    task.title = data.title;
    task.status = data.status;
    task.start_date = data.start_date;
    task.due_date = data.due_date;
    task.description = data.description;
    task.cover = data.cover;
    task.recently_updated = new Date();

    await task.save();
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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sortBy = searchParams.get('sortBy');
    const sortOrder = searchParams.get('sortOrder');
    const filterBy = searchParams.get('filterBy');
    const filterValue = searchParams.get('filterValue');
    const search = searchParams.get('search');

    const sessionPayload = await authAction_v2.authenticate();
    if (!sessionPayload) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: STATUS_CODE.UNAUTHORIZED,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const sortQuery: Partial<Record<keyof Task, 1 | -1>> = {};

    switch (sortBy) {
      case SORT_BY.TITLE:
        sortQuery.title = sortOrder === SORT_ORDER.ASC ? 1 : -1;
      case SORT_BY.STATUS:
        sortQuery.status = sortOrder === SORT_ORDER.ASC ? 1 : -1;
        break;
      case SORT_BY.START_DATE:
        sortQuery.start_date = sortOrder === SORT_ORDER.ASC ? 1 : -1;
        break;
      case SORT_BY.DUE_DATE:
        sortQuery.due_date = sortOrder === SORT_ORDER.ASC ? 1 : -1;
        break;
      case SORT_BY.RECENTLY_UPDATED:
        sortQuery.recently_updated = sortOrder === SORT_ORDER.ASC ? 1 : -1;
        break;
    }

    const filterQuery: Partial<Record<keyof Task, FilterQuery<Task>>> = {};
    if (filterBy && filterValue) {
      const statusValues = filterValue
        .split(',')
        .map(Number)
        .filter((num) => !isNaN(num));
      if (statusValues.length > 0) {
        filterQuery.status = { $in: statusValues };
      }
      if (filterValue.includes('overdue')) {
        filterQuery.due_date = { $lt: new Date() };
      }
    }

    const tasks = await TaskModel.find({
      uid: sessionPayload.user.id,
      title: { $regex: search || '', $options: 'i' },
      ...filterQuery,
    }).sort(sortQuery);

    return new Response(JSON.stringify(tasks), {
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
