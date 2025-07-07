import { generateClient } from 'aws-amplify/data';

// Use any type for now to avoid build issues
const client = generateClient<any>();

export interface ApprovedUserData {
  email: string;
  givenName: string;
  familyName: string;
  phoneNumber?: string;
}

export const addApprovedUser = async (userData: ApprovedUserData) => {
  try {
    console.log('Adding approved user:', userData);
    const result = await client.models.ApprovedUser.create({
      email: userData.email.toLowerCase(),
      givenName: userData.givenName,
      familyName: userData.familyName,
      phoneNumber: userData.phoneNumber || '',
      isActive: true,
      createdDate: new Date().toISOString(),
    });
    console.log('User added successfully:', result);
    return result;
  } catch (error) {
    console.error('Error adding approved user:', userData.email, error);
    throw error;
  }
};

export const bulkImportApprovedUsers = async (users: ApprovedUserData[]) => {
  const results = [];
  for (const user of users) {
    try {
      const result = await addApprovedUser(user);
      results.push({ success: true, email: user.email, result });
    } catch (error) {
      results.push({ success: false, email: user.email, error });
    }
  }
  return results;
};

export const getApprovedUsers = async () => {
  try {
    console.log('Fetching approved users...');
    const result = await client.models.ApprovedUser.list({});
    console.log('Approved users result:', result);
    return result.data;
  } catch (error) {
    console.error('Error fetching approved users:', error);
    throw error;
  }
};

export const removeApprovedUser = async (id: string) => {
  try {
    const result = await client.models.ApprovedUser.delete({ id });
    return result;
  } catch (error) {
    console.error('Error removing approved user:', error);
    throw error;
  }
};

export const checkUserApproval = async (email: string): Promise<boolean> => {
  try {
    console.log('Checking approval for email:', email);
    const result = await client.models.ApprovedUser.list({
      filter: {
        email: {
          eq: email.toLowerCase()
        }
      }
    });
    console.log('Approval check result:', result);
    const isApproved = result.data.length > 0 && result.data[0].isActive;
    console.log('Is approved:', isApproved);
    return isApproved;
  } catch (error) {
    console.error('Error checking user approval:', error);
    return false;
  }
};