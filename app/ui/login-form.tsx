"use client";

import { useActionState, useEffect, useState } from "react";
import { doSignIn } from "../actions/user";
import { mapZodErrors } from "@/utils/utilities";
import { signInSchema } from "@/utils/zodSchemas";
import { ValidationError } from "@/types/shared";

export default function LoginForm() {
  const [signInResult, dispatchSignIn, isPending] = useActionState(doSignIn, {
    success: false,
    errors: [],
  });

  const [formError, setFormError] = useState<ValidationError[] | undefined>(
    undefined
  );
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [passwordError, setPasswordError] = useState<string | undefined>(
    undefined
  );
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const validateField = (fieldName: string, value: string) => {
    if (fieldName === "email") {
      const result = signInSchema.safeParse({
        email: value,
        password: password,
      });
      if (!result.success) {
        const error = result.error.formErrors.fieldErrors.email?.[0];
        setEmailError(error);
      } else {
        setEmailError(undefined);
      }
    } else if (fieldName === "password") {
      const result = signInSchema.safeParse({ email: email, password: value });
      if (!result.success) {
        const error = result.error.formErrors.fieldErrors.password?.[0];
        setPasswordError(error);
      } else {
        setPasswordError(undefined);
      }
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setFormError(undefined);

    const email = formData.get("email") || "";
    const password = formData.get("password") || "";

    const schemaValidation = signInSchema.safeParse({ email, password });

    if (!schemaValidation.success) {
      const clientErrors = mapZodErrors(schemaValidation.error.errors);
      setFormError(clientErrors);
      return;
    }

    dispatchSignIn(formData);
  };

  useEffect(() => {
    if (!signInResult.success && signInResult.errors) {
      // Clear general form error first, as we might have field-specific errors now
      setFormError(undefined);

      signInResult.errors.forEach((error) => {
        if (error.field === "email") {
          setEmailError(error.message); // Set email-specific error
        } else if (error.field === "password") {
          setPasswordError(error.message); // Set password-specific error
        } else {
          // For general errors (like "Invalid credentials"), set formError to display them generally
          setFormError((prevErrors) =>
            prevErrors ? [...prevErrors, error] : [error]
          ); // Append to existing or create new array
        }
      });
    } else if (signInResult.success) {
      // Clear all errors on successful sign-in
      setFormError(undefined);
      setEmailError(undefined);
      setPasswordError(undefined);
      // Optionally, redirect user on successful sign-in here
      console.log("Sign-in successful!"); // Placeholder for redirection/navigation
    }
  }, [signInResult]); // Effect dependency on signInResult

  return (

        <form className="mt-8 space-y-6" action={handleSubmit}>
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                className={`peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm text-black outline-2 placeholder:text-gray-500 ${
                  emailError
                    ? "border-red-500 ring-red-500 focus:border-red-500 focus:ring-red-500"
                    : ""
                }`}
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
                autoComplete="email"
                disabled={isPending}
                aria-invalid={!!emailError}
                aria-describedby="email-error"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateField("email", e.target.value);
                }}
                onBlur={(e) => validateField("email", e.target.value)}
              />
              {emailError && (
                <p
                  className="mt-1 text-red-500 text-sm"
                  id="email-error"
                  role="alert"
                >
                  {emailError}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                autoComplete="current-password"
                disabled={isPending}
                className={`peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm text-black outline-2 placeholder:text-gray-500 ${
                  passwordError
                    ? "border-red-500 ring-red-500 focus:border-red-500 focus:ring-red-500"
                    : ""
                }`}
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
                aria-invalid={!!passwordError}
                aria-describedby="password-error"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validateField("password", e.target.value);
                }}
                onBlur={(e) => validateField("password", e.target.value)}
              />
              {passwordError && (
                <p
                  className="mt-1 text-red-500 text-sm"
                  id="password-error"
                  role="alert"
                >
                  {passwordError}
                </p>
              )}
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={isPending || !!emailError || !!passwordError}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
              {isPending && <span className="ml-2">Loading...</span>}
            </button>
          </div>
          {formError && (
            <div className="mt-4 text-red-500">
              {formError.map((error, index) => (
                <p key={index} className="text-sm">
                  {error.message}
                </p>
              ))}
            </div>
          )}
        </form>
  );
}
