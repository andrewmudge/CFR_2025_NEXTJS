// Note: This is a mock implementation for client-side
// In production, you'd need a Lambda function to query Cognito users
// due to security restrictions on client-side Cognito admin operations

export interface CognitoUser {
  username: string;
  email: string;
  givenName?: string;
  familyName?: string;
  phoneNumber?: string;
  userCreateDate?: Date;
  userStatus: string;
}

// Mock function - in production this would be a Lambda function
export const getCognitoUsers = async (): Promise<CognitoUser[]> => {
  // This is a placeholder - you'd need to implement a Lambda function
  // that calls AWS Cognito ListUsers API
  return [];
};

// For now, we'll track pending users in localStorage for demo purposes
const PENDING_USERS_KEY = 'pending_approval_users';

export const addPendingUser = (user: CognitoUser) => {
  if (typeof window === 'undefined') return;
  
  const pending = getPendingUsers();
  const exists = pending.find(u => u.email === user.email);
  
  if (!exists) {
    pending.push(user);
    localStorage.setItem(PENDING_USERS_KEY, JSON.stringify(pending));
  }
};

export const getPendingUsers = (): CognitoUser[] => {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(PENDING_USERS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const removePendingUser = (email: string) => {
  if (typeof window === 'undefined') return;
  
  const pending = getPendingUsers();
  const filtered = pending.filter(u => u.email !== email);
  localStorage.setItem(PENDING_USERS_KEY, JSON.stringify(filtered));
};