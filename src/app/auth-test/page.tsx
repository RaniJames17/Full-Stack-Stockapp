"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function AuthTestPage() {
  const { data: session, status } = useSession();
  const [serverSession, setServerSession] = useState<{
    hasSession: boolean;
    user?: { email: string; role: string; id: string };
    error?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/session-check')
      .then(r => r.json())
      .then(data => {
        setServerSession(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Session check failed:', err);
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Authentication Debug</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Client-side session */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Client Session (useSession)</h2>
            <div className="space-y-2">
              <p><strong>Status:</strong> {status}</p>
              <p><strong>Has Session:</strong> {session ? 'Yes' : 'No'}</p>
              {session && (
                <>
                  <p><strong>Email:</strong> {session.user?.email}</p>
                  <p><strong>Role:</strong> {session.user?.role || 'No role'}</p>
                  <p><strong>ID:</strong> {session.user?.id || 'No ID'}</p>
                </>
              )}
            </div>
          </div>

          {/* Server-side session */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Server Session (getServerSession)</h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="space-y-2">
                <p><strong>Has Session:</strong> {serverSession?.hasSession ? 'Yes' : 'No'}</p>
                {serverSession?.user && (
                  <>
                    <p><strong>Email:</strong> {serverSession.user.email}</p>
                    <p><strong>Role:</strong> {serverSession.user.role || 'No role'}</p>
                    <p><strong>ID:</strong> {serverSession.user.id || 'No ID'}</p>
                  </>
                )}
                {serverSession?.error && (
                  <p className="text-red-600"><strong>Error:</strong> {serverSession.error}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Test admin access */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Admin Access Test</h2>
          <div className="space-y-4">
            <p>Current role: <strong>{session?.user?.role || 'None'}</strong></p>
            <p>Should have admin access: <strong>{session?.user?.role === 'admin' ? 'Yes' : 'No'}</strong></p>
            
            <div className="flex gap-4">
              <a 
                href="/admin/audit-logs" 
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Test Audit Logs Access
              </a>
              <a 
                href="/admin/simple-users" 
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Test User Management Access
              </a>
            </div>
          </div>
        </div>

        {/* Raw data */}
        <div className="mt-8 bg-gray-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Raw Data</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Client Session:</h3>
              <pre className="text-xs bg-white p-3 rounded border overflow-auto">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>
            <div>
              <h3 className="font-medium mb-2">Server Session:</h3>
              <pre className="text-xs bg-white p-3 rounded border overflow-auto">
                {JSON.stringify(serverSession, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
