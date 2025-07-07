// amplify/auth/resource.ts
import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: true  // Only email login
  },
  userAttributes: {
    email: { required: true, mutable: true },
    phoneNumber: { required: true, mutable: true },
    givenName: { required: true, mutable: true },
    familyName: { required: true, mutable: true }
  }
});
