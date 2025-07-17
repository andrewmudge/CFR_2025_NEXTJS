const { CognitoIdentityProviderClient, ListUsersCommand, AdminDeleteUserCommand } = require('@aws-sdk/client-cognito-identity-provider');

const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION || 'us-east-1' });
const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID || 'us-east-1_mGZAJvEz1';

exports.handler = async (event) => {
  console.log('=== Lambda Function Started ===');
  console.log('Event:', JSON.stringify(event, null, 2));
  console.log('Environment variables:', {
    AWS_REGION: process.env.AWS_REGION,
    COGNITO_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID
  });

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS'
  };

  // Handle GraphQL query (for AppSync)
  if (event.info && event.info.fieldName === 'listCognitoUsers') {
    console.log('GraphQL request detected');
    try {
      return await listCognitoUsers();
    } catch (error) {
      console.error('Error in listCognitoUsers:', error);
      throw error;
    }
  }

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    console.log('CORS preflight request');
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    console.log('Parsing request body...');
    const { action, username } = JSON.parse(event.body || '{}');
    console.log('Parsed action:', action, 'username:', username);

    switch (action) {
      case 'listUsers':
        console.log('Calling listUsers...');
        return await listUsers(headers);
      
      case 'deleteUser':
        console.log('Calling deleteUser...');
        return await deleteUser(username, headers);
      
      default:
        console.log('Invalid action:', action);
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid action' })
        };
    }
  } catch (error) {
    console.error('Error in main handler:', error);
    console.error('Error stack:', error.stack);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};

// GraphQL resolver for listCognitoUsers
const listCognitoUsers = async () => {
  try {
    let allUsers = [];
    let paginationToken = null;
    
    do {
      const command = new ListUsersCommand({
        UserPoolId: USER_POOL_ID,
        Limit: 60,
        ...(paginationToken && { PaginationToken: paginationToken })
      });

      const response = await cognitoClient.send(command);
      
      const users = response.Users.map(user => {
        const attributes = {};
        if (user.Attributes) {
          user.Attributes.forEach(attr => {
            attributes[attr.Name] = attr.Value;
          });
        }

        return {
          username: user.Username,
          email: attributes.email || '',
          givenName: attributes.given_name || '',
          familyName: attributes.family_name || '',
          phoneNumber: attributes.phone_number || '',
          userStatus: user.UserStatus,
          userCreateDate: user.UserCreateDate,
          enabled: user.Enabled
        };
      });

      allUsers = allUsers.concat(users);
      paginationToken = response.PaginationToken;
      
    } while (paginationToken);

    return allUsers;
  } catch (error) {
    console.error('Error listing users:', error);
    throw error;
  }
};

const listUsers = async (headers) => {
  console.log('=== listUsers function started ===');
  console.log('USER_POOL_ID:', USER_POOL_ID);
  
  try {
    console.log('Creating ListUsersCommand with pagination support...');
    
    let allUsers = [];
    let paginationToken = null;
    
    do {
      const command = new ListUsersCommand({
        UserPoolId: USER_POOL_ID,
        Limit: 60,
        ...(paginationToken && { PaginationToken: paginationToken })
      });

      console.log('Sending command to Cognito...');
      const response = await cognitoClient.send(command);
      console.log(`Cognito response received, processing ${response.Users.length} users...`);
      
      const users = response.Users.map(user => {
        const attributes = {};
        if (user.Attributes) {
          user.Attributes.forEach(attr => {
            attributes[attr.Name] = attr.Value;
          });
        }

        return {
          username: user.Username,
          email: attributes.email || '',
          givenName: attributes.given_name || '',
          familyName: attributes.family_name || '',
          phoneNumber: attributes.phone_number || '',
          userStatus: user.UserStatus,
          userCreateDate: user.UserCreateDate,
          enabled: user.Enabled
        };
      });

      allUsers = allUsers.concat(users);
      paginationToken = response.PaginationToken;
      
      console.log(`Added ${users.length} users, total so far: ${allUsers.length}`);
      if (paginationToken) {
        console.log('More users available, fetching next page...');
      }
      
    } while (paginationToken);

    console.log('All users processed successfully, total count:', allUsers.length);
    const result = {
      statusCode: 200,
      headers,
      body: JSON.stringify({ users: allUsers })
    };
    console.log('Returning result...');
    return result;
  } catch (error) {
    console.error('Error in listUsers:', error);
    console.error('Error stack:', error.stack);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};

const deleteUser = async (username, headers) => {
  if (!username) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Username is required' })
    };
  }

  try {
    const command = new AdminDeleteUserCommand({
      UserPoolId: USER_POOL_ID,
      Username: username
    });

    await cognitoClient.send(command);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, message: `User ${username} deleted successfully` })
    };
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};