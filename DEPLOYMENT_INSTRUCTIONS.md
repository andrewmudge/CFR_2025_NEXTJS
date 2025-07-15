# Deployment Instructions for CFR 2025 NextJS

## Overview
This update implements an automated notification system for new user signups. When a user signs up and verifies their email, you'll receive a notification with their details and approval status.

## Key Changes Made

### 1. Post-Confirmation Trigger
- Updated `amplify/functions/post-confirmation.ts` to send email notifications
- Automatically checks if new users are pre-approved
- Sends detailed notification with user info and approval status

### 2. Enhanced Admin Interface
- Updated `components/admin/PendingUsers.tsx` to fetch real Cognito users
- Real-time list of users who need approval
- Integrated with actual database instead of localStorage

### 3. Removed Preview Mode
- Completely removed all preview mode bypass functionality
- Strengthened security by ensuring only approved users can access family content

### 4. Database Integration
- Removed mock data from `lib/approved-users.ts`
- System now uses real ApprovedUser table for all approval checks

## How the New System Works

1. **User Signs Up**: User creates account and verifies email
2. **Post-Confirmation Trigger**: Lambda function automatically runs
3. **Approval Check**: System checks if user is in ApprovedUser table
4. **Notification Sent**: Email notification sent to admin with user details
5. **Admin Review**: Admin receives notification and can approve/deny via admin panel

## Email Notifications

You'll receive emails with:
- User's full name, email, and phone number
- Approval status (APPROVED or PENDING APPROVAL)
- Signup timestamp
- Action guidance

## To Deploy

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Deploy Amplify backend**:
   ```bash
   npx ampx sandbox
   ```

3. **Test the system**:
   - Have someone sign up with a new email
   - Check if you receive the notification email
   - Verify the user appears in the admin panel

## SNS Topic Configuration

The system uses your existing SNS topic:
`arn:aws:sns:us-east-1:122610511543:cfr-signup-notification`

Make sure this topic is still active and your email is subscribed to it.

## Admin Panel

Access the admin panel at: `https://yoursite.com/admin`

You can:
- See all pending users awaiting approval
- Approve users directly from the interface
- View user details and signup information

## Testing

1. **Test with new email**: Create a test account with a new email address
2. **Check notification**: Verify you receive the email notification
3. **Check admin panel**: Confirm the user appears in pending users
4. **Test approval**: Approve the user and verify they can access family content

## Troubleshooting

If notifications aren't working:
1. Check CloudWatch logs for the post-confirmation Lambda
2. Verify SNS topic permissions
3. Ensure your email is subscribed to the SNS topic
4. Check the Lambda environment variables

The system is designed to never block user signup - if the notification fails, the user can still sign up successfully.
