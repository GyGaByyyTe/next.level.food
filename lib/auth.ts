import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import sql from 'better-sqlite3';

const db = sql('meals.db');

interface DbUser {
  id: number;
  email: string;
  name: string | null;
  is_admin: number;
  created_at: string;
  updated_at: string;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
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
    async jwt({ token, user, account }) {
      if (user && account) {
        token.id = user.id;

        // Get or create user in database and check admin status
        const email = user.email;
        if (email) {
          try {
            let dbUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as DbUser | undefined;

            if (!dbUser) {
              // Create new user
              db.prepare('INSERT INTO users (email, name) VALUES (?, ?)').run(email, user.name || null);
              dbUser = {
                id: 0, // Will be assigned by database
                email,
                name: user.name || null,
                is_admin: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              };
            } else {
              // Update user name if changed
              if (user.name && user.name !== dbUser.name) {
                db.prepare('UPDATE users SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE email = ?')
                  .run(user.name, email);
              }
            }

            token.isAdmin = Boolean(dbUser?.is_admin);
          } catch (error) {
            console.error('Error checking admin status:', error);
            token.isAdmin = false;
          }
        }
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
});

