import { defineBackend } from '@aws-amplify/backend';
import { defineFunction } from '@aws-amplify/backend';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { storage } from './storage/resource';
import { auth } from './auth/resource';
import { data } from './data/resource';

const uploadPhoto = defineFunction({
  name: 'uploadPhoto',
  entry: './functions/upload-photo.js',
  resourceGroupName: 'storage'
});

const listPhotos = defineFunction({
  name: 'listPhotos', 
  entry: './functions/list-photos.js',
  resourceGroupName: 'storage'
});

const cognitoAdmin = defineFunction({
  name: 'cognitoAdmin',
  entry: './functions/cognito-admin.js',
  resourceGroupName: 'auth'
});





export const backend: any = defineBackend({
  auth,
  data,
  uploadPhoto,
  listPhotos,
  storage,
  cognitoAdmin
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

// Grant Cognito admin permissions
backend.cognitoAdmin.addEnvironment('COGNITO_USER_POOL_ID', backend.auth.resources.userPool.userPoolId);

backend.cognitoAdmin.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: [
      'cognito-idp:AdminListUsers',
      'cognito-idp:AdminDeleteUser',
      'cognito-idp:AdminGetUser'
    ],
    resources: [backend.auth.resources.userPool.userPoolArn]
  })
);





