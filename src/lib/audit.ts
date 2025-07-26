import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function logAuditEvent({
  actorId,
  action,
  targetUserId,
  details = {},
}: {
  actorId: string;
  action: string;
  targetUserId: string;
  details?: Record<string, unknown>;
}) {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    await db.collection("audit_logs").insertOne({
      timestamp: new Date(),
      actorId: new ObjectId(actorId),
      targetUserId: new ObjectId(targetUserId),
      action,
      details,
    });
    
    console.log(`Audit log created: ${action} by ${actorId} on ${targetUserId}`);
  } catch (error) {
    console.error("Failed to create audit log:", error);
    // Don't throw error to prevent breaking the main operation
  }
}

// Predefined action constants for consistency
export const AUDIT_ACTIONS = {
  UPDATE_ROLE: "UPDATE_ROLE",
  DELETE_USER: "DELETE_USER",
  RESET_PASSWORD: "RESET_PASSWORD",
  CREATE_USER: "CREATE_USER",
  LOGIN_ADMIN: "LOGIN_ADMIN",
  LOGOUT_ADMIN: "LOGOUT_ADMIN",
} as const;

export type AuditAction = typeof AUDIT_ACTIONS[keyof typeof AUDIT_ACTIONS];
