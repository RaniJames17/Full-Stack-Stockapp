import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Test connection
    await db.admin().ping();
    
    // Count users
    const userCount = await db.collection("users").countDocuments();
    
    return NextResponse.json({
      status: "✅ MongoDB Connected",
      userCount: userCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error("MongoDB connection error:", error);
    return NextResponse.json({
      status: "❌ MongoDB Connection Failed",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
