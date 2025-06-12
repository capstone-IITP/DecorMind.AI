// This script sets up the environment
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to .env.local file
const envFilePath = path.join(path.resolve(__dirname, '..'), '.env.local');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function setupEnv() {
  console.log('Setting up environment variables...');
  
  // Check if .env.local already exists
  if (fs.existsSync(envFilePath)) {
    const answer = await new Promise(resolve => {
      rl.question('.env.local already exists. Overwrite? (y/n): ', resolve);
    });
    
    if (answer.toLowerCase() !== 'y') {
      console.log('Setup canceled');
      rl.close();
      return;
    }
  }
  
  // Get environment variables from user
  const clerkPublishable = await new Promise(resolve => {
    rl.question('Enter your Clerk Publishable Key: ', resolve);
  });
  
  const clerkSecret = await new Promise(resolve => {
    rl.question('Enter your Clerk Secret Key: ', resolve);
  });
  
  const adminSecret = await new Promise(resolve => {
    rl.question('Enter your Admin Secret Key: ', resolve);
  });
  
  const mongodbUri = await new Promise(resolve => {
    rl.question('Enter your MongoDB URI: ', resolve);
  });
  
  const ablyApiKey = await new Promise(resolve => {
    rl.question('Enter your Ably API Key: ', resolve);
  });
  
  // Create environment file content
  const envContent = `# Environment variables for DecorMind Admin Panel
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${clerkPublishable}
CLERK_SECRET_KEY=${clerkSecret}
ADMIN_SECRET_KEY=${adminSecret}
MONGODB_URI=${mongodbUri}
ABLY_API_KEY=${ablyApiKey}
`;

  // Write the file
  fs.writeFileSync(envFilePath, envContent);
  
  console.log(`Environment file created at ${envFilePath}`);
  console.log('Restart your development server for the changes to take effect.');
  
  rl.close();
}

setupEnv(); 