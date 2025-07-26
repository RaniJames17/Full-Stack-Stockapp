"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Still loading

    if (!session) {
      router.push("/login");
      return;
    }

    if (session.user.role !== "admin") {
      router.push("/dashboard"); // Redirect non-admin users
      return;
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session || session.user.role !== "admin") {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="text-sm text-gray-600">
              Welcome, {session.user.name} ({session.user.role})
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Link href="/admin/users" className="bg-red-50 p-6 rounded-lg border border-red-200 hover:bg-red-100 transition-colors block">
              <h3 className="text-lg font-semibold text-red-800 mb-2">User Management</h3>
              <p className="text-red-600">Comprehensive user management with statistics</p>
              <div className="mt-4">
                <span className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors inline-block">
                  Advanced View
                </span>
              </div>
            </Link>

            <Link href="/admin/simple-users" className="bg-blue-50 p-6 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors block">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Simple User List</h3>
              <p className="text-blue-600">Basic user table view</p>
              <div className="mt-4">
                <span className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors inline-block">
                  Simple View
                </span>
              </div>
            </Link>

            <Link href="/admin/roles" className="bg-green-50 p-6 rounded-lg border border-green-200 hover:bg-green-100 transition-colors block">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Role Management</h3>
              <p className="text-green-600">Update user roles and permissions</p>
              <div className="mt-4">
                <span className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors inline-block">
                  Manage Roles
                </span>
              </div>
            </Link>
          </div>

          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">⚠️ Admin Access Only</h3>
            <p className="text-yellow-700">
              This page is protected by role-based middleware. Only users with the &quot;admin&quot; role can access this content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
