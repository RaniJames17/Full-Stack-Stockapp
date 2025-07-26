import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function DELETE(req: Request) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Check if user exists
    const userToDelete = await db.collection("users").findOne({ _id: new ObjectId(userId) });
    if (!userToDelete) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent self-deletion
    if (userToDelete.email === session.user?.email) {
      return NextResponse.json({ 
        error: "You cannot delete your own account" 
      }, { status: 400 });
    }

    // Check if this is the last admin
    if (userToDelete.role === "admin") {
      const adminCount = await db.collection("users").countDocuments({ role: "admin" });
      if (adminCount <= 1) {
        return NextResponse.json({ 
          error: "Cannot delete the last admin. Promote another user to admin first." 
        }, { status: 400 });
      }
    }

    // Delete the user
    const result = await db.collection("users").deleteOne({ _id: new ObjectId(userId) });

    if (result.deletedCount === 1) {
      return NextResponse.json({ 
        success: true, 
        message: `User deleted successfully` 
      });
    } else {
      return NextResponse.json({ 
        error: "Failed to delete user" 
      }, { status: 500 });
    }

  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}
