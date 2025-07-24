"use client";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p className="p-6">Loading your dashboard...</p>;
  }

  if (!session) {
    return <p className="p-6 text-red-600">Access denied.</p>;
  }

  return (
    <main className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">Welcome to Your Dashboard</h1>
      <p className="text-gray-700">
        Logged in as: <strong>{session.user?.email}</strong>
      </p>
      <p className="mt-2">Here you can view and manage your account, data, and preferences.</p>
    </main>
  );
}
