import { generateClient } from 'aws-amplify/data';

// Use any type for now to avoid build issues
const client = generateClient<any>();

// Server-side operations
let serverOps: any = null;

const getClient = () => {
  // Check if we're in a server-side context
  if (typeof window === 'undefined') {
    if (!serverOps) {
      // Lazy load the server operations to avoid circular imports
      const { serverApprovedUserOperations } = require('./amplify-server');
      serverOps = {
        models: {
          ApprovedUser: serverApprovedUserOperations
        }
      };
    }
    return serverOps;
  }
  return client;
};

export interface ApprovedUserData {
  email: string;
  givenName: string;
  familyName: string;
  phoneNumber?: string;
}

export const addApprovedUser = async (userData: ApprovedUserData) => {
  try {
    console.log('Adding approved user:', userData);
    const dynamicClient = getClient();
    const result = await dynamicClient.models.ApprovedUser.create({
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
    const dynamicClient = getClient();
    const result = await dynamicClient.models.ApprovedUser.list({});
    console.log('Approved users result:', result);
    return result.data;
  } catch (error) {
    console.error('Error fetching approved users:', error);
    throw error;
  }
};

export const removeApprovedUser = async (id: string) => {
  try {
    const dynamicClient = getClient();
    const result = await dynamicClient.models.ApprovedUser.delete({ id });
    return result;
  } catch (error) {
    console.error('Error removing approved user:', error);
    throw error;
  }
};

export const checkUserApproval = async (email: string): Promise<boolean> => {
  try {
    console.warn('🔍 Checking approval for email:', email);
    console.warn('🔍 Email to search (lowercase):', email.toLowerCase());
    
    const dynamicClient = getClient();
    
    // Check if we're using server or client operations
    if (typeof window === 'undefined') {
      console.warn('🔍 SERVER: Using server-side operations');
    } else {
      console.warn('🔍 CLIENT: Using client-side operations');
    }
    
    // First try with lowercase
    let result = await dynamicClient.models.ApprovedUser.list({
      filter: {
        email: {
          eq: email.toLowerCase()
        }
      }
    });
    
    console.warn('🔍 Lowercase search result:', result);
    
    // If not found, try with original case
    if (result.data.length === 0) {
      console.warn('🔍 Trying original case search...');
      result = await dynamicClient.models.ApprovedUser.list({
        filter: {
          email: {
            eq: email
          }
        }
      });
      console.warn('🔍 Original case search result:', result);
    }
    
    // If still not found, try listing all and manually checking
    if (result.data.length === 0) {
      console.warn('🔍 Trying manual search through all records...');
      const allResult = await dynamicClient.models.ApprovedUser.list({});
      console.warn('🔍 All approved users:', allResult.data);
      
      const matchingUser = allResult.data.find((user: any) => 
        user.email.toLowerCase() === email.toLowerCase()
      );
      
      if (matchingUser) {
        console.warn('🔍 Found matching user manually:', matchingUser);
        const isApproved = matchingUser.isActive;
        console.warn('🔍 Final approval status (manual):', isApproved);
        return isApproved;
      }
    }
    
    console.warn('🔍 Found records:', result.data.length);
    
    if (result.data.length > 0) {
      console.warn('🔍 First record:', result.data[0]);
      console.warn('🔍 First record isActive:', result.data[0].isActive);
      console.warn('🔍 First record email:', result.data[0].email);
    }
    
    const isApproved = result.data.length > 0 && result.data[0].isActive;
    console.warn('🔍 Final approval status:', isApproved);
    return isApproved;
  } catch (error) {
    console.error('🔍 Error checking user approval:', error);
    return false;
  }
};