import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest) {
  try {
    console.log('=== Delete User API Route Started ===');
    
    const { username } = await request.json();
    console.log('Username to delete:', username);
    
    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    const lambdaUrl = process.env.NEXT_PUBLIC_COGNITO_ADMIN_URL || process.env.COGNITO_ADMIN_URL;
    
    if (!lambdaUrl) {
      console.error('Lambda URL not configured');
      return NextResponse.json(
        { error: 'Lambda URL not configured' },
        { status: 500 }
      );
    }

    console.log('Calling Lambda function to delete user...');
    const response = await fetch(lambdaUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'deleteUser',
        username: username
      }),
    });

    console.log('Lambda response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lambda error response:', errorText);
      return NextResponse.json(
        { error: `Lambda function returned ${response.status}: ${errorText}` },
        { status: response.status }
      );
    }

    const result = await response.json();
    console.log('Lambda delete result:', result);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('=== Delete User API Route Error ===');
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
