// This script helps fix admin permissions
import { connectToDatabase } from '../lib/mongodb';

async function fixAdmin() {
  try {
    console.log('Connecting to database...');
    const { db } = await connectToDatabase();
    
    console.log('Fixing admin roles...');
    // Add your admin fixing logic here
    
    console.log('Admin roles fixed successfully');
  } catch (error) {
    console.error('Error fixing admin roles:', error);
  }
}

fixAdmin(); 