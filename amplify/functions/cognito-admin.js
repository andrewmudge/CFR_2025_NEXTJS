const { CognitoIdentityProviderClient, AdminListUsersCommand, AdminDeleteUserCommand } = require('@aws-sdk/client-cognito-identity-provider');

const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });
const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS'
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const { action, username } = JSON.parse(event.body || '{}');

    switch (action) {
      case 'listUsers':
        return await listUsers(headers);
      
      case 'deleteUser':
        return await deleteUser(username, headers);
      
      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid action' })
        };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};

const listUsers = async (headers) => {
  try {
    const command = new AdminListUsersCommand({
      UserPoolId: USER_POOL_ID,
      Limit: 60 // Adjust as needed
    });

    const response = await cognitoClient.send(command);
    
    const users = response.Users.map(user => {
      const attributes = {};
      user.Attributes?.forEach(attr => {
        attributes[attr.Name] = attr.Value;
      });

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

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ users })
    };
  } catch (error) {
    console.error('Error listing users:', error);
    throw error;
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