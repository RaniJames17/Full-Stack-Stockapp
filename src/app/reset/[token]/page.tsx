"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const router = useRouter();
  const { token } = useParams();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`/api/reset/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      setStatus("Password updated. Redirecting...");
      setTimeout(() => router.push("/login"), 3000);
    } else {
      setStatus("Reset failed.");
    }
  }

  return (
    <main className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-xl font-semibold mb-4">Set a New Password</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border px-3 py-2"
        />
        <button className="bg-green-600 text-white px-4 py-2">
          Update Password
        </button>
        {status && <p className="text-sm mt-2">{status}</p>}
      </form>
    </main>
  );
}
