import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

interface FilterQuery {
  action?: string;
  actorId?: ObjectId;
  timestamp?: {
    $gte?: Date;
    $lte?: Date;
  };
}

interface UserMap {
  [key: string]: {
    _id: ObjectId;
    email: string;
    name?: string;
  };
}

export async function GET(req: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const action = searchParams.get("action");
    const actorId = searchParams.get("actorId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Build filter object
    const filter: FilterQuery = {};
    
    if (action) {
      filter.action = action;
    }
    
    if (actorId) {
      filter.actorId = new ObjectId(actorId);
    }
    
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) {
        filter.timestamp.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.timestamp.$lte = new Date(endDate);
      }
    }

    // Connect to database
    const client = await clientPromise;
    const db = client.db();
    const auditLogsCollection = db.collection("audit_logs");

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalCount = await auditLogsCollection.countDocuments(filter);

    // Fetch audit logs with pagination and sorting (newest first)
    const auditLogs = await auditLogsCollection
      .find(filter)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Get user details for actor information
    const actorIds = [...new Set(auditLogs.map(log => log.actorId))];
    const users = await db.collection("users")
      .find({ _id: { $in: actorIds } })
      .project({ _id: 1, email: 1, name: 1 })
      .toArray();

    const userMap = users.reduce((acc, user) => {
      acc[user._id.toString()] = user;
      return acc;
    }, {} as UserMap);

    // Enrich audit logs with actor information
    const enrichedLogs = auditLogs.map(log => ({
      ...log,
      actor: userMap[log.actorId.toString()] || { email: "Unknown User" }
    }));

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      success: true,
      data: {
        logs: enrichedLogs,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage,
          hasPrevPage,
          limit
        }
      }
    });

  } catch (error) {
    console.error("Audit logs fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
