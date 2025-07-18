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
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify({
        action: 'listUsers'
      }),
    });

    console.log('Lambda response status:', response.status);
    console.log('Lambda response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lambda error response:', errorText);
      throw new Error(`Lambda function returned ${response.status}: ${errorText}`);
    }

    const responseText = await response.text();
    console.log('Lambda raw response:', responseText);
    
    const result = JSON.parse(responseText);
    console.log('Lambda parsed result:', result);
    
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
    console.log('=== API Route Started ===');
    
    // Get all Cognito users
    const users = await getCognitoUsers();
    console.log('🔍 API: Successfully got users from Lambda:', users.length);
    console.log('🔍 API: User emails:', users.map((u: any) => u.email));
    
    // Check approval status for each user using the unified function
    console.log('🔍 API: Checking approval status for users...');
    
    const usersWithApproval = await Promise.all(
      users.map(async (user: any) => {
        try {
          console.log(`🔍 API: Checking approval for user: ${user.email}`);
          
          // Add timeout to prevent hanging
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Approval check timeout')), 10000)
          );
          
          const approvalPromise = checkUserApproval(user.email);
          const isApproved = await Promise.race([approvalPromise, timeoutPromise]) as boolean;
          
          console.log(`🔍 API: User ${user.email} approval status: ${isApproved}`);
          
          // Special logging for our test user
          if (user.email === '0zhv2@mechanicspedia.com') {
            console.log(`🚨 SPECIAL: User 0zhv2@mechanicspedia.com has isApproved: ${isApproved}`);
          }
          
          return {
            ...user,
            isApproved
          };
        } catch (approvalError) {
          console.error(`🔍 API: Error checking approval for ${user.email}:`, approvalError);
          // Return user with approval false if check fails
          return {
            ...user,
            isApproved: false
          };
        }
      })
    );

    console.log('🔍 API: Returning users with approval status:', usersWithApproval.length);
    console.log('🔍 API: Final user emails:', usersWithApproval.map(u => u.email));
    
    // Add cache-busting headers to prevent caching issues
    return NextResponse.json(usersWithApproval, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
      }
    });
  } catch (error) {
    console.error('=== API Route Error ===');
    console.error('Error fetching Cognito users:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { error: 'Failed to fetch users', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
