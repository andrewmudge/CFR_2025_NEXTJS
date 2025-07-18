import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const dynamoClient = new DynamoDBClient({ region: 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

const USER_STATUS_TABLE = 'UserStatus-cfr2025';

// Get all users with their status
export async function GET() {
  try {
    console.log('🔍 API: Fetching all user statuses from DynamoDB...');
    
    const result = await docClient.send(new ScanCommand({
      TableName: USER_STATUS_TABLE
    }));

    const users = result.Items || [];
    console.log('🔍 API: Found users:', users.length);
    
    // Sort by registration date (newest first)
    users.sort((a, b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime());
    
    return NextResponse.json(users, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('🔍 API: Error fetching user statuses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user statuses' },
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

    let updateExpression = 'SET #status = :status';
    const expressionAttributeNames = { '#status': 'status' };
    const expressionAttributeValues: any = { ':status': status };

    // Add approval/denial date and reason
    if (status === 'approved') {
      updateExpression += ', approvalDate = :approvalDate';
      expressionAttributeValues[':approvalDate'] = new Date().toISOString();
    } else if (status === 'denied') {
      updateExpression += ', denialDate = :denialDate';
      expressionAttributeValues[':denialDate'] = new Date().toISOString();
      
      if (denialReason) {
        updateExpression += ', denialReason = :denialReason';
        expressionAttributeValues[':denialReason'] = denialReason;
      }
    }

    await docClient.send(new UpdateCommand({
      TableName: USER_STATUS_TABLE,
      Key: { id },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues
    }));

    console.log('🔍 API: User status updated successfully');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('🔍 API: Error updating user status:', error);
    return NextResponse.json(
      { error: 'Failed to update user status' },
      { status: 500 }
    );
  }
}
