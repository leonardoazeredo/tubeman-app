"use client";

import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import React, { createContext, useContext, ReactNode } from "react";

// 1. Define the Context Type
interface SessionContextType {
  session: Session | null; // Session object can be null if not authenticated
  status: "authenticated" | "loading" | "unauthenticated"; // Status from useSession
}

// 2. Create the Context with a default value (can be null or initial state)
const SessionContext = createContext<SessionContextType>({
  session: null,
  status: "loading", // Initial status is loading
} as SessionContextType); // Explicit type assertion for default value

interface SessionProviderProps {
  children: ReactNode;
}

// 3. Create a SessionProvider Component
export const SessionContextProvider = ({ children }: SessionProviderProps) => {
  const sessionHook = useSession(); // Use useSession hook to get session data

  const sessionValue: SessionContextType = {
    session: sessionHook.data, // Session data from useSession
    status: sessionHook.status, // Session status from useSession
  };

  return (
    <SessionContext.Provider value={sessionValue}>
      {children}
    </SessionContext.Provider>
  );
};

// 4. Create a custom hook to consume the context
export const useSessionContext = (): SessionContextType => {
  return useContext(SessionContext);
};
