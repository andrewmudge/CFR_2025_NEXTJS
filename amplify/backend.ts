import { defineBackend } from '@aws-amplify/backend';
import { defineFunction } from '@aws-amplify/backend';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { storage } from './storage/resource';
import { auth } from './auth/resource';

const uploadPhoto = defineFunction({
  name: 'uploadPhoto',
  entry: './functions/upload-photo.js'
});

const listPhotos = defineFunction({
  name: 'listPhotos', 
  entry: './functions/list-photos.js'
});



export const backend: any = defineBackend({
  auth,
  uploadPhoto,
  listPhotos,
  storage
});

// Grant storage access to functions
backend.uploadPhoto.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ['s3:PutObject', 's3:PutObjectAcl'],
    resources: [`${backend.storage.resources.bucket.bucketArn}/photos/*`]
  })
);

backend.listPhotos.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ['s3:GetObject', 's3:ListBucket'],
    resources: [
      backend.storage.resources.bucket.bucketArn,
      `${backend.storage.resources.bucket.bucketArn}/photos/*`
    ]
  })
);