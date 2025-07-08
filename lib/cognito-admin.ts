import { post } from 'aws-amplify/api';

export interface CognitoUserDetails {
  username: string;
  email: string;
  givenName: string;
  familyName: string;
  phoneNumber: string;
  userStatus: string;
  userCreateDate: Date;
  enabled: boolean;
}

// Get Lambda function URL from environment
const getCognitoAdminUrl = () => {
  // This will be the Lambda function URL after deployment
  // For now, we'll fall back to mock data if URL not available
  return process.env.NEXT_PUBLIC_COGNITO_ADMIN_URL;
};

export const listAllCognitoUsers = async (): Promise<CognitoUserDetails[]> => {
  const lambdaUrl = getCognitoAdminUrl();
  
  if (!lambdaUrl) {
    // Fallback to mock data if Lambda URL not configured
    console.log('Lambda URL not configured, using mock data');
    return getMockUsers();
  }

  try {
    const response = await fetch(lambdaUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'listUsers' })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.users.map((user: any) => ({
      ...user,
      userCreateDate: new Date(user.userCreateDate)
    }));
  } catch (error) {
    console.error('Error calling Lambda function, falling back to mock data:', error);
    return getMockUsers();
  }
};

export const deleteCognitoUser = async (username: string): Promise<void> => {
  const lambdaUrl = getCognitoAdminUrl();
  
  if (!lambdaUrl) {
    console.log('Lambda URL not configured, simulating delete');
    await new Promise(resolve => setTimeout(resolve, 1000));
    return;
  }

  try {
    const response = await fetch(lambdaUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'deleteUser', username })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Failed to delete user');
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// Mock data fallback
const getMockUsers = (): CognitoUserDetails[] => {
  return [
    {
      username: 'user-001',
      email: 'john.churchwell@gmail.com',
      givenName: 'John',
      familyName: 'Churchwell',
      phoneNumber: '+15551234567',
      userStatus: 'CONFIRMED',
      userCreateDate: new Date('2024-01-15'),
      enabled: true
    },
    {
      username: 'user-002',
      email: 'mary.johnson@yahoo.com',
      givenName: 'Mary',
      familyName: 'Johnson',
      phoneNumber: '+15552345678',
      userStatus: 'CONFIRMED',
      userCreateDate: new Date('2024-01-20'),
      enabled: true
    },
    {
      username: 'user-003',
      email: 'robert.smith@hotmail.com',
      givenName: 'Robert',
      familyName: 'Smith',
      phoneNumber: '+15553456789',
      userStatus: 'CONFIRMED',
      userCreateDate: new Date('2024-02-01'),
      enabled: true
    },
    {
      username: 'user-004',
      email: 'sarah.davis@gmail.com',
      givenName: 'Sarah',
      familyName: 'Davis',
      phoneNumber: '+15554567890',
      userStatus: 'CONFIRMED',
      userCreateDate: new Date('2024-02-05'),
      enabled: true
    },
    {
      username: 'user-005',
      email: 'michael.brown@outlook.com',
      givenName: 'Michael',
      familyName: 'Brown',
      phoneNumber: '+15555678901',
      userStatus: 'CONFIRMED',
      userCreateDate: new Date('2024-02-10'),
      enabled: true
    },
    {
      username: 'user-006',
      email: 'jennifer.wilson@gmail.com',
      givenName: 'Jennifer',
      familyName: 'Wilson',
      phoneNumber: '+15556789012',
      userStatus: 'CONFIRMED',
      userCreateDate: new Date('2024-02-15'),
      enabled: true
    },
    {
      username: 'user-007',
      email: 'david.miller@yahoo.com',
      givenName: 'David',
      familyName: 'Miller',
      phoneNumber: '+15557890123',
      userStatus: 'CONFIRMED',
      userCreateDate: new Date('2024-02-20'),
      enabled: true
    },
    {
      username: 'user-008',
      email: 'lisa.garcia@gmail.com',
      givenName: 'Lisa',
      familyName: 'Garcia',
      phoneNumber: '+15558901234',
      userStatus: 'CONFIRMED',
      userCreateDate: new Date('2024-02-25'),
      enabled: true
    },
    {
      username: 'user-009',
      email: 'james.martinez@hotmail.com',
      givenName: 'James',
      familyName: 'Martinez',
      phoneNumber: '+15559012345',
      userStatus: 'CONFIRMED',
      userCreateDate: new Date('2024-03-01'),
      enabled: true
    },
    {
      username: 'user-010',
      email: 'amanda.taylor@outlook.com',
      givenName: 'Amanda',
      familyName: 'Taylor',
      phoneNumber: '+15550123456',
      userStatus: 'CONFIRMED',
      userCreateDate: new Date('2024-03-05'),
      enabled: true
    }
  ];
};