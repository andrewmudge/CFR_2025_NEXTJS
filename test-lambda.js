exports.handler = async (event) => {
  console.log('=== Simple Test Function ===');
  console.log('Event:', JSON.stringify(event, null, 2));
  
  try {
    // Test if AWS SDK is available
    const { CognitoIdentityProviderClient } = require('@aws-sdk/client-cognito-identity-provider');
    console.log('AWS SDK v3 is available');
    
    const client = new CognitoIdentityProviderClient({ region: 'us-east-1' });
    console.log('Client created successfully');
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: 'AWS SDK v3 is working!' })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};
