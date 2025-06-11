import { inMemoryDatabase } from '../../../../config/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get total users
    const totalUsers = inMemoryDatabase.users.length;

    // Get total credits
    const totalCredits = inMemoryDatabase.users.reduce((total, user) => total + (user.credits || 0), 0);

    // Get recent transactions (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentTransactions = inMemoryDatabase.credit_transactions.filter(
      transaction => new Date(transaction.created_at) >= thirtyDaysAgo
    ).length;
    
    // Get active users (users with credits > 0)
    const activeUsers = inMemoryDatabase.users.filter(user => (user.credits || 0) > 0).length;

    return NextResponse.json({
      totalUsers,
      totalCredits,
      recentTransactions,
      activeUsers
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
} 