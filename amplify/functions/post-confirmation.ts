import type { PostConfirmationTriggerHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { CognitoIdentityProviderClient, AdminUpdateUserAttributesCommand } from '@aws-sdk/client-cognito-identity-provider';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

const dynamoClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const cognitoClient = new CognitoIdentityProviderClient({});
const snsClient = new SNSClient({});

export const handler: PostConfirmationTriggerHandler = async (event) => {
  const { userPoolId, userName } = event;
  const email = event.request.userAttributes.email;
  const givenName = event.request.userAttributes.given_name || '';
  const familyName = event.request.userAttributes.family_name || '';
  const phoneNumber = event.request.userAttributes.phone_number || '';

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

    // Send notification email
    await sendNotificationEmail(email, givenName, familyName, phoneNumber, isApproved);

  } catch (error) {
    console.error('Error in post-confirmation trigger:', error);
    // Don't throw error to avoid blocking user confirmation
  }

  return event;
};

async function sendNotificationEmail(email: string, givenName: string, familyName: string, phoneNumber: string, isApproved: boolean) {
  try {
    const status = isApproved ? 'APPROVED' : 'PENDING APPROVAL';
    const message = `
New user has signed up and verified their email:

Name: ${givenName} ${familyName}
Email: ${email}
Phone: ${phoneNumber}
Status: ${status}

${isApproved ? 
  'This user is already in the approved users list and has been granted family access.' : 
  'This user is NOT in the approved users list. If they should have family access, please add them to the ApprovedUser table in the admin panel at churchwellreunion.com/admin.'
}

Time: ${new Date().toLocaleString()}
`;

    const publishCommand = new PublishCommand({
      TopicArn: process.env.SNS_TOPIC_ARN || 'arn:aws:sns:us-east-1:122610511543:cfr-signup-notification',
      Message: message,
      Subject: `CFR New User Signup - ${status}`,
    });

    await snsClient.send(publishCommand);
    console.log('Notification email sent successfully');
  } catch (error) {
    console.error('Error sending notification email:', error);
    // Don't throw - we don't want to block user confirmation
  }
}