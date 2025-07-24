"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function NavBar() {
  const { data: session, status } = useSession();

  return (
    <header className="bg-white shadow-md border-b border-gray-200">
      <nav className="flex items-center justify-between max-w-6xl mx-auto px-4 py-3">
        {/* Logo/Brand */}
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold text-blue-600 mr-8">
            StockApp
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          <Link 
            href="/" 
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
          >
            Home
          </Link>
          <Link 
            href="/about" 
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
          >
            About
          </Link>
          {session && (
            <Link 
              href="/dashboard" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* User Section */}
        <div className="flex items-center gap-4">
          {status === "loading" ? (
            <span className="text-gray-500">Loading...</span>
          ) : session ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                {session.user?.email}
              </span>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link 
                href="/login" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
              >
                Login
              </Link>
              <Link 
                href="/register" 
                className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md font-medium transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
