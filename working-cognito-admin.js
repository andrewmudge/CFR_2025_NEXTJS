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

    // Import AWS SDK v3
    const { CognitoIdentityProviderClient, AdminListUsersCommand, AdminDeleteUserCommand } = require('@aws-sdk/client-cognito-identity-provider');
    const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION || 'us-east-1' });
    const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID || 'us-east-1_mGZAJvEz1';

    switch (action) {
      case 'listUsers':
        console.log('Calling listUsers...');
        return await listUsers(cognitoClient, USER_POOL_ID, headers);
      
      case 'deleteUser':
        console.log('Calling deleteUser...');
        return await deleteUser(cognitoClient, USER_POOL_ID, username, headers);
      
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

const listUsers = async (cognitoClient, USER_POOL_ID, headers) => {
  console.log('=== listUsers function started ===');
  console.log('USER_POOL_ID:', USER_POOL_ID);
  
  try {
    console.log('Creating AdminListUsersCommand...');
    const { AdminListUsersCommand } = require('@aws-sdk/client-cognito-identity-provider');
    const command = new AdminListUsersCommand({
      UserPoolId: USER_POOL_ID,
      Limit: 60
    });

    console.log('Sending command to Cognito...');
    const response = await cognitoClient.send(command);
    console.log('Cognito response received, processing users...');
    
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

    console.log('Users processed successfully, count:', users.length);
    const result = {
      statusCode: 200,
      headers,
      body: JSON.stringify({ users })
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

const deleteUser = async (cognitoClient, USER_POOL_ID, username, headers) => {
  if (!username) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Username is required' })
    };
  }

  try {
    const { AdminDeleteUserCommand } = require('@aws-sdk/client-cognito-identity-provider');
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
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
