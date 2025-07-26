import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    return NextResponse.json({
      success: true,
      hasSession: !!session,
      user: session?.user ? {
        email: session.user.email,
        role: session.user.role,
        id: session.user.id,
      } : null,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      hasSession: false,
    }, { status: 500 });
  }
}
