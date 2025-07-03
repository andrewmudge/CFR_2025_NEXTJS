const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const s3 = new AWS.S3();
const BUCKET_NAME = process.env.S3_BUCKET_NAME;

exports.handler = async (event) => {
  try {
    const { fileName, fileType, fileData, year, metadata } = JSON.parse(event.body);
    
    const fileExtension = fileName.split('.').pop();
    const photoId = uuidv4();
    const s3Key = `photos/${year}/${photoId}.${fileExtension}`;
    
    // Upload image to S3
    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: s3Key,
      Body: Buffer.from(fileData, 'base64'),
      ContentType: fileType,
      Metadata: {
        caption: metadata.caption,
        uploader: metadata.uploader,
        date: metadata.date,
        year: year.toString(),
        originalName: fileName
      }
    };
    
    await s3.upload(uploadParams).promise();
    
    // Generate public URL
    const photoUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${s3Key}`;
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({
        success: true,
        photo: {
          id: photoId,
          url: photoUrl,
          caption: metadata.caption,
          uploader: metadata.uploader,
          date: metadata.date,
          year: parseInt(year)
        }
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};