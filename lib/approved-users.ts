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
    
    const dynamicClient = getClient();
    
    // Check if we're using server or client operations
    if (typeof window === 'undefined') {
      console.warn('🔍 SERVER: Using server-side operations');
    } else {
      console.warn('🔍 CLIENT: Using client-side operations');
    }
    
    // First try with lowercase filter
    let result = await dynamicClient.models.ApprovedUser.list({
      filter: {
        email: {
          eq: email.toLowerCase()
        }
      }
    });
    
    // MANUAL FILTER: If we got too many results, filter manually
    if (result.data.length > 1) {
      console.warn('🚨 FILTER ISSUE: Got', result.data.length, 'records, filtering manually');
      result.data = result.data.filter((user: any) => 
        user.email.toLowerCase() === email.toLowerCase()
      );
    }
    
    // If not found, try with original case
    if (result.data.length === 0) {
      result = await dynamicClient.models.ApprovedUser.list({
        filter: {
          email: {
            eq: email
          }
        }
      });
      
      // MANUAL FILTER: If we got too many results, filter manually
      if (result.data.length > 1) {
        console.warn('🚨 FILTER ISSUE: Got', result.data.length, 'records, filtering manually');
        result.data = result.data.filter((user: any) => 
          user.email === email
        );
      }
    }
    
    const isApproved = result.data.length > 0 && result.data[0].isActive;
    
    // Special logging for our test user
    if (email === '0zhv2@mechanicspedia.com') {
      console.warn('🚨 SPECIAL: 0zhv2@mechanicspedia.com check result:', {
        foundRecords: result.data.length,
        isApproved: isApproved,
        firstRecord: result.data[0] || 'none'
      });
    }
    
    console.warn('🔍 Final approval status:', email, '=', isApproved);
    return isApproved;
  } catch (error) {
    console.error('🔍 Error checking user approval:', error);
    return false;
  }
};