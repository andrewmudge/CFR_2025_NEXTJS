import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';

const dynamoClient = new DynamoDBClient({ region: 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

const USER_STATUS_TABLE = 'UserStatus-cfr2025';

export interface UserStatus {
  id: string;
  email: string;
  cognitoUsername: string;
  status: 'pending' | 'approved' | 'denied';
  givenName: string;
  familyName: string;
  phoneNumber: string;
  registrationDate: string;
  approvalDate?: string;
  denialDate?: string;
  denialReason?: string;
}

export const getUserStatus = async (email: string): Promise<UserStatus | null> => {
  try {
    console.log('🔍 Getting user status for:', email);
    
    const result = await docClient.send(new QueryCommand({
      TableName: USER_STATUS_TABLE,
      IndexName: 'email-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email.toLowerCase()
      }
    }));

    if (result.Items && result.Items.length > 0) {
      return result.Items[0] as UserStatus;
    }
    
    return null;
  } catch (error) {
    console.error('🔍 Error getting user status:', error);
    return null;
  }
};

export const isUserApproved = async (email: string): Promise<boolean> => {
  const userStatus = await getUserStatus(email);
  return userStatus?.status === 'approved';
};

export const getAllUsers = async (): Promise<UserStatus[]> => {
  try {
    const response = await fetch('/api/user-status', {
      method: 'GET',
      cache: 'no-cache'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching all users:', error);
    return [];
  }
};

export const updateUserStatus = async (
  id: string, 
  status: 'approved' | 'denied', 
  denialReason?: string
): Promise<boolean> => {
  try {
    const response = await fetch('/api/user-status', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, status, denialReason }),
      cache: 'no-cache'
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error updating user status:', error);
    return false;
  }
};
