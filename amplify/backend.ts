import { defineBackend } from '@aws-amplify/backend';
import { defineFunction } from '@aws-amplify/backend';
import { defineStorage } from '@aws-amplify/backend';

const uploadPhoto = defineFunction({
  name: 'uploadPhoto',
  entry: './functions/upload-photo.js'
});

const listPhotos = defineFunction({
  name: 'listPhotos', 
  entry: './functions/list-photos.js'
});

const photoStorage = defineStorage({
  name: 'photoStorage',
  access: (allow) => ({
    'photos/*': [
      allow.authenticated.to(['read', 'write']),
      allow.guest.to(['read'])
    ]
  })
});

export const backend = defineBackend({
  uploadPhoto,
  listPhotos,
  photoStorage
});