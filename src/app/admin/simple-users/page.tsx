"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
}

function RoleControl({ user, onRoleUpdate, currentUserId, onSuccess }: { 
  user: User; 
  onRoleUpdate: () => void; 
  currentUserId?: string;
  onSuccess: (message: string) => void;
}) {
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  
  // Check if this is the current user trying to modify themselves
  const isCurrentUser = user._id === currentUserId;
  const isAdminUser = user.role === "admin";
  const isCurrentAdmin = isCurrentUser && isAdminUser;
  
  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value;
    
    // Client-side prevention with immediate feedback
    if (isCurrentAdmin && newRole !== "admin") {
      setError("You cannot demote yourself");
      e.target.value = user.role; // Reset dropdown
      return;
    }
    
    // Confirmation for demoting admin to user
    if (user.role === "admin" && newRole === "user") {
      if (!confirm(`Are you sure you want to demote "${user.email}" from Admin to User? This will remove all administrative privileges.`)) {
        e.target.value = user.role; // Reset dropdown if cancelled
        return;
      }
    }
    
    setUpdating(true);
    setError("");
    
    try {
      const response = await fetch("/api/admin/users/role", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id, newRole }),
      });
      
      if (response.ok) {
        onSuccess(`Role updated to ${newRole} successfully!`);
        onRoleUpdate(); // Refresh the user list
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to update role");
        // Reset the select to original value
        e.target.value = user.role;
      }
    } catch (error) {
      console.error("Error updating role:", error);
      setError("Network error occurred");
      // Reset the select to original value
      e.target.value = user.role;
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    // Double confirmation for delete action
    if (!confirm(`Are you sure you want to delete user "${user.email}"? This action cannot be undone.`)) {
      return;
    }

    // Additional confirmation for admin deletion
    if (user.role === "admin" && !confirm("This is an ADMIN user. Are you absolutely sure?")) {
      return;
    }

    setDeleting(true);
    setError("");

    try {
      const response = await fetch("/api/admin/users/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id }),
      });

      if (response.ok) {
        onSuccess(`User "${user.email}" deleted successfully!`);
        onRoleUpdate(); // Refresh the user list
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Network error occurred");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <select
          value={user.role}
          onChange={handleChange}
          disabled={updating || deleting}
          className={`border border-gray-300 px-3 py-2 rounded-md flex-1 text-gray-900 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            isCurrentAdmin ? 'bg-gray-100 border-gray-400 text-gray-700' : ''
          } ${updating ? 'opacity-50' : ''}`}
          title={isCurrentAdmin ? "You cannot change your own admin role" : ""}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        
        {/* Delete Button - hidden for current user */}
        {!isCurrentUser && (
          <button
            onClick={handleDelete}
            disabled={updating || deleting}
            className={`px-3 py-2 text-sm rounded-md font-medium transition-colors ${
              deleting 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300' 
                : 'bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-800 border border-red-200 hover:border-red-300'
            }`}
            title="Delete user"
          >
            {deleting ? 'Deleting...' : '🗑️ Delete'}
          </button>
        )}
      </div>
      
      {/* Client-side UI hints */}
      {isCurrentAdmin && (
        <span className="text-xs text-gray-600">
          You cannot demote yourself
        </span>
      )}
      
      {isCurrentUser && (
        <span className="text-xs text-blue-600">
          You cannot delete your own account
        </span>
      )}
      
      {/* Server-side error display */}
      {error && !isCurrentAdmin && (
        <span className="text-red-500 text-xs">{error}</span>
      )}
      
      {/* Show self-demotion error with different styling */}
      {error && isCurrentAdmin && (
        <span className="text-orange-500 text-xs">{error}</span>
      )}
    </div>
  );
}

export default function AdminUserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const { data: session, status } = useSession();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP ${res.status}: Failed to fetch users`);
      }
      
      const data = await res.json();
      setUsers(data.users || []);
      setError("");
    } catch (err) {
      console.error("Fetch error:", err);
      setError(`Failed to load users: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = (message: string) => {
    setSuccessMessage(message);
    // Clear success message after 3 seconds
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  useEffect(() => {
    // Only fetch users when session is loaded and user is admin
    if (status === "loading") return;
    
    if (!session || session.user?.role !== "admin") {
      setError("Access denied. Admin privileges required.");
      setLoading(false);
      return;
    }
    
    fetchUsers();
  }, [session, status]);

  return (
    <main className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-700 mt-1">Manage user roles and delete user accounts</p>
        </div>
        <div className="text-sm text-gray-800 font-medium">
          {users.filter(u => u.role === 'admin').length} Admin(s) • {users.length} Total Users
        </div>
      </div>
      
      {/* Loading State */}
      {status === "loading" && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-800">Loading session...</span>
        </div>
      )}
      
      {/* Loading Users */}
      {loading && status !== "loading" && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-800">Loading users...</span>
        </div>
      )}
      
      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">
          {error}
        </div>
      )}
      
      {/* Success Display */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-700">
          {successMessage}
        </div>
      )}
      
      {/* Users Table */}
      {!loading && !error && users.length > 0 && (
        <>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-3 font-semibold text-gray-900">Email</th>
                <th className="text-left py-3 px-3 font-semibold text-gray-900">Name</th>
                <th className="text-left py-3 px-3 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const isCurrentUser = user._id === session?.user?.id;
                
                return (
                  <tr 
                    key={user._id} 
                    className={`border-b hover:bg-gray-50 ${isCurrentUser ? 'bg-blue-50' : ''}`}
                  >
                    <td className="py-3 px-3 text-gray-900">
                      {user.email}
                      {isCurrentUser && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">
                          You
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-gray-900">{user.name}</td>
                    <td className="py-3 px-3">
                      <RoleControl 
                        user={user} 
                        onRoleUpdate={fetchUsers}
                        currentUserId={session?.user?.id}
                        onSuccess={handleSuccess}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {users.filter(u => u.role === 'admin').length === 1 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
              <strong>⚠️ Warning:</strong> Only one admin remains in the system. 
              The last admin cannot be demoted to prevent system lockout.
            </div>
          )}
        </>
      )}
      
      {/* No Users Message */}
      {!loading && !error && users.length === 0 && (
        <div className="text-center py-8 text-gray-700">
          No users found in the system.
        </div>
      )}
    </main>
  );
}
