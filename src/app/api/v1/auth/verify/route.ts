import type { NextRequest } from 'next/server';
import type { SessionPayload } from 'api';

import { JWTPayload, jwtVerify } from 'jose';
import { UserModel } from '@/database';
import { ENCODED_KEY, STATUS_CODE } from '@/constants/serverConfig';

type Token = {
  payload: SessionPayload & JWTPayload;
};

export async function POST(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token');
    if (!token)
      return new Response(JSON.stringify('Token not found!'), {
        status: STATUS_CODE.BAD_REQUEST,
        headers: {
          'Content-Type': 'application/json',
        },
      });

    let payload: Token['payload'];
    try {
      const result = await jwtVerify(token, ENCODED_KEY);
      payload = result.payload as Token['payload'];
    } catch (error: any) {
      if (error.code === 'ERR_JWT_EXPIRED') {
        return new Response(JSON.stringify('Token expired!'), {
          status: STATUS_CODE.UNAUTHORIZED,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
      throw error;
    }

    const user = await UserModel.findById(payload.id);
    if (!user) {
      return new Response(JSON.stringify('User not found!'), {
        status: STATUS_CODE.NOT_FOUND,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    user.verified = true;
    await user.save();
    return new Response(JSON.stringify('User verified!'), {
      status: STATUS_CODE.OK,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('[Error]:', error);
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
