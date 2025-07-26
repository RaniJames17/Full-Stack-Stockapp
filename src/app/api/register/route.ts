import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    
    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db();

    const existing = await db.collection("users").findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }

    const hashedPassword = await hash(password, 12);
    const result = await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      role: "user",
      createdAt: new Date(),
    });

    return NextResponse.json({ 
      success: true, 
      userId: result.insertedId,
      message: "User created successfully" 
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ 
      error: "Internal server error. Please try again." 
    }, { status: 500 });
  }
}
