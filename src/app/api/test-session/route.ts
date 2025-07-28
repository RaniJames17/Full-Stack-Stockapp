import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-simple";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    return NextResponse.json({
      session,
      environment: {
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NODE_ENV: process.env.NODE_ENV,
        hasSecret: !!process.env.NEXTAUTH_SECRET,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json({ error: "Session check failed" }, { status: 500 });
  }
}