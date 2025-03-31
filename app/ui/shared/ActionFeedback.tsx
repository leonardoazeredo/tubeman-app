"use client";
import React from "react";

export const ActionFeedback: React.FC<{
  message: string;
  type: "success" | "error";
}> = ({ message, type }) => {
  const color = type === "success" ? "text-green-500" : "text-red-500";
  return (
    <p className={`text-sm ${color} ml-2 font-medium italic inline`}>
      {message}
    </p>
  );
};
