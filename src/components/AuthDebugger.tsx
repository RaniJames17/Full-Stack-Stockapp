// Utility to debug authentication issues in production
"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

export function AuthDebugger() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Auth Debug - Status:', status);
      console.log('Auth Debug - Session:', session);
      console.log('Auth Debug - Cookies:', document.cookie);
    }
  }, [session, status]);

  // Only show debug info in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-2 rounded text-xs max-w-xs">
      <div>Status: {status}</div>
      <div>User: {session?.user?.email || 'None'}</div>
      <div>Role: {session?.user?.role || 'None'}</div>
    </div>
  );
}
