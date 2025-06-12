import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/mongodb";

export async function GET(request) {
  try {
    // Check for authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized - Missing or invalid token" },
        { status: 401 }
      );
    }

    // For development purposes, accept any token
    // In production, you should verify the token with Clerk
    // const token = authHeader.split(" ")[1];
    // const user = await verifyToken(token);
    
    // For now, use a placeholder user ID for development
    const user = { id: "dev_admin_user" };

    // Connect to database
    const { db } = await connectToDatabase();

    // Get all users
    const users = await db.collection("users").find({}).toArray();

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 