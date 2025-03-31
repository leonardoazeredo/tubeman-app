"use client";

import { useState, useEffect, useActionState } from "react";
import { doSignUp } from "../../actions/user";
import { mapZodErrors, validateField } from "@/utils/utilities";
import { signUpSchema } from "@/utils/zodSchemas";
import { ValidationError } from "@/types/shared";

import useDebounce from "@/utils/customHooks";
import { AuthInput } from "../shared/input";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const [signUpResult, dispatchSignUp, pending] = useActionState(doSignUp, {
    success: false,
    errors: [],
  });
  const router = useRouter();

  const [formError, setFormError] = useState<ValidationError[] | undefined>(
    undefined
  );
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [userNameError, setUserNameError] = useState<string | undefined>(
    undefined
  );
  const [passwordError, setPasswordError] = useState<string | undefined>(
    undefined
  );
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [userName, setUserName] = useState<string>("");

  function resetErrorFields() {
    setFormError(undefined);
    setEmailError(undefined);
    setPasswordError(undefined);
    setUserNameError(undefined);
  }

  const debouncedValidate = useDebounce(
    (fieldName: "email" | "password" | "user-name", value: string) => {
      const schema = signUpSchema;
      const error = validateField(schema, fieldName, value, {
        email,
        password,
      });
      if (fieldName === "email") {
        setEmailError(error);
      }
      if (fieldName === "password") {
        setPasswordError(error);
      } else if (fieldName === "user-name") {
        setUserNameError(error);
      }
    },
    1000
  );

  const handleValidateField = (
    fieldName: "email" | "password" | "user-name",
    value: string
  ) => {
    resetErrorFields();
    debouncedValidate(fieldName, value);
  };

  const handleSubmit = async (formData: FormData) => {
    resetErrorFields();

    const schemaValidation = signUpSchema.safeParse({
      userName,
      email,
      password,
    });

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
        } else if (error.field === "user-name") {
          setUserNameError(error.message);
        } else {
          setFormError((prevErrors) =>
            prevErrors ? [...prevErrors, error] : [error]
          );
        }
      });
    } else if (signUpResult.success) {
      resetErrorFields();
      console.log("Signup successful!");
      router.push("/login");
    }
  }, [signUpResult, router]);

  return (
    <form className="mt-8 space-y-6" action={handleSubmit}>
      <AuthInput
        label="User name"
        id="user-name"
        name="user-name"
        type="text"
        autoComplete="username"
        placeholder="User Name"
        required
        disabled={pending}
        errorMessage={userNameError}
        value={userName}
        onChange={(e) => {
          setUserName(e.target.value);
          handleValidateField("user-name", e.target.value);
        }}
        onBlur={() => debouncedValidate.flush()}
      />

      <AuthInput
        label="Email address"
        id="email-address"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="Email address"
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
        placeholder="Password"
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

      <div>
        <button
          type="submit"
          disabled={pending || !!emailError || !!passwordError}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Sign up
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
