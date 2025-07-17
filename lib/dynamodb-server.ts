import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';

// Create DynamoDB client for server-side usage with Cognito Identity Pool
const cognitoClient = new CognitoIdentityClient({
  region: 'us-east-1',
});

const client = new DynamoDBClient({
  region: 'us-east-1',
  credentials: fromCognitoIdentityPool({
    client: cognitoClient,
    identityPoolId: 'us-east-1:cbdd94bc-38e6-4ac5-a8ba-f4c064b39444',
  }),
});

const docClient = DynamoDBDocumentClient.from(client);

// Get the table name from environment or use a default
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'ApprovedUser-aohobewt3fgsdhp5jb774e7z34-NONE';

export interface ApprovedUserRecord {
  id: string;
  email: string;
  givenName: string;
  familyName: string;
  phoneNumber?: string;
  isActive: boolean;
  createdDate: string;
}

export const checkUserApprovalServer = async (email: string): Promise<boolean> => {
  try {
    console.warn('🔍 SERVER: Checking approval for email:', email);
    console.warn('🔍 SERVER: Table name:', TABLE_NAME);
    
    // First try to query with lowercase email
    const scanCommand = new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: '#email = :email',
      ExpressionAttributeNames: {
        '#email': 'email'
      },
      ExpressionAttributeValues: {
        ':email': email.toLowerCase()
      }
    });
    
    const result = await docClient.send(scanCommand);
    console.warn('🔍 SERVER: DynamoDB scan result:', result);
    
    if (result.Items && result.Items.length > 0) {
      const user = result.Items[0] as ApprovedUserRecord;
      console.warn('🔍 SERVER: Found user:', user);
      console.warn('🔍 SERVER: User isActive:', user.isActive);
      return user.isActive;
    }
    
    // If not found with lowercase, try original case
    const scanCommand2 = new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: '#email = :email',
      ExpressionAttributeNames: {
        '#email': 'email'
      },
      ExpressionAttributeValues: {
        ':email': email
      }
    });
    
    const result2 = await docClient.send(scanCommand2);
    console.warn('🔍 SERVER: DynamoDB scan result (original case):', result2);
    
    if (result2.Items && result2.Items.length > 0) {
      const user = result2.Items[0] as ApprovedUserRecord;
      console.warn('🔍 SERVER: Found user (original case):', user);
      console.warn('🔍 SERVER: User isActive:', user.isActive);
      return user.isActive;
    }
    
    // If still not found, scan all records for debugging
    const scanAllCommand = new ScanCommand({
      TableName: TABLE_NAME
    });
    
    const allResult = await docClient.send(scanAllCommand);
    console.warn('🔍 SERVER: All records in table:', allResult.Items);
    
    return false;
  } catch (error) {
    console.error('🔍 SERVER: Error checking user approval:', error);
    return false;
  }
};

export const getAllApprovedUsersServer = async (): Promise<ApprovedUserRecord[]> => {
  try {
    const scanCommand = new ScanCommand({
      TableName: TABLE_NAME
    });
    
    const result = await docClient.send(scanCommand);
    return (result.Items || []) as ApprovedUserRecord[];
  } catch (error) {
    console.error('🔍 SERVER: Error getting all approved users:', error);
    return [];
  }
};
