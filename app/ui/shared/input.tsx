"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  errorMessage?: string;
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  errorMessage,
  className,
  ...props
}) => {
  const inputClassName = `peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm text-black outline-2 placeholder:text-gray-500 ${
    errorMessage
      ? "border-red-500 ring-red-500 focus:border-red-500 focus:ring-red-500"
      : ""
  } ${className || ""}`;

  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        className={inputClassName}
        aria-invalid={!!errorMessage}
        aria-describedby={`${id}-error`}
        {...props}
      />
      {errorMessage && (
        <p
          className="mt-1 text-red-500 text-sm"
          id={`${id}-error`}
          role="alert"
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default Input;
