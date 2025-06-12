import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongodb';
import User from '../../../../models/User';
import { getAuth } from '@clerk/nextjs/server';
import { sendCreditNotification } from '../../../_utils/email';
import { clerkClient } from '@clerk/clerk-sdk-node';

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

    // Parse request body
    const { userId, credits } = await request.json();

    if (!userId || !credits) {
      return NextResponse.json(
        { error: "Missing required fields: userId and credits" },
        { status: 400 }
      );
    }

    // Connect to database
    const { db } = await connectToDatabase();

    // Update user credits
    const result = await db.collection("users").updateOne(
      { clerkId: userId },
      { $inc: { credits: parseInt(credits) } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: `No user found with ID: ${userId}` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Added ${credits} credits to user ${userId}`,
    });
  } catch (error) {
    console.error("Error adding credits:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 