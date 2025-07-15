import { NextRequest, NextResponse } from 'next/server';
import { checkUserApproval } from '@/lib/approved-users';

// Mock function for now - in production this would call the Lambda function
async function getCognitoUsers() {
  // This is a temporary mock implementation
  // In production, you would call your Lambda function here
  return [
    // Mock users for testing - replace with actual Lambda call
  ];
}

export async function GET(request: NextRequest) {
  try {
    // Get all Cognito users
    const users = await getCognitoUsers();
    
    // Check approval status for each user
    const usersWithApproval = await Promise.all(
      users.map(async (user: any) => {
        const isApproved = await checkUserApproval(user.email);
        return {
          ...user,
          isApproved
        };
      })
    );

    return NextResponse.json(usersWithApproval);
  } catch (error) {
    console.error('Error fetching Cognito users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
