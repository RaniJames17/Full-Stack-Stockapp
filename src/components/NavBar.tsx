"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function NavBar() {
  const { data: session, status } = useSession();

  return (
    <header className="bg-white shadow p-4">
      <nav className="flex justify-between max-w-4xl mx-auto">
        <div className="flex gap-4">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          {session && <Link href="/dashboard">Dashboard</Link>}
        </div>
        <div className="flex items-center gap-4">
          {status === "loading" ? (
            <span>Loading...</span>
          ) : session ? (
            <>
              <span>{session.user?.email}</span>
              <button onClick={() => signOut()} className="text-blue-600 underline">
                Logout
              </button>
            </>
          ) : (
            <Link href="/login">Login</Link>
          )}
        </div>
      </nav>
    </header>
  );
}
