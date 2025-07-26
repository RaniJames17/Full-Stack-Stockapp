import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    // Check environment variables
    const envCheck = {
      MONGODB_URI: !!process.env.MONGODB_URI,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || "Not set",
      NODE_ENV: process.env.NODE_ENV,
      GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
    };

    // Test MongoDB connection
    let mongoStatus = "Not tested";
    try {
      const client = await clientPromise;
      await client.db().admin().ping();
      mongoStatus = "Connected successfully";
    } catch (error) {
      mongoStatus = `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }

    return NextResponse.json({
      success: true,
      environment: envCheck,
      mongodb: mongoStatus,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
