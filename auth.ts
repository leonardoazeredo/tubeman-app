import NextAuth, { CredentialsSignin, DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "@/utils/zodSchemas";
import { validatePassword, validateUser } from "@/utils/utilities";
import { DbUser } from "@/types/db";

export const routes = [
  // {
  //   name: "Dashboard",
  //   href: "/dashboard",
  // },
  {
    name: "Collections",
    href: "/collections",
  },
  {
    name: "Scraper",
    href: "/scraper",
  },
];

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      async authorize(credentials): Promise<DbUser | null> {
        const parsedCredentials = signInSchema.safeParse(credentials);

        if (!parsedCredentials.success) {
          const errors = parsedCredentials.error.flatten().fieldErrors;

          const errorArray = Object.entries(errors).flatMap(
            ([field, messages]) =>
              messages.map((message) => ({ field, message }))
          );

          throw new CredentialsSignin(
            JSON.stringify({ type: "validation", errors: errorArray })
          );
        }

        const { email, password } = parsedCredentials.data;
        const user = await validateUser(email);

        if (!user || !(await validatePassword(password, user.password))) {
          console.log("User failed to login");
          return null;
        }

        console.log("Authorize callback - user object before return:", user);
        console.log("User logedin with success");

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (trigger === "signIn" && user?.id) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user && token?.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnProtectedRoute = routes.some((link) =>
        nextUrl.pathname.startsWith(link.href)
      );

      if (!isLoggedIn && isOnProtectedRoute) {
        return false;
      }

      return true;
    },
  },
});
