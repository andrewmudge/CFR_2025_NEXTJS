exports.handler = async (event) => {
  console.log('=== AWS SDK v3 Test Function ===');
  console.log('Event:', JSON.stringify(event, null, 2));
  
  try {
    // Test AWS SDK v3 import
    console.log('Attempting to import AWS SDK v3...');
    const { CognitoIdentityProviderClient } = require('@aws-sdk/client-cognito-identity-provider');
    console.log('✅ AWS SDK v3 import successful');
    
    // Test client creation
    console.log('Creating Cognito client...');
    const client = new CognitoIdentityProviderClient({ region: 'us-east-1' });
    console.log('✅ Cognito client created successfully');
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        success: true,
        message: 'AWS SDK v3 is working!',
        sdkVersion: 'v3'
      })
    };
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Error stack:', error.stack);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        success: false,
        error: error.message,
        stack: error.stack
      })
    };
  }
};
