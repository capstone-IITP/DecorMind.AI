import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/mongodb";
import User from "../../../models/User";

export async function POST(request) {
  try {
    // Get user data from request
    const { user } = await request.json();
    
    if (!user || !user.primaryEmailAddress?.emailAddress) {
      return NextResponse.json(
        { success: false, message: 'Invalid user data' }, 
        { status: 400 }
      );
    }
    
    const email = user.primaryEmailAddress.emailAddress;
    
    try {
      // Connect to MongoDB
      await connectToDatabase();
      
      // Find or create user in our database
      let dbUser = await User.findOne({ email });
      
      // If user doesn't exist, create a new one with default values
      if (!dbUser) {
        dbUser = new User({
          email,
          name: user.fullName || user.username || "User",
          imageUrl: user.imageUrl,
          credits: 5, // Default credits for new users
          lastLogin: new Date(),
          clerkId: user.id
        });
        await dbUser.save();
      } else {
        // Update last login time for existing user
        dbUser.lastLogin = new Date();
        // Update Clerk ID if it's not set
        if (!dbUser.clerkId && user.id) {
          dbUser.clerkId = user.id;
        }
        // Update user details if they've changed
        if (user.fullName && dbUser.name !== user.fullName) {
          dbUser.name = user.fullName;
        }
        if (user.imageUrl && dbUser.imageUrl !== user.imageUrl) {
          dbUser.imageUrl = user.imageUrl;
        }
        await dbUser.save();
      }
      
      // Return user data
      return NextResponse.json({
        success: true,
        message: 'User verified successfully',
        result: {
          id: dbUser._id,
          email: dbUser.email,
          name: dbUser.name,
          imageUrl: dbUser.imageUrl,
          credits: dbUser.credits,
          lastLogin: dbUser.lastLogin,
          clerkId: dbUser.clerkId
        }
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      
      // Return fallback data for database errors
      return NextResponse.json({
        success: false,
        message: 'Database error, using fallback data',
        result: {
          email: email,
          name: user.fullName || user.username || "User",
          imageUrl: user.imageUrl,
          credits: 5
        }
      });
    }
  } catch (error) {
    console.error('Error verifying user:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to verify user: ' + error.message },
      { status: 500 }
    );
  }
} 