"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface EnvCheck {
  NODE_ENV: string;
  NEXTAUTH_URL: string;
  NEXTAUTH_SECRET: string;
  MONGODB_URI: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  currentHost: string;
  protocol: string;
  fullUrl: string;
}

export default function AuthDebugPage() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [envData, setEnvData] = useState<EnvCheck | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    
    // Fetch server-side environment data
    fetch('/api/env-check')
      .then(res => res.json())
      .then(data => {
        setEnvData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch env data:', err);
        setLoading(false);
      });
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
            <h2 className="text-lg font-semibold">Server Environment</h2>
            {loading ? (
              <p>Loading environment data...</p>
            ) : envData ? (
              <div className="bg-gray-100 p-4 rounded text-sm space-y-1">
                <p><strong>NODE_ENV:</strong> {envData.NODE_ENV}</p>
                <p><strong>NEXTAUTH_URL:</strong> {envData.NEXTAUTH_URL}</p>
                <p><strong>NEXTAUTH_SECRET:</strong> {envData.NEXTAUTH_SECRET}</p>
                <p><strong>MONGODB_URI:</strong> {envData.MONGODB_URI}</p>
                <p><strong>GOOGLE_CLIENT_ID:</strong> {envData.GOOGLE_CLIENT_ID}</p>
                <p><strong>GOOGLE_CLIENT_SECRET:</strong> {envData.GOOGLE_CLIENT_SECRET}</p>
                <p><strong>Current Host:</strong> {envData.currentHost}</p>
                <p><strong>Protocol:</strong> {envData.protocol}</p>
                <p><strong>Full URL:</strong> {envData.fullUrl}</p>
              </div>
            ) : (
              <p className="text-red-500">Failed to load environment data</p>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold">Client Environment</h2>
            <p>NODE_ENV: {process.env.NODE_ENV}</p>
            <p>Current URL: {typeof window !== 'undefined' ? window.location.origin : 'Server-side'}</p>
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
