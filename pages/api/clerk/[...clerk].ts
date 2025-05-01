import { clerkClient } from '@clerk/nextjs/server';
import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req);
  
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  return res.status(200).json({ success: true });
} 