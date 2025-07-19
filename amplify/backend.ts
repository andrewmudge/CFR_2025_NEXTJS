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
  entry: './functions/cognito-admin.js'
});

export const backend = defineBackend({
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
      'cognito-idp:ListUsers',
      'cognito-idp:AdminDeleteUser',
      'cognito-idp:AdminGetUser'
    ],
    resources: [backend.auth.resources.userPool.userPoolArn]
  })
);

// Grant DynamoDB permissions to hosting service for Next.js API routes
backend.addOutput({
  custom: {
    userStatusTableName: backend.data.resources.tables["UserStatus"].tableName,
    userStatusTableArn: backend.data.resources.tables["UserStatus"].tableArn
  }
});

// Enable IAM authorization for the hosting service to access data
backend.data.resources.cfnResources.cfnGraphqlApi.additionalAuthenticationProviders = [
  {
    authenticationType: 'AWS_IAM'
  }
];
