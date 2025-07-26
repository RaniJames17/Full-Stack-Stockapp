"use client";
import { useEffect, useState } from "react";

interface AuditEntry {
  _id: string;
  actorId: string;
  targetUserId: string;
  action: string;
  timestamp: string;
  details: Record<string, unknown>;
}

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/audit")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => setLogs(data.logs))
      .catch(() => setError("Failed to load audit logs"));
  }, []);

  return (
    <main className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-semibold mb-4">Audit Logs</h1>
      {error && <p className="text-red-600">{error}</p>}
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left px-2 py-1">Timestamp</th>
            <th className="text-left px-2 py-1">Action</th>
            <th className="text-left px-2 py-1">Actor</th>
            <th className="text-left px-2 py-1">Target</th>
            <th className="text-left px-2 py-1">Details</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((entry) => (
            <tr key={entry._id} className="border-b">
              <td className="px-2 py-1">
                {new Date(entry.timestamp).toLocaleString()}
              </td>
              <td className="px-2 py-1">{entry.action}</td>
              <td className="px-2 py-1">{entry.actorId}</td>
              <td className="px-2 py-1">{entry.targetUserId}</td>
              <td className="px-2 py-1">
                <pre className="whitespace-pre-wrap text-xs text-gray-600">
                  {JSON.stringify(entry.details, null, 2)}
                </pre>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
