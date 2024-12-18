import { MissionModel } from '@/database';
import { getUser } from '@/helpers';
import { STATUS_CODE } from '@/constants/server';
import type { NextRequest } from 'next/server';
import { SORT_BY } from '@/constants/convention';
import { IMission } from 'schema';

export async function POST() {
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

    await MissionModel.create({
      title: 'Default mission',
      user_id: user.id,
    });

    return new Response(
      JSON.stringify({ message: 'Mission created successfully' }),
      {
        status: STATUS_CODE.CREATED,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sortBy = searchParams.get('sortBy');
    const sortOrder = searchParams.get('sortOrder');

    const user = await getUser();
    if (!user) {
      return new Response(JSON.stringify('User not logged in!'), {
        status: STATUS_CODE.FORBIDDEN,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const sortQuery: Partial<Record<keyof IMission, 1 | -1>> = {};
    if (sortBy === SORT_BY.TITLE)
      sortQuery.title = sortOrder === 'asc' ? 1 : -1;
    if (sortBy === SORT_BY.ACTIVED_AT)
      sortQuery.actived_at = sortOrder === 'asc' ? 1 : -1;

    const missions = await MissionModel.find({ user_id: user.id }).sort(
      sortQuery,
    );
    return new Response(JSON.stringify(missions), {
      status: STATUS_CODE.OK,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('[Error]:', error);
    const errorMessage =
      typeof error === 'string' ? error : 'Internal server error';
    return new Response(errorMessage, {
      status: STATUS_CODE.INTERNAL_SERVER_ERROR,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}