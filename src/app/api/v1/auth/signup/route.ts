import validator from '@/libraries/serverValidation';
import session from '@/libraries/session';
import { UserModel } from '@/database';
import { password as passwordHelper } from '@/helpers';
import { STATUS_CODE } from '@/constants/server';

export async function POST(request: Request) {
  try {
    const data = await request.json().catch(() => {
      throw 'Invalid request body!';
    });
    const result = validator.signup(data);

    if (result.success) {
      const { username, email, password } = data;

      const existingUser = await UserModel.findOne({
        $or: [{ email }, { username }],
      });

      if (existingUser) {
        if (existingUser.email === email)
          return new Response(JSON.stringify('Email already exists!'), {
            status: STATUS_CODE.BAD_REQUEST,
            headers: {
              'Content-Type': 'application/json',
            },
          });

        if (existingUser.username === username)
          return new Response(JSON.stringify('Username already exists!'), {
            status: STATUS_CODE.BAD_REQUEST,
            headers: {
              'Content-Type': 'application/json',
            },
          });
      }

      const user = await UserModel.create({
        username,
        email,
        password: await passwordHelper.hash(password),
      });

      await session.create(user.id).catch(() => {
        console.error('[Signup]:', 'Failed to create session');
      });
      return new Response(JSON.stringify('User created successfully!'), {
        status: STATUS_CODE.CREATED,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else {
      return new Response(JSON.stringify(result.error.issues[0].message), {
        status: STATUS_CODE.BAD_REQUEST,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
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
