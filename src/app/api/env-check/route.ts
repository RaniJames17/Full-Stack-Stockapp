import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // This API route runs server-side and can access environment variables
  const envCheck = {
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'NOT SET',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT SET',
    MONGODB_URI: process.env.MONGODB_URI ? 'SET' : 'NOT SET',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'SET' : 'NOT SET',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT SET',
    currentHost: request.headers.get('host'),
    protocol: request.headers.get('x-forwarded-proto') || 'http',
    fullUrl: `${request.headers.get('x-forwarded-proto') || 'http'}://${request.headers.get('host')}`,
  };

  return NextResponse.json(envCheck, {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
