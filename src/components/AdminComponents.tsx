"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface AdminGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requiredRole?: string;
}

// Reusable Admin Guard Component
export function AdminGuard({ children, fallback, requiredRole = "admin" }: AdminGuardProps) {
  const { data: session } = useSession();

  if (!session || session.user.role !== requiredRole) {
    return fallback ? <>{fallback}</> : <p className="text-red-600">Access Denied</p>;
  }

  return <>{children}</>;
}

// Admin-only Navigation Component
export function AdminNavigation() {
  const { data: session } = useSession();

  if (!session || session.user.role !== "admin") {
    return null; // Don't render anything for non-admin users
  }

  return (
    <nav className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold text-red-800 mb-3">Admin Navigation</h3>
      <div className="flex flex-wrap gap-2">
        <Link 
          href="/admin" 
          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
        >
          Dashboard
        </Link>
        <Link 
          href="/admin/users" 
          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
        >
          Users
        </Link>
        <Link 
          href="/admin/roles" 
          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
        >
          Roles
        </Link>
      </div>
    </nav>
  );
}

// Admin-only Action Buttons
export function AdminActions() {
  const { data: session } = useSession();

  if (!session || session.user.role !== "admin") {
    return null;
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-yellow-800 mb-3">Admin Actions</h3>
      <div className="space-y-2">
        <button className="w-full bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-700 transition-colors text-left">
          🗑️ Delete User Data
        </button>
        <button className="w-full bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-700 transition-colors text-left">
          🔧 System Maintenance
        </button>
        <button className="w-full bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-700 transition-colors text-left">
          📊 Generate Reports
        </button>
      </div>
    </div>
  );
}

// Role-based Status Badge
export function RoleBadge() {
  const { data: session } = useSession();

  if (!session) return null;

  const role = session.user.role || "user";
  
  const roleStyles = {
    admin: "bg-red-100 text-red-800 border-red-200",
    moderator: "bg-blue-100 text-blue-800 border-blue-200", 
    user: "bg-green-100 text-green-800 border-green-200"
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${roleStyles[role as keyof typeof roleStyles] || roleStyles.user}`}>
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );
}

// Main AdminPanel component as specified
export default function AdminPanel() {
  const { data: session } = useSession();

  if (!session || session.user.role !== "admin") {
    return <p>Access Denied</p>;
  }

  return (
    <section>
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p>Welcome, administrator.</p>
    </section>
  );
}
