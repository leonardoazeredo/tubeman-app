"use client";

import Link from "next/link";
import { signOut } from "@/auth"; // Import the signOut function
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

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
          action={async () => {
            await signOut();
          }}
        >
          <button
            type="submit"
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Sign Out
          </button>
        </form>
      </div>
    </nav>
  );
}
