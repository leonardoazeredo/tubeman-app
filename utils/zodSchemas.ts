import { object, string } from "zod";

export const signInSchema = object({
  email: string({ required_error: "Email is required!" }).email({
    message: "Invalid email address",
  }),
  password: string({ required_error: "Password is required!" })
    .min(12, { message: "Password must be more than 12 characters" })
    .max(32, { message: "Password must be less than 32 characters" }),
});

export const signUpSchema = object({
  email: string({ required_error: "Email is required!" }).email(
    "Invalid email address"
  ),
  password: string({ required_error: "Password is required" })
    .min(12, "Password must be at least 12 characters long")
    .max(32, "Password must be at most 32 characters long"),
});
