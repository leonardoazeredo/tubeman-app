"use client";

import { useActionState, useEffect, useState } from "react";
import { doSignIn } from "../../actions/user";
import { mapZodErrors, validateField } from "@/utils/utilities";
import { signInSchema } from "@/utils/zodSchemas";
import { ValidationError } from "@/types/shared";

import useDebounce from "@/utils/customHooks";
import { useRouter } from "next/navigation";
import { AuthInput } from "../shared/input";

export default function LoginForm() {
  const [signInResult, dispatchSignIn, pending] = useActionState(doSignIn, {
    success: false,
    errors: [],
  });

  const router = useRouter();

  const [formError, setFormError] = useState<ValidationError[] | undefined>(
    undefined
  );
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [passwordError, setPasswordError] = useState<string | undefined>(
    undefined
  );
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const debouncedValidate = useDebounce(
    (fieldName: "email" | "password", value: string) => {
      const schema = signInSchema;
      const error = validateField(schema, fieldName, value, {
        email,
        password,
      });
      if (fieldName === "email") {
        setEmailError(error);
      } else if (fieldName === "password") {
        setPasswordError(error);
      }
    },
    1000
  );

  const handleValidateField = (
    fieldName: "email" | "password",
    value: string
  ) => {
    debouncedValidate(fieldName, value);
  };

  const handleSubmit = async (formData: FormData) => {
    setFormError(undefined);

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
      setFormError(undefined);

      signInResult.errors.forEach((error) => {
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
    } else if (signInResult.success) {
      setFormError(undefined);
      setEmailError(undefined);
      setPasswordError(undefined);
      console.log("Sign-in successful!");
      router.push("/collections");
    }
  }, [signInResult, router]);

  return (
    <form className="mt-8 space-y-6" action={handleSubmit}>
      <input type="hidden" name="remember" value="true" />
      <div className="rounded-md shadow-sm -space-y-px">
        <AuthInput
          label="Email address"
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Enter your email address"
          required
          disabled={pending}
          errorMessage={emailError}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            handleValidateField("email", e.target.value);
          }}
          onBlur={() => debouncedValidate.flush()}
        />
        <AuthInput
          label="Password"
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter password"
          required
          disabled={pending}
          errorMessage={passwordError}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            handleValidateField("password", e.target.value);
          }}
          onBlur={() => debouncedValidate.flush()}
          className="mt-4"
        />
      </div>
      <div>
        <button
          type="submit"
          disabled={pending || !!emailError || !!passwordError}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Sign in
          {pending && <span className="ml-2">Loading...</span>}
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
