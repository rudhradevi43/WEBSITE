import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const apiBaseUrl = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {}
      },
      async authorize(credentials) {
        const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password
          })
        });

        if (!response.ok) {
          return null;
        }

        const session = (await response.json()) as {
          accessToken: string;
          user: { id: string; email: string; name: string; role: string };
        };

        return { ...session.user, accessToken: session.accessToken };
      }
    })
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as typeof user & { accessToken: string }).accessToken;
        token.role = (user as typeof user & { role: string }).role;
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
