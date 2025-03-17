import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import Navbar from "./ui/nav/navbar";

export const metadata: Metadata = {
  title: "TubeMan App",
  description: "Get notified by what matters to you!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <SessionProvider>
          {session?.user && <Navbar />}
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
