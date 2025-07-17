exports.handler = async (event) => {
  console.log('=== Lambda Function Started ===');
  
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
    console.log('Testing AWS SDK module loading...');
    
    // Test module loading
    const cognitoModule = require('@aws-sdk/client-cognito-identity-provider');
    console.log('Module loaded successfully');
    
    // Log all available exports
    const exports = Object.keys(cognitoModule);
    console.log('Available exports:', exports);
    
    // Test each export type
    const exportTypes = {};
    exports.forEach(exp => {
      exportTypes[exp] = typeof cognitoModule[exp];
    });
    console.log('Export types:', exportTypes);
    
    // Test specific imports
    const { CognitoIdentityProviderClient, AdminListUsersCommand } = cognitoModule;
    console.log('CognitoIdentityProviderClient type:', typeof CognitoIdentityProviderClient);
    console.log('AdminListUsersCommand type:', typeof AdminListUsersCommand);
    
    // Test if they are functions/constructors
    console.log('CognitoIdentityProviderClient.prototype:', CognitoIdentityProviderClient.prototype);
    console.log('AdminListUsersCommand.prototype:', AdminListUsersCommand.prototype);
    
    // Try different ways to create the command
    let commandTest = {};
    
    try {
      // Method 1: Direct constructor
      const cmd1 = new AdminListUsersCommand({ UserPoolId: 'test', Limit: 1 });
      commandTest.directConstructor = 'success';
    } catch (e) {
      commandTest.directConstructor = e.message;
    }
    
    try {
      // Method 2: Call as function
      const cmd2 = AdminListUsersCommand({ UserPoolId: 'test', Limit: 1 });
      commandTest.functionCall = 'success';
    } catch (e) {
      commandTest.functionCall = e.message;
    }
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        moduleLoaded: true,
        exports: exports,
        exportTypes: exportTypes,
        clientType: typeof CognitoIdentityProviderClient,
        commandType: typeof AdminListUsersCommand,
        commandTest: commandTest,
        nodeVersion: process.version
      }, null, 2)
    };
    
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error.message, 
        stack: error.stack,
        nodeVersion: process.version
      })
    };
  }
};
