import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL);
export const db = drizzle(sql);

// In-memory database for development and testing
export const inMemoryDatabase = {
  users: [
    { id: 1, name: 'John Doe', email: 'john@example.com', credits: 10 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', credits: 5 },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', credits: 0 }
  ],
  credit_transactions: [
    { id: 1, user_id: 1, amount: 10, created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 2, user_id: 2, amount: 5, created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() }
  ]
};