import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { api } from "./lib/api";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const session = await api.login(String(credentials.email), String(credentials.password));
        return {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          role: session.user.role,
          accessToken: session.accessToken
        };
      }
    })
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as { accessToken?: string }).accessToken;
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.user.role = token.role as string;
      return session;
    }
  },
  pages: {
    signIn: "/login"
  }
});
