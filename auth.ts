import NextAuth, { CredentialsSignin } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { signInSchema } from "@/utils/zodSchemas";
import { validatePassword, validateUser } from "@/utils/utilities";
import { DbUser } from "@/types/db";
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
        async authorize(credentials):Promise<DbUser | null> {

          const parsedCredentials = signInSchema.safeParse(credentials);
  
          if (!parsedCredentials.success) {
            //  This returns an object with `formErrors` and `fieldErrors`.
            //  We'll use `fieldErrors` for field-specific errors.
            const errors = parsedCredentials.error.flatten().fieldErrors;
            // Convert fieldErrors to an array of objects
            const errorArray = Object.entries(errors).flatMap(([field, messages]) =>
                  messages.map(message => ({ field, message }))
            );
  
              throw new CredentialsSignin(
                JSON.stringify({ type: "validation", errors: errorArray })
              );
          }
  
          const { email, password } = parsedCredentials.data;
          const user: DbUser | null = await validateUser(email);
  
          if (!user || !(await validatePassword(password, user.password))) {

            return null;
          }

  
          return user;
        },
      }),
  ],
})