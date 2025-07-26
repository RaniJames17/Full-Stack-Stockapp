import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();
    
    const user = await db.collection("users").findOne({ email: session.user.email });
    
    return NextResponse.json({
      success: true,
      user: {
        id: user?._id,
        email: user?.email,
        name: user?.name,
        role: user?.role,
      },
      session: {
        email: session.user.email,
        role: session.user.role,
      }
    });
  } catch (error) {
    console.error("User check error:", error);
    return NextResponse.json({ 
      error: "Failed to check user" 
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { makeAdmin } = await req.json();
    
    const client = await clientPromise;
    const db = client.db();
    
    // Update current user to admin
    await db.collection("users").updateOne(
      { email: session.user.email },
      { $set: { role: makeAdmin ? "admin" : "user" } }
    );
    
    return NextResponse.json({
      success: true,
      message: `Role updated to ${makeAdmin ? "admin" : "user"}`,
    });
  } catch (error) {
    console.error("Role update error:", error);
    return NextResponse.json({ 
      error: "Failed to update role" 
    }, { status: 500 });
  }
}
