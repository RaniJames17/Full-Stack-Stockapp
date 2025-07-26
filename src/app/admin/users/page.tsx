"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";

interface User {
  email: string;
  name: string;
  role: string;
  createdAt: string;
  oauthProvider?: string;
}

interface UserStats {
  _id: string;
  count: number;
}

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      const data = await response.json();
      
      if (response.ok) {
        const userList = data.users || [];
        setUsers(userList);
        setTotal(userList.length);
        
        // Calculate stats from user list
        const roleStats = userList.reduce((acc: { [key: string]: number }, user: User) => {
          const role = user.role || "user";
          acc[role] = (acc[role] || 0) + 1;
          return acc;
        }, {});
        
        const statsArray = Object.entries(roleStats).map(([role, count]) => ({
          _id: role,
          count: count as number
        }));
        
        setStats(statsArray);
      } else {
        setError(data.error || "Failed to fetch users");
      }
    } catch {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-red-100 text-red-800 border-red-200";
      case "moderator": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-green-100 text-green-800 border-green-200";
    }
  };

  const getStatCount = (role: string) => {
    const stat = stats.find(s => s._id === role);
    return stat ? stat.count : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading users...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <div className="flex gap-3">
              <Link 
                href="/admin/roles" 
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Manage Roles
              </Link>
              <Link 
                href="/admin" 
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
              >
                Back to Admin
              </Link>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-6">
              <p className="text-red-700">❌ {error}</p>
            </div>
          )}

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Users</h3>
              <p className="text-3xl font-bold text-gray-900">{total}</p>
            </div>
            <div className="bg-red-50 p-6 rounded-lg border border-red-200">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Admins</h3>
              <p className="text-3xl font-bold text-red-900">{getStatCount("admin")}</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Moderators</h3>
              <p className="text-3xl font-bold text-blue-900">{getStatCount("moderator")}</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Users</h3>
              <p className="text-3xl font-bold text-green-900">{getStatCount("user")}</p>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800">All Users ({total})</h3>
            </div>
            
            {users.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Auth Method
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.name || "No name"}
                            </div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                            {user.role || "user"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.oauthProvider ? (
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                              </svg>
                              {user.oauthProvider}
                            </span>
                          ) : (
                            <span className="text-gray-400">Credentials</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No users found</p>
              </div>
            )}
          </div>

          {/* MongoDB Promotion Commands */}
          <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Quick Promotion Commands</h3>
            <p className="text-blue-700 mb-4">Copy and run these MongoDB commands to promote users:</p>
            
            <div className="space-y-3">
              {users.filter(u => u.role !== "admin").slice(0, 3).map((user, index) => (
                <div key={index} className="bg-white p-3 rounded border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="font-medium">{user.name}</span> ({user.email})
                    </div>
                    <code className="text-xs bg-gray-100 p-2 rounded text-gray-800 flex-1 ml-4">
                      db.users.updateOne({`{ email: "${user.email}" }, { $set: { role: "admin" } }`});
                    </code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
