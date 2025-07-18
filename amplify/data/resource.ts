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

    type UserStatus @model @auth(rules: [{ allow: private }]) {
      id: ID!
      email: String! @index(name: "byEmail")
      cognitoUsername: String!
      status: String! # 'pending', 'approved', 'denied'
      givenName: String!
      familyName: String!
      phoneNumber: String
      registrationDate: AWSDateTime!
      approvalDate: AWSDateTime
      denialDate: AWSDateTime
      denialReason: String
      approvedBy: String
    }

    type CognitoUser {
      username: String!
      email: String!
      givenName: String
      familyName: String
      phoneNumber: String
      userStatus: String!
      userCreateDate: AWSDateTime
      enabled: Boolean!
    }

    type Query {
      listCognitoUsers: [CognitoUser] @function(name: "cognitoAdmin") @auth(rules: [{ allow: private }])
    }
  `,
});