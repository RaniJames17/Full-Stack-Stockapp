"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function RoleManagementPage() {
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [newRole, setNewRole] = useState("user");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/update-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newRole }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ ${data.message}`);
        setEmail("");
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch {
      setMessage("❌ Failed to update role");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Role Management</h1>

          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-8">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Current Session Info</h3>
            <p className="text-blue-700">
              <strong>Email:</strong> {session?.user?.email}<br/>
              <strong>Role:</strong> {session?.user?.role || "Not set"}<br/>
              <strong>ID:</strong> {session?.user?.id}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Update User Role</h2>
            
            <form onSubmit={handleUpdateRole} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  User Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter user email"
                  required
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                  New Role
                </label>
                <select
                  id="role"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="moderator">Moderator</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? "Updating..." : "Update Role"}
              </button>
            </form>

            {message && (
              <div className="mt-4 p-4 rounded-md bg-gray-50 border">
                <p className="text-sm">{message}</p>
              </div>
            )}
          </div>

          <div className="mt-8 bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">Testing Instructions</h3>
            <ol className="text-yellow-700 space-y-2 text-sm">
              <li>1. Use this form to update your own email to &quot;admin&quot; role</li>
              <li>2. Sign out and sign back in to get new session with admin role</li>
              <li>3. Try accessing /admin routes - should work with admin role</li>
              <li>4. Change role back to &quot;user&quot; and test middleware blocking</li>
            </ol>
          </div>

          <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Direct MongoDB Commands</h3>
            <p className="text-blue-700 mb-4">For system administrators with database access:</p>
            
            <div className="space-y-4">
              <div className="bg-white p-4 rounded border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">Promote user to admin:</h4>
                <code className="text-sm bg-gray-100 p-2 rounded block text-gray-800">
                  db.users.updateOne({`{ email: "admin@example.com" }, { $set: { role: "admin" } }`});
                </code>
              </div>
              
              <div className="bg-white p-4 rounded border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">Check all user roles:</h4>
                <code className="text-sm bg-gray-100 p-2 rounded block text-gray-800">
                  db.users.find({`{}, { email: 1, role: 1, name: 1 }`});
                </code>
              </div>
              
              <div className="bg-white p-4 rounded border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">Find all admin users:</h4>
                <code className="text-sm bg-gray-100 p-2 rounded block text-gray-800">
                  db.users.find({`{ role: "admin" }, { email: 1, name: 1 }`});
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
