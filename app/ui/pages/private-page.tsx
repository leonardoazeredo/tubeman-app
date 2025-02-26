import React from "react";
import { redirect } from "next/navigation";
import { PrivatePageChildProps } from "@/types/shared";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

const PrivatePage: React.FC<PrivatePageChildProps> = async ({
  pageTitle,
  children,
}) => {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <SessionProvider>
      <main className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-300">
              {pageTitle}
            </h2>
          </div>
          {children}
        </div>
      </main>
    </SessionProvider>
  );
};

export default PrivatePage;
