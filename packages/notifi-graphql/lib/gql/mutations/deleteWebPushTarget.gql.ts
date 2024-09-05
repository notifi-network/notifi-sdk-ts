import { gql } from 'graphql-request';

export const DeleteWebPushTarget = gql`
  mutation deleteWebPushTarget($id: String!) {
    deleteWebPushTarget(input: { id: $id }) {
      success
      errors {
        ... on TargetDoesNotExistError {
          message
        }
        ... on UnexpectedError {
          message
        }
      }
    }
  }
`;
