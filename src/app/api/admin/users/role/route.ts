import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { logAuditEvent } from "@/lib/audit";

export async function PATCH(req: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    
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

    // Validate role (simplified to user/admin only)
    const validRoles = ["user", "admin"];
    if (!validRoles.includes(newRole)) {
      return NextResponse.json(
        { error: "Invalid role. Must be user or admin" },
        { status: 400 }
      );
    }

    // Edge Case 1: Prevent self-demotion
    // Admins cannot demote themselves to prevent accidental lockout
    if (session.user.id === userId && newRole !== "admin") {
      return NextResponse.json(
        { error: "Admins cannot demote themselves" },
        { status: 400 }
      );
    }

    // Connect to database
    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection("users");

    // Get current user data (including current role) before update
    const targetUser = await usersCollection.findOne({ _id: new ObjectId(userId) });
    
    if (!targetUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const previousRole = targetUser.role;

    // Edge Case 2: Prevent removal of the last admin
    // Check if we're demoting an admin and if they're the last one
    const adminCount = await db
      .collection("users")
      .countDocuments({ role: "admin" });
    
    if (targetUser?.role === "admin" && newRole !== "admin" && adminCount === 1) {
      return NextResponse.json(
        { error: "Cannot demote the last remaining admin" },
        { status: 400 }
      );
    }

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

    // Log the audit event after successful role update
    await logAuditEvent({
      actorId: session.user.id!,
      action: "UPDATE_ROLE",
      targetUserId: userId,
      details: {
        previousRole,
        newRole,
        userEmail: targetUser.email,
        timestamp: new Date().toISOString()
      }
    });

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
