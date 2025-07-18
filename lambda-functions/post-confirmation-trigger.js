const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');
const { randomUUID } = require('crypto');

const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const snsClient = new SNSClient({ region: process.env.AWS_REGION || 'us-east-1' });

const USER_STATUS_TABLE = 'UserStatus-cfr2025';
const APPROVED_USERS_TABLE = 'ApprovedUser-aohobewt3fgsdhp5jb774e7z34-NONE'; // Your existing approved users table
const SNS_TOPIC_ARN = 'arn:aws:sns:us-east-1:122610511543:cfr-signup-notification';

exports.handler = async (event) => {
  console.log('=== PostConfirmation Trigger Started ===');
  console.log('Event:', JSON.stringify(event, null, 2));

  try {
    const { userAttributes, userName } = event.request;
    const email = userAttributes.email.toLowerCase();
    const givenName = userAttributes.given_name || '';
    const familyName = userAttributes.family_name || '';
    const phoneNumber = userAttributes.phone_number || '';

    console.log('Processing user:', { email, userName, givenName, familyName });

    // Check if user is in the approved list (your existing table)
    const isPreApproved = await checkIfEmailApproved(email);
    console.log('Pre-approval check result:', isPreApproved);

    // Create user status record
    const userStatusRecord = {
      id: randomUUID(),
      email: email,
      cognitoUsername: userName,
      status: isPreApproved ? 'approved' : 'pending',
      givenName: givenName,
      familyName: familyName,
      phoneNumber: phoneNumber,
      registrationDate: new Date().toISOString(),
      ...(isPreApproved && { approvalDate: new Date().toISOString() })
    };

    // Insert into UserStatus table
    await docClient.send(new PutCommand({
      TableName: USER_STATUS_TABLE,
      Item: userStatusRecord
    }));

    console.log('User status record created:', userStatusRecord);

    // Send SNS notification
    await sendNotification(userStatusRecord);

    // Return the event (required for Cognito triggers)
    return event;

  } catch (error) {
    console.error('Error in PostConfirmation trigger:', error);
    // Don't throw error - this would prevent user confirmation
    // Just log and continue
    return event;
  }
};

async function checkIfEmailApproved(email) {
  try {
    console.log('Checking if email is pre-approved:', email);
    
    // Query your existing ApprovedUser table
    const result = await docClient.send(new QueryCommand({
      TableName: APPROVED_USERS_TABLE,
      IndexName: 'email-index', // Assuming you have this GSI
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email
      }
    }));

    const isApproved = result.Items && result.Items.length > 0 && result.Items[0].isActive;
    console.log('Pre-approval result:', { email, isApproved, recordsFound: result.Items?.length });
    
    return isApproved;
  } catch (error) {
    console.error('Error checking pre-approval:', error);
    // Default to pending if check fails
    return false;
  }
}

async function sendNotification(userRecord) {
  try {
    console.log('Attempting to send SNS notification...');
    
    const statusText = userRecord.status === 'approved' ? 'AUTO-APPROVED' : 'PENDING APPROVAL';
    const message = `New user has confirmed their email:

Name: ${userRecord.givenName} ${userRecord.familyName}
Email: ${userRecord.email}
Phone: ${userRecord.phoneNumber}
Status: ${statusText}

Please review at: https://churchwellreuniion.com/admin
`;

    const response = await snsClient.send(new PublishCommand({
      TopicArn: SNS_TOPIC_ARN,
      Message: message,
      Subject: `CFR New User Signup - ${statusText}`
    }));

    console.log('SNS response:', response);
    console.log('SNS notification sent successfully');
    
  } catch (error) {
    console.error('SNS error:', error);
    console.error('Error type:', typeof error);
    // Don't throw - we don't want SNS failures to break user confirmation
  }
}
