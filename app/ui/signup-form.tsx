"use client";

import { useState, useEffect, useActionState } from "react";
import { doSignUp } from "../actions/user";
import { mapZodErrors } from "@/utils/utilities";
import { signUpSchema } from "@/utils/zodSchemas";
import { ValidationError } from "@/types/shared";

export default function SignupForm() {
  const [signUpResult, dispatchSignUp, isPending] = useActionState(doSignUp, {
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
      const result = signUpSchema.safeParse({
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
      const result = signUpSchema.safeParse({ email: email, password: value }); // Validate password
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
    setEmailError(undefined);
    setPasswordError(undefined);

    const email = formData.get("email") || "";
    const password = formData.get("password") || "";

    const schemaValidation = signUpSchema.safeParse({ email, password });

    if (!schemaValidation.success) {
      const clientErrors = mapZodErrors(schemaValidation.error.errors);
      setFormError(clientErrors);
      return;
    }

    dispatchSignUp(formData);
  };

  useEffect(() => {
    if (!signUpResult.success && signUpResult.errors) {
      setFormError(undefined);
      signUpResult.errors.forEach((error) => {
        if (error.field === "email") {
          setEmailError(error.message);
        } else if (error.field === "password") {
          setPasswordError(error.message);
        } else {
          setFormError((prevErrors) =>
            prevErrors ? [...prevErrors, error] : [error]
          );
        }
      });
    } else if (signUpResult.success) {
      setFormError(undefined);
      setEmailError(undefined);
      setPasswordError(undefined);
      console.log("Signup successful!");
    }
  }, [signUpResult]);

  return (
    <form className="mt-8 space-y-6" action={handleSubmit}>
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
          id="email-address"
          name="email"
          type="email"
          autoComplete="email"
          required
          disabled={isPending}
          aria-invalid={!!emailError}
          aria-describedby="email-error"
          placeholder="Email address"
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
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          disabled={isPending}
          aria-invalid={!!passwordError}
          aria-describedby="password-error"
          className={`peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm text-black outline-2 placeholder:text-gray-500 ${
            passwordError
              ? "border-red-500 ring-red-500 focus:border-red-500 focus:ring-red-500"
              : ""
          }`}
          placeholder="Password"
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

      <div>
        <button
          type="submit"
          disabled={isPending || !!emailError || !!passwordError}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Sign up
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
