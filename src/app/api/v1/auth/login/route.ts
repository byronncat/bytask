import validator from '@/libraries/serverValidation';
import session from '@/libraries/session';
import { UserModel } from '@/database';
import { password as passwordHelper } from '@/helpers';
import { STATUS_CODE } from '@/constants/serverConfig';
import type { User } from 'schema';

export async function POST(request: Request) {
  try {
    const data = await request.json().catch(() => {
      throw 'Invalid request body!';
    });
    const result = validator.login(data);

    if (result.success) {
      const { identity, password } = data;
      const user = (await UserModel.findOne({
        $or: [{ email: identity }, { username: identity }],
      })) as User;

      if (!user)
        return new Response(JSON.stringify('User not found!'), {
          status: STATUS_CODE.NOT_FOUND,
          headers: {
            'Content-Type': 'application/json',
          },
        });

      if (!(await passwordHelper.compare(password, user.password)))
        return new Response(JSON.stringify('Incorrect password!'), {
          status: STATUS_CODE.UNAUTHORIZED,
          headers: {
            'Content-Type': 'application/json',
          },
        });

      await session.create(user.id);
      return new Response(JSON.stringify('Login successful!'), {
        status: STATUS_CODE.OK,
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
