// This script sets admin role for a user
import { connectToDatabase } from '../lib/mongodb';

async function setAdminRole(userId) {
  if (!userId) {
    console.error('Please provide a user ID');
    process.exit(1);
  }

  try {
    console.log(`Setting admin role for user: ${userId}`);
    const { db } = await connectToDatabase();
    
    const result = await db.collection('users').updateOne(
      { clerkId: userId },
      { $set: { role: 'admin' } }
    );

    if (result.matchedCount === 0) {
      console.log(`No user found with ID: ${userId}`);
    } else if (result.modifiedCount === 0) {
      console.log(`User ${userId} already has admin role`);
    } else {
      console.log(`Successfully set admin role for user: ${userId}`);
    }
  } catch (error) {
    console.error('Error setting admin role:', error);
  }
}

// Get userId from command line arguments
const userId = process.argv[2];
setAdminRole(userId); 