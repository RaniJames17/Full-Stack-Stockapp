"use client";
import { useSession } from "next-auth/react";
import { AdminGuard, AdminNavigation, AdminActions, RoleBadge } from "@/components/AdminComponents";
import AdminPanel from "@/components/AdminPanel";

export default function ConditionalRenderingDemo() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Conditional Rendering Demo</h1>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Current Role:</span>
              <RoleBadge />
            </div>
          </div>

          {/* Session Info */}
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-8">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">Session Information</h2>
            <div className="text-blue-700 space-y-1">
              <p><strong>User:</strong> {session?.user?.name || "Not logged in"}</p>
              <p><strong>Email:</strong> {session?.user?.email || "N/A"}</p>
              <p><strong>Role:</strong> {session?.user?.role || "N/A"}</p>
              <p><strong>ID:</strong> {session?.user?.id || "N/A"}</p>
            </div>
          </div>

          {/* Original AdminPanel Component */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Basic AdminPanel Component</h2>
            <div className="bg-gray-50 p-4 rounded-lg border">
              <AdminPanel />
            </div>
          </div>

          {/* AdminGuard with children */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">2. AdminGuard with Protected Content</h2>
            <AdminGuard 
              fallback={
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <p className="text-red-600">⚠️ Admin access required to view this content</p>
                </div>
              }
            >
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="text-green-800 font-semibold">✅ Protected Admin Content</h3>
                <p className="text-green-600">This content is only visible to admin users!</p>
              </div>
            </AdminGuard>
          </div>

          {/* Conditional Navigation */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">3. Conditional Admin Navigation</h2>
            <AdminNavigation />
            {(!session || session.user.role !== "admin") && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-gray-600">Admin navigation is hidden for non-admin users</p>
              </div>
            )}
          </div>

          {/* Role-based Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">4. Role-based Action Buttons</h2>
            <AdminActions />
            {(!session || session.user.role !== "admin") && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-gray-600">Admin actions are hidden for non-admin users</p>
              </div>
            )}
          </div>

          {/* Inline Conditional Rendering */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">5. Inline Conditional Rendering</h2>
            <div className="space-y-4">
              {session?.user?.role === "admin" && (
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <p className="text-purple-700">🔑 This message only appears for admin users</p>
                </div>
              )}
              
              {session?.user?.role === "user" && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-blue-700">👤 This message only appears for regular users</p>
                </div>
              )}
              
              {!session && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-700">🚫 This message appears for unauthenticated users</p>
                </div>
              )}
            </div>
          </div>

          {/* Multiple Role Conditions */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">6. Multiple Role Conditions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <AdminGuard requiredRole="admin">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <p className="text-red-700 font-semibold">Admin Only</p>
                  <p className="text-red-600 text-sm">Super user privileges</p>
                </div>
              </AdminGuard>

              <AdminGuard 
                requiredRole="moderator"
                fallback={
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-600">Moderator access required</p>
                  </div>
                }
              >
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-blue-700 font-semibold">Moderator Only</p>
                  <p className="text-blue-600 text-sm">Content moderation</p>
                </div>
              </AdminGuard>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-green-700 font-semibold">All Users</p>
                <p className="text-green-600 text-sm">Public content</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
