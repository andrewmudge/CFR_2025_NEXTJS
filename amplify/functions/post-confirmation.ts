import type { PostConfirmationTriggerHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { CognitoIdentityProviderClient, AdminUpdateUserAttributesCommand } from '@aws-sdk/client-cognito-identity-provider';

const dynamoClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const cognitoClient = new CognitoIdentityProviderClient({});

export const handler: PostConfirmationTriggerHandler = async (event) => {
  const { userPoolId, userName } = event;
  const email = event.request.userAttributes.email;

  try {
    // Check if email exists in ApprovedUser table
    const queryCommand = new QueryCommand({
      TableName: process.env.APPROVED_USERS_TABLE_NAME,
      IndexName: 'byEmail',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email.toLowerCase(),
      },
    });

    const result = await docClient.send(queryCommand);
    const isApproved = result.Items && result.Items.length > 0 && result.Items[0].isActive;

    // Update user's custom:isApproved attribute
    const updateCommand = new AdminUpdateUserAttributesCommand({
      UserPoolId: userPoolId,
      Username: userName,
      UserAttributes: [
        {
          Name: 'custom:isApproved',
          Value: isApproved ? 'true' : 'false',
        },
      ],
    });

    await cognitoClient.send(updateCommand);

    console.log(`User ${email} approval status set to: ${isApproved}`);
  } catch (error) {
    console.error('Error in post-confirmation trigger:', error);
    // Don't throw error to avoid blocking user confirmation
  }

  return event;
};