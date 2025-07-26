"use client";
import { useEffect, useState } from "react";

interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
}

function RoleControl({ user, onRoleUpdate }: { user: User; onRoleUpdate: () => void }) {
  const [updating, setUpdating] = useState(false);
  
  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value;
    setUpdating(true);
    
    try {
      const response = await fetch("/api/admin/users/role", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id, newRole }),
      });
      
      if (response.ok) {
        onRoleUpdate(); // Refresh the user list
      } else {
        console.error("Failed to update role");
      }
    } catch (error) {
      console.error("Error updating role:", error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <select
      value={user.role}
      onChange={handleChange}
      disabled={updating}
      className="border px-2 py-1 rounded"
    >
      <option value="user">User</option>
      <option value="admin">Admin</option>
      <option value="moderator">Moderator</option>
    </select>
  );
}

export default function AdminUserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      setUsers(data.users);
      setError("");
    } catch {
      setError("Access denied or failed to load users.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <main className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-semibold mb-4">User Management</h1>
      {error && <p className="text-red-600">{error}</p>}
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 px-3">Email</th>
            <th className="text-left py-2 px-3">Name</th>
            <th className="text-left py-2 px-3">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-b">
              <td className="py-2 px-3">{user.email}</td>
              <td className="py-2 px-3">{user.name}</td>
              <td className="py-2 px-3">
                <RoleControl user={user} onRoleUpdate={fetchUsers} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
