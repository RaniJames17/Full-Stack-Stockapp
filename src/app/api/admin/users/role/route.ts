import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PATCH(req: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession();
    
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const { userId, newRole } = await req.json();

    // Validate input
    if (!userId || !newRole) {
      return NextResponse.json(
        { error: "User ID and new role are required" },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ["user", "admin", "moderator"];
    if (!validRoles.includes(newRole)) {
      return NextResponse.json(
        { error: "Invalid role. Must be user, admin, or moderator" },
        { status: 400 }
      );
    }

    // Connect to database
    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection("users");

    // Update user role
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { role: newRole } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: `User role updated to ${newRole}` 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Role update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
