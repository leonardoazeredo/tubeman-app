import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";

interface AuthPageProps {
  title: string;
  children: React.ReactNode;
}

const AuthPage = async ({ title, children }: AuthPageProps) => {
  const session = await auth();
  if (session?.user) {
    redirect("/collections");
  }
  return (
    <main className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-300">
            {title}
          </h2>
        </div>
        {children}
      </div>
    </main>
  );
};

export default AuthPage;
