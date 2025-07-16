import { NextRequest, NextResponse } from 'next/server';
import { checkUserApproval } from '@/lib/approved-users';


// Function to call the Lambda function
async function getCognitoUsers() {
  // In server-side API routes, NEXT_PUBLIC_ vars are available, but let's also check regular env vars
  const lambdaUrl = process.env.NEXT_PUBLIC_COGNITO_ADMIN_URL || process.env.COGNITO_ADMIN_URL;
  
  console.log('Lambda URL:', lambdaUrl);
  console.log('Environment check:', {
    NEXT_PUBLIC_COGNITO_ADMIN_URL: process.env.NEXT_PUBLIC_COGNITO_ADMIN_URL,
    COGNITO_ADMIN_URL: process.env.COGNITO_ADMIN_URL,
    NODE_ENV: process.env.NODE_ENV
  });
  
  if (!lambdaUrl) {
    console.error('Lambda URL not configured');
    throw new Error('Lambda URL not configured');
  }

  try {
    console.log('Calling Lambda function...');
    const response = await fetch(lambdaUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'listUsers'
      }),
    });

    console.log('Lambda response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lambda error response:', errorText);
      throw new Error(`Lambda function returned ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log('Lambda result:', result);
    
    if (!result.users) {
      console.error('No users property in response:', result);
      throw new Error('Invalid response format from Lambda function');
    }
    
    return result.users.map((user: any) => ({
      ...user,
      userCreateDate: new Date(user.userCreateDate)
    }));
  } catch (error) {
    console.error('Error calling Lambda function:', error);
    throw error;
  }
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
