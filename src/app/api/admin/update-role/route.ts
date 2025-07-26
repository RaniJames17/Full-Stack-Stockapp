import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, newRole } = await req.json();
    
    if (!email || !newRole) {
      return NextResponse.json({ error: "Email and newRole are required" }, { status: 400 });
    }

    // Only allow specific roles
    const validRoles = ["user", "admin", "moderator"];
    if (!validRoles.includes(newRole)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");

    // Update user role
    const result = await users.updateOne(
      { email: email },
      { $set: { role: newRole } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `User ${email} role updated to ${newRole}` 
    });

  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
