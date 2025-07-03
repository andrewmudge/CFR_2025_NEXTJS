const AWS = require('aws-sdk');

const s3 = new AWS.S3();
const BUCKET_NAME = process.env.S3_BUCKET_NAME;

exports.handler = async (event) => {
  try {
    const year = event.queryStringParameters?.year;
    
    if (!year) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Year parameter required' })
      };
    }

    const listParams = {
      Bucket: BUCKET_NAME,
      Prefix: `photos/${year}/`,
    };

    const data = await s3.listObjectsV2(listParams).promise();
    
    // Get metadata for each photo
    const photos = await Promise.all(
      data.Contents.map(async (object) => {
        const headParams = {
          Bucket: BUCKET_NAME,
          Key: object.Key,
        };
        
        const metadata = await s3.headObject(headParams).promise();
        const photoId = object.Key.split('/').pop().split('.')[0];
        
        return {
          id: photoId,
          url: `https://${BUCKET_NAME}.s3.amazonaws.com/${object.Key}`,
          caption: metadata.Metadata.caption || '',
          uploader: metadata.Metadata.uploader || '',
          date: metadata.Metadata.date || '',
          year: parseInt(metadata.Metadata.year || year)
        };
      })
    );

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify(photos)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: error.message })
    };
  }
};