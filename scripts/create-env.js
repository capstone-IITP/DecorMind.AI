// This script creates a basic .env.local file with default values
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to .env.local file
const envFilePath = path.join(path.resolve(__dirname, '..'), '.env.local');

// Default environment variables
const envContent = `# Environment variables for DecorMind Admin Panel
# Replace these placeholder values with your actual API keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=YOUR_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY=YOUR_CLERK_SECRET_KEY
ADMIN_SECRET_KEY=YOUR_ADMIN_SECRET_KEY
MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING
ABLY_API_KEY=YOUR_ABLY_API_KEY
`;

// Write the file
fs.writeFileSync(envFilePath, envContent);

console.log(`Environment file created at ${envFilePath}`);
console.log('Restart your development server for the changes to take effect.');
console.log('IMPORTANT: Replace the placeholder values with your actual API keys before running the application.');
