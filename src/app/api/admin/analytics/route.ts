import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    // Connect to database
    const client = await clientPromise;
    const db = client.db();

    // Get current date boundaries
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // User Statistics
    const totalUsers = await db.collection("users").countDocuments();
    const adminCount = await db.collection("users").countDocuments({ role: "admin" });
    const userCount = await db.collection("users").countDocuments({ role: "user" });
    
    // New users (using createdAt if it exists, or _id timestamp for ObjectId)
    const newUsersToday = await db.collection("users").countDocuments({
      $or: [
        { createdAt: { $gte: todayStart } },
        { _id: { $gte: ObjectId.createFromTime(todayStart.getTime() / 1000) } }
      ]
    });
    
    const newUsersThisWeek = await db.collection("users").countDocuments({
      $or: [
        { createdAt: { $gte: weekStart } },
        { _id: { $gte: ObjectId.createFromTime(weekStart.getTime() / 1000) } }
      ]
    });
    
    const newUsersThisMonth = await db.collection("users").countDocuments({
      $or: [
        { createdAt: { $gte: monthStart } },
        { _id: { $gte: ObjectId.createFromTime(monthStart.getTime() / 1000) } }
      ]
    });

    // Activity Statistics (simulated for now - you can implement sessions collection later)
    const totalLogins = Math.floor(totalUsers * 15); // Simulated
    const loginsToday = Math.floor(totalUsers * 0.3); // Simulated
    const loginsThisWeek = Math.floor(totalUsers * 0.8); // Simulated
    const activeUsersToday = Math.floor(totalUsers * 0.15); // Simulated

    // Audit Statistics
    const totalAuditLogs = await db.collection("audit_logs").countDocuments();
    
    const roleChangesToday = await db.collection("audit_logs").countDocuments({
      action: "UPDATE_ROLE",
      timestamp: { $gte: todayStart }
    });
    
    const deletionsToday = await db.collection("audit_logs").countDocuments({
      action: "DELETE_USER",
      timestamp: { $gte: todayStart }
    });
    
    const recentActions = await db.collection("audit_logs").countDocuments({
      timestamp: { $gte: weekStart }
    });

    const analytics = {
      userStats: {
        totalUsers,
        newUsersToday,
        newUsersThisWeek,
        newUsersThisMonth,
        adminCount,
        userCount
      },
      activityStats: {
        totalLogins,
        loginsToday,
        loginsThisWeek,
        activeUsersToday
      },
      auditStats: {
        totalAuditLogs,
        roleChangesToday,
        deletionsToday,
        recentActions
      }
    };

    return NextResponse.json({
      success: true,
      analytics
    });

  } catch (error) {
    console.error("Analytics fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
