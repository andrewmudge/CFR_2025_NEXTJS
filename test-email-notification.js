import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

const snsClient = new SNSClient({ region: 'us-east-1' });

export const testEmailNotification = async () => {
  try {
    const message = `
Test notification from CFR 2025 NextJS:

This is a test email to verify the notification system is working.

Name: Test User
Email: test@example.com
Phone: +1234567890
Status: PENDING APPROVAL

This is a test notification to verify the email system is working properly.

Time: ${new Date().toLocaleString()}
`;

    const publishCommand = new PublishCommand({
      TopicArn: 'arn:aws:sns:us-east-1:122610511543:cfr-signup-notification',
      Message: message,
      Subject: 'CFR Test Notification',
    });

    const result = await snsClient.send(publishCommand);
    console.log('Test notification sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Error sending test notification:', error);
    throw error;
  }
};

// Run the test
testEmailNotification()
  .then(() => console.log('Test completed successfully'))
  .catch(error => console.error('Test failed:', error));
