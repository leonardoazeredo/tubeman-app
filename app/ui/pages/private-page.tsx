import { SessionProvider } from "next-auth/react";
import React from "react";

interface PrivatePageProps {
  pageTitle: string;
  children: React.ReactNode;
}

const PrivatePage: React.FC<PrivatePageProps> = ({ pageTitle, children }) => {
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
