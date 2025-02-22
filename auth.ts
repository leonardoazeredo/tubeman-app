import NextAuth, { CredentialsSignin } from "next-auth";
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

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      async authorize(credentials): Promise<DbUser | null> {
        const parsedCredentials = signInSchema.safeParse(credentials);

        if (!parsedCredentials.success) {
          //  This returns an object with `formErrors` and `fieldErrors`.
          //  We'll use `fieldErrors` for field-specific errors.
          const errors = parsedCredentials.error.flatten().fieldErrors;
          // Convert fieldErrors to an array of objects
          const errorArray = Object.entries(errors).flatMap(
            ([field, messages]) =>
              messages.map((message) => ({ field, message }))
          );

          throw new CredentialsSignin(
            JSON.stringify({ type: "validation", errors: errorArray })
          );
        }

        const { email, password } = parsedCredentials.data;
        const user: DbUser | null = await validateUser(email);

        if (!user || !(await validatePassword(password, user.password))) {
          console.log("User failed to login");
          return null;
        }

        console.log("User logedin with success");
        return user;
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnProtectedRoute = routes.some((link) =>
        nextUrl.pathname.startsWith(link.href)
      );
      // If the user is not logged in and on a protected route, deny access
      if (!isLoggedIn && isOnProtectedRoute) {
        return false;
      }
      // Otherwise, allow access
      return true;
    },
  },
});
