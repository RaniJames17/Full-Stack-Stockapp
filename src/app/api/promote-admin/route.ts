import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Check if user exists
    const user = await db.collection("users").findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user to admin role
    const result = await db.collection("users").updateOne(
      { email },
      { $set: { role: "admin" } }
    );

    if (result.modifiedCount === 1) {
      return NextResponse.json({ 
        success: true, 
        message: `User ${email} promoted to admin` 
      });
    } else {
      return NextResponse.json({ 
        error: "Failed to update user role" 
      }, { status: 500 });
    }

  } catch (error) {
    console.error("Admin promotion error:", error);
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}
