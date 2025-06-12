// This script sets a specific user as admin
import { connectToDatabase } from '../lib/mongodb';

async function setAdmin() {
  try {
    console.log('Connecting to database...');
    const { db } = await connectToDatabase();
    
    // Replace with the actual user ID you want to make admin
    const userId = 'YOUR_USER_ID';
    
    console.log(`Setting admin role for user: ${userId}`);
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

setAdmin(); 