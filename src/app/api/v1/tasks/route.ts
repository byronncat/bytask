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

    const data = (await request.json()) as Task;

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
    if (data.priority) taskData.priority = data.priority;
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

    const data = (await request.json()) as Task;
    if (!data.id) {
      return new Response(JSON.stringify('ID is required'), {
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
    task.priority = data.priority;
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
        break;
      case SORT_BY.PRIORITY:
        sortQuery.priority = sortOrder === SORT_ORDER.ASC ? 1 : -1;
        break;
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

    let tasks = await TaskModel.find({
      uid: sessionPayload.user.id,
      title: { $regex: search || '', $options: 'i' },
      ...filterQuery,
    }).sort(sortQuery);

    if (sortBy === SORT_BY.DUE_DATE || sortBy === SORT_BY.START_DATE) {
      const dateField = sortBy === SORT_BY.DUE_DATE ? 'due_date' : 'start_date';

      tasks = tasks.sort((a, b) => {
        const dateA = a[dateField];
        const dateB = b[dateField];
        if (!dateA && !dateB) return 0;

        if (!dateA) return 1;
        if (!dateB) return -1;

        if (sortOrder === SORT_ORDER.ASC) {
          return dateA.getTime() - dateB.getTime();
        } else {
          return dateB.getTime() - dateA.getTime();
        }
      });
    }

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
