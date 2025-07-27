"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function AuthDebugPage() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Authentication Debug</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Session Status</h2>
            <p className="text-gray-600">Status: <span className="font-mono">{status}</span></p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Session Data</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Cookies</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {typeof window !== 'undefined' ? document.cookie : 'Server-side'}
            </pre>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Environment</h2>
            <p>NODE_ENV: {process.env.NODE_ENV}</p>
            <p>NEXTAUTH_URL: {process.env.NEXTAUTH_URL || 'Not set'}</p>
          </div>

          <div className="space-x-4">
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Refresh Page
            </button>
            <button 
              onClick={() => window.location.href = '/login'} 
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Go to Login
            </button>
            <button 
              onClick={() => window.location.href = '/dashboard'} 
              className="bg-purple-500 text-white px-4 py-2 rounded"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
