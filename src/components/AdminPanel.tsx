"use client";
import { useSession } from "next-auth/react";

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
