exports.handler = async (event) => {
  console.log('=== Lambda Function Started ===');
  console.log('Event:', JSON.stringify(event, null, 2));
  
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
    console.log('Checking AWS SDK availability...');
    
    // Test what's available
    let sdkInfo = {};
    
    try {
      console.log('Testing require @aws-sdk/client-cognito-identity-provider...');
      const cognitoModule = require('@aws-sdk/client-cognito-identity-provider');
      console.log('Module loaded successfully');
      console.log('Available exports:', Object.keys(cognitoModule));
      
      // Test specific imports
      const { CognitoIdentityProviderClient } = cognitoModule;
      console.log('CognitoIdentityProviderClient:', typeof CognitoIdentityProviderClient);
      
      const { AdminListUsersCommand } = cognitoModule;
      console.log('AdminListUsersCommand:', typeof AdminListUsersCommand);
      
      // Try to create instances
      const client = new CognitoIdentityProviderClient({ region: 'us-east-1' });
      console.log('Client created successfully');
      
      const command = new AdminListUsersCommand({
        UserPoolId: 'us-east-1_mGZAJvEz1',
        Limit: 1
      });
      console.log('Command created successfully');
      
      sdkInfo = {
        moduleLoaded: true,
        clientType: typeof CognitoIdentityProviderClient,
        commandType: typeof AdminListUsersCommand,
        clientCreated: true,
        commandCreated: true
      };
      
    } catch (error) {
      console.error('Error with AWS SDK:', error);
      sdkInfo = {
        moduleLoaded: false,
        error: error.message,
        stack: error.stack
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        sdkInfo,
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch
      })
    };
    
  } catch (error) {
    console.error('Error in main handler:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message, stack: error.stack })
    };
  }
};
