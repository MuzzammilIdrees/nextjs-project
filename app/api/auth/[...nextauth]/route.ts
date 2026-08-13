import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { neon } from "@neondatabase/serverless";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        // 1. Connect to Neon DB
        const sql = neon(process.env.DATABASE_URL!);

        // 2. Query for the user
        const users = await sql`
          SELECT * FROM users WHERE username = ${credentials.username}
        `;
        const user = users[0];

        if (!user) {
          return null;
        }

        // 3. Verify password
        if (user.password === credentials.password) {
          return {
            id: user.id.toString(),
            name: user.username,
            role: user.role,
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login", // This points to the page we are about to create
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };