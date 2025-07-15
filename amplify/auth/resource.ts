import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
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
    },
    // Add custom attribute for approval status
    'custom:isApproved': {
      dataType: 'String',
      mutable: true
    }
  }
});