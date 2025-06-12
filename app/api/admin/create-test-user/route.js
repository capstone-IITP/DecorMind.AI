import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/mongodb";
import { randomUUID } from "crypto";

export async function POST(request) {
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

    // Generate a unique ID for the test user
    const testUserId = `test_${randomUUID()}`;
    
    // Create a test user
    const testUser = {
      clerkId: testUserId,
      email: `test-${testUserId.substring(0, 8)}@example.com`,
      credits: 100,
      role: "user",
      createdAt: new Date(),
      isTestUser: true,
    };

    // Insert the test user into the database
    await db.collection("users").insertOne(testUser);

    return NextResponse.json({
      success: true,
      message: "Test user created successfully",
      userId: testUserId,
    });
  } catch (error) {
    console.error("Error creating test user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}