import { defineData } from '@aws-amplify/backend';

export const data = defineData({
  authorizationModes: {
    defaultAuthorizationMode: 'userPool'
  },
  schema: `
    type ApprovedUser @model @auth(rules: [{ allow: private }]) {
      id: ID!
      email: String! @index(name: "byEmail")
      givenName: String!
      familyName: String!
      phoneNumber: String
      isActive: Boolean!
      approvedBy: String
      approvedDate: AWSDateTime
      createdDate: AWSDateTime!
    }
  `,
});