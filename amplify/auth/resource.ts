import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  name: 'cfr-AuthUserPool-prod',
  loginWith: {
    email: true
  },
  userAttributes: {
    email: {
      required: true,
      mutable: true
    },
    phoneNumber: {
      required: true,
      mutable: true
    },
    givenName: {
      required: true,
      mutable: true
    },
    familyName: {
      required: true,
      mutable: true
    }
  }
});