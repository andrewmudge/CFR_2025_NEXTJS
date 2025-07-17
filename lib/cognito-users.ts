// Note: This implementation calls the API endpoint to get Cognito users
// The API endpoint handles the Lambda function calls securely

export interface CognitoUser {
  username: string;
  email: string;
  givenName: string;
  familyName: string;
  phoneNumber: string;
  userCreateDate: Date;
  userStatus: string;
  enabled: boolean;
  isApproved?: boolean;
}

// Get all Cognito users via API endpoint
export const getCognitoUsers = async (): Promise<CognitoUser[]> => {
  try {
    console.warn('🔍 CLIENT: Fetching Cognito users from API...');
    const response = await fetch('/api/cognito-users');
    if (!response.ok) {
      throw new Error('Failed to fetch Cognito users');
    }
    const users = await response.json();
    console.warn('🔍 CLIENT: Raw API response:', users);
    // Convert userCreateDate strings back to Date objects
    const processedUsers = users.map((user: any) => ({
      ...user,
      userCreateDate: new Date(user.userCreateDate)
    }));
    console.warn('🔍 CLIENT: Processed users:', processedUsers);
    return processedUsers;
  } catch (error) {
    console.error('🔍 CLIENT: Error fetching Cognito users:', error);
    return [];
  }
};

// Get users who are signed up but not approved
export const getPendingUsers = async (): Promise<CognitoUser[]> => {
  try {
    const allUsers = await getCognitoUsers();
    console.warn('🔍 CLIENT: All users before filtering:', allUsers);
    
    // Filter for users who are confirmed but not approved
    const pendingUsers = allUsers.filter(user => {
      const isPending = user.userStatus === 'CONFIRMED' && !user.isApproved;
      console.warn(`🔍 CLIENT: User ${user.email} - Status: ${user.userStatus}, isApproved: ${user.isApproved}, isPending: ${isPending}`);
      return isPending;
    });
    
    console.warn('🔍 CLIENT: Filtered pending users:', pendingUsers);
    return pendingUsers;
  } catch (error) {
    console.error('Error fetching pending users:', error);
    return [];
  }
};

// For backward compatibility - this is now handled by the database
export const addPendingUser = (user: CognitoUser) => {
  // This is now handled automatically by the post-confirmation trigger
  console.log('addPendingUser called but handled by post-confirmation trigger');
};

export const removePendingUser = (email: string) => {
  // This is now handled automatically when user is approved via addApprovedUser
  console.log('removePendingUser called but handled by approval process');
};