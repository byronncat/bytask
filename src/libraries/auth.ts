import type { User } from 'schema';
import type { SessionPayload } from 'api';

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';

import { UserModel } from '@/database';
import { userService } from '@/services';
import { ACCOUNT_TYPE } from '@/constants/metadata';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    Credentials({
      credentials: {
        identity: {},
        password: {},
      },
      authorize: async (credentials) => {
        const {
          success,
          message,
          data: sessionPayload,
        } = await userService.login('credentials', {
          email: credentials.identity as string,
          password: credentials.password as string,
        });
        if (success && sessionPayload) return sessionPayload;
        throw new Error(message);
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile, user }) {
      if (account?.provider === 'google' && profile) {
        if (!profile.email_verified) return false;
        const { success, data: sessionPayload } = await userService.login(
          'google',
          {
            email: profile.email,
            username: profile.name,
          },
        );
        if (success && sessionPayload) {
          user.id = sessionPayload.id;
          return true;
        }
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
        token.type = existingUser.password
          ? ACCOUNT_TYPE.CREDENTIALS
          : existingUser.type;
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
