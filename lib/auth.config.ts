import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';

// Базовая конфигурация NextAuth без зависимостей от БД
// Используется в middleware (Edge Runtime)
export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        // Add admin status to session
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).isAdmin = token.isAdmin as boolean || false;
      }
      return session;
    },
  },
};

