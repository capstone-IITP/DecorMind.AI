// This script sets up the admin environment
import { connectToDatabase } from '../lib/mongodb';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupAdmin() {
  try {
    console.log('Setting up admin environment...');
    
    // Create .env.local file if it doesn't exist
    const envFilePath = path.join(path.resolve(__dirname, '..'), '.env.local');
    if (!fs.existsSync(envFilePath)) {
      console.log('Creating environment file...');
      // Use the create-env.js script
      await import('./create-env.js');
    } else {
      console.log('Environment file already exists');
    }
    
    // Connect to database
    console.log('Connecting to database...');
    const { db } = await connectToDatabase();
    
    // Check if admin collection exists, create if not
    const collections = await db.listCollections().toArray();
    const hasAdminCollection = collections.some(c => c.name === 'admins');
    
    if (!hasAdminCollection) {
      console.log('Creating admins collection...');
      await db.createCollection('admins');
    }
    
    console.log('Admin setup completed successfully');
  } catch (error) {
    console.error('Error setting up admin:', error);
  }
}

setupAdmin(); 