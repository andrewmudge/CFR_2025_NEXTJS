// Simple standalone post-confirmation function
// This can be deployed separately and manually attached to Cognito

import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

const snsClient = new SNSClient({ region: 'us-east-1' });

exports.handler = async (event) => {
  console.log('Post-confirmation event:', JSON.stringify(event, null, 2));
  
  const email = event.request.userAttributes.email;
  const givenName = event.request.userAttributes.given_name || '';
  const familyName = event.request.userAttributes.family_name || '';
  const phoneNumber = event.request.userAttributes.phone_number || '';

  try {
    // Send notification email
    const message = `
New user has signed up and verified their email:

Name: ${givenName} ${familyName}
Email: ${email}
Phone: ${phoneNumber}
Status: PENDING APPROVAL

This user is NOT in the approved users list. If they should have family access, please add them to the ApprovedUser table in the admin panel at https://dev.d1jd00qcrnqgbc.amplifyapp.com/admin

Time: ${new Date().toLocaleString()}
`;

    const publishCommand = new PublishCommand({
      TopicArn: 'arn:aws:sns:us-east-1:122610511543:cfr-signup-notification',
      Message: message,
      Subject: 'CFR New User Signup - PENDING APPROVAL',
    });

    await snsClient.send(publishCommand);
    console.log('Notification email sent successfully');
    
  } catch (error) {
    console.error('Error sending notification email:', error);
    // Don't throw - we don't want to block user confirmation
  }

  return event;
};
