import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'photoStorage',
  access: (allow) => ({
    'public/*': [
      allow.authenticated.to(['get', 'write', 'delete', 'list']),
      allow.guest.to(['get', 'list'])
    ]
  })
});