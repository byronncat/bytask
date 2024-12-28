import type { User } from 'schema';
import type { SessionPayload } from 'api';
import type { LoginFormData } from '@/constants/form';

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { SignJWT } from 'jose';

import { sendEmail } from './nodemailer';
import { UserModel } from '@/database';
import validator from '@/libraries/zod';
import { password as passwordHelper, createVerifyEmail } from '@/helpers';
import { ENCODED_KEY, SERVER_API } from '@/constants/serverConfig';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    Credentials({
      credentials: {
        identity: {},
        password: {},
      },
      authorize: async (credentials) => {
        const result = validator.login(credentials);
        if (result.success) {
          const user = (await UserModel.findOne({
            email: credentials.identity,
            password: { $exists: true },
          })) as User;

          if (!user) {
            throw new Error('User not found.');
          }

          if (!user.verified) {
            const token = await new SignJWT({
              name: user.username,
              email: user.email,
              id: user.id,
            } as SessionPayload)
              .setProtectedHeader({ alg: 'HS256' })
              .setExpirationTime('30m')
              .sign(ENCODED_KEY);

            await sendEmail({
              to: user.email,
              subject: 'Verify your email',
              text: `Click the link to verify your email`,
              html: createVerifyEmail({
                username: user.username,
                verificationLink: `${SERVER_API}/v1/auth/verify?token=${token}`,
              }),
            });
            throw new Error('User not verified. Please check your email.');
          }

          if (
            !(await passwordHelper.compare(
              (credentials as LoginFormData).password,
              user.password,
            ))
          ) {
            throw new Error('Incorrect password.');
          }

          return {
            id: user.id,
            name: user.username,
            email: user.email,
            type: 'credentials',
          } as SessionPayload;
        } else {
          throw new Error(result.error.issues[0].message);
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile, user }) {
      if (account?.provider === 'google' && profile) {
        if (!profile.email_verified) return false;
        const existingUser = await UserModel.findOne({ email: profile.email });
        if (!existingUser) {
          await UserModel.create({
            email: profile.email,
            username: profile.name,
            verified: true,
          });
        } else {
          user.id = existingUser.id;
        }
        return true;
      }
      if (account?.provider === 'credentials') {
        return true;
      }
      return false;
    },
    async jwt({ token, user, account }) {
      if (!account) {
        const existingUser = (await UserModel.findOne({
          email: token.email,
        })) as User;
        if (!existingUser) return token;
        token.name = existingUser.username;
        token.email = existingUser.email;
        if (existingUser.password) token.type = 'credentials';
        else token.type = 'google';
      }
      if (user) {
        token.id = (user as SessionPayload).id;
        token.type = (user as SessionPayload).type;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as SessionPayload['id'];
      (session.user as any).type = token.type as SessionPayload['type'];
      return session;
    },
  },
});
