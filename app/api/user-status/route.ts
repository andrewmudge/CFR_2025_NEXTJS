import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

// Configure DynamoDB client with credential fallback
const getCredentials = () => {
  // Check both standard AWS names and your custom names
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID || process.env.ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || process.env.SECRET_ACCESS_KEY;
  
  if (accessKeyId && secretAccessKey) {
    console.log('🔍 Using explicit credentials from environment variables');
    return {
      accessKeyId,
      secretAccessKey,
    };
  }
  
  // Let AWS SDK use default credential chain (IAM roles, etc.)
  console.log('🔍 Using default AWS credential chain (IAM role, instance profile, etc.)');
  return undefined;
};

const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION || process.env.REGION || 'us-east-1',
  credentials: getCredentials(),
});
const docClient = DynamoDBDocumentClient.from(dynamoClient);

const USER_STATUS_TABLE = 'UserStatus-cfr2025';

// Get all users with their status
export async function GET() {
  try {
    // Skip database calls during build time
    if (process.env.NODE_ENV === 'production' && !process.env.AWS_EXECUTION_ENV) {
      console.log('🔍 API: Skipping database call during build time');
      return NextResponse.json([], {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
    }

    console.log('🔍 API: Fetching all user statuses from DynamoDB...');
    
    const result = await docClient.send(new ScanCommand({
      TableName: USER_STATUS_TABLE
    }));

    const users = result.Items || [];
    console.log('🔍 API: Found users:', users.length);
    
    // Sort by registration date (newest first)
    users.sort((a: any, b: any) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime());
    
    return NextResponse.json(users, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('🔍 API: Error fetching user statuses:', error);
    console.error('🔍 API: Environment check:', {
      nodeEnv: process.env.NODE_ENV,
      hasStandardAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
      hasCustomAccessKey: !!process.env.ACCESS_KEY_ID,
      hasStandardSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY,
      hasCustomSecretKey: !!process.env.SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || process.env.REGION || 'us-east-1',
      awsExecutionEnv: process.env.AWS_EXECUTION_ENV,
      lambdaTaskRoot: process.env.LAMBDA_TASK_ROOT
    });
    
    // In production, provide more specific error guidance
    const errorMessage = process.env.NODE_ENV === 'production' 
      ? 'Database connection failed. Please check IAM permissions for DynamoDB access.'
      : 'Failed to fetch user statuses';
    
    return NextResponse.json(
      { error: errorMessage, details: String(error) },
      { status: 500 }
    );
  }
}

// Update user status (approve/deny)
export async function PATCH(request: NextRequest) {
  try {
    const { id, status, denialReason } = await request.json();
    
    console.log('🔍 API: Updating user status:', { id, status, denialReason });
    
    if (!id || !status) {
      return NextResponse.json(
        { error: 'ID and status are required' },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: any = { status };

    // Add approval/denial date and reason
    if (status === 'approved') {
      updateData.approvalDate = new Date().toISOString();
    } else if (status === 'denied') {
      updateData.denialDate = new Date().toISOString();
      
      if (denialReason) {
        updateData.denialReason = denialReason;
      }
    }

    await docClient.send(new UpdateCommand({
      TableName: USER_STATUS_TABLE,
      Key: { id },
      UpdateExpression: 'SET #status = :status' + 
        (status === 'approved' ? ', approvalDate = :approvalDate' : '') +
        (status === 'denied' ? ', denialDate = :denialDate' : '') +
        (status === 'denied' && denialReason ? ', denialReason = :denialReason' : ''),
      ExpressionAttributeNames: { '#status': 'status' },
      ExpressionAttributeValues: {
        ':status': status,
        ...(status === 'approved' && { ':approvalDate': new Date().toISOString() }),
        ...(status === 'denied' && { ':denialDate': new Date().toISOString() }),
        ...(status === 'denied' && denialReason && { ':denialReason': denialReason })
      }
    }));

    console.log('🔍 API: User status updated successfully');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('🔍 API: Error updating user status:', error);
    return NextResponse.json(
      { error: 'Failed to update user status', details: String(error) },
      { status: 500 }
    );
  }
}
