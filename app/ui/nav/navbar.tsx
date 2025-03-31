"use client";

import { useTransition } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { doSignOut } from "@/app/actions/user";

export default function Navbar() {
  const pathname = usePathname();

  const [isPending, startTransition] = useTransition();

  if (pathname === "/") {
    return null;
  }
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          <Link href="/collections" className="text-white hover:text-gray-300">
            My Collections
          </Link>
          <Link
            href="/collections/new"
            className="text-white hover:text-gray-300"
          >
            Create New
          </Link>
        </div>
        <form
          action={() => {
            startTransition(async () => {
              await doSignOut();
            });
          }}
        >
          <button
            type="submit"
            disabled={isPending}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-70"
          >
            {isPending ? "Signing Out..." : "Sign Out"}
          </button>
        </form>
      </div>
    </nav>
  );
}
