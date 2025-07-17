import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, QueryCommand, PutCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import amplifyConfig from '@/amplify_outputs.json';

// Create credentials provider for server-side DynamoDB access
const credentialsProvider = fromCognitoIdentityPool({
  client: new CognitoIdentityClient({
    region: amplifyConfig.auth.aws_region,
  }),
  identityPoolId: amplifyConfig.auth.identity_pool_id,
});

// Create DynamoDB client
const dynamoClient = new DynamoDBClient({
  region: amplifyConfig.auth.aws_region,
  credentials: credentialsProvider,
});

const docClient = DynamoDBDocumentClient.from(dynamoClient);

// The actual table name - now has proper permissions
const tableName = `ApprovedUser-aohobewt3fgsdhp5jb774e7z34-NONE`;

export const serverApprovedUserOperations = {
  async list(filter?: any) {
    try {
      console.warn('🔍 SERVER: Querying DynamoDB table:', tableName);
      
      if (filter?.email?.eq) {
        // Use Query with the byEmail index
        const command = new QueryCommand({
          TableName: tableName,
          IndexName: 'byEmail',
          KeyConditionExpression: 'email = :email',
          ExpressionAttributeValues: {
            ':email': filter.email.eq
          }
        });
        
        const result = await docClient.send(command);
        console.warn('🔍 SERVER: Query result:', result);
        return { data: result.Items || [] };
      } else {
        // Use Scan for full table scan - now has proper permissions
        const command = new ScanCommand({
          TableName: tableName
        });
        
        const result = await docClient.send(command);
        console.warn('🔍 SERVER: Scan result:', result);
        return { data: result.Items || [] };
      }
    } catch (error) {
      console.error('🔍 SERVER: Error querying DynamoDB:', error);
      throw error;
    }
  },

  async create(item: any) {
    try {
      const command = new PutCommand({
        TableName: tableName,
        Item: {
          id: crypto.randomUUID(),
          ...item,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      });
      
      const result = await docClient.send(command);
      console.warn('🔍 SERVER: Create result:', result);
      return { data: item };
    } catch (error) {
      console.error('🔍 SERVER: Error creating item:', error);
      throw error;
    }
  },

  async delete(id: string) {
    try {
      const command = new DeleteCommand({
        TableName: tableName,
        Key: { id }
      });
      
      const result = await docClient.send(command);
      console.warn('🔍 SERVER: Delete result:', result);
      return { data: { id } };
    } catch (error) {
      console.error('🔍 SERVER: Error deleting item:', error);
      throw error;
    }
  }
};
