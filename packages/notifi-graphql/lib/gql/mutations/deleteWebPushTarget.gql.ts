import { gql } from 'graphql-request';

import { ErrorFragments } from '../fragments/ErrorFragments.gql';

export const DeleteWebPushTarget = gql`
  mutation deleteWebPushTarget($id: String!) {
    deleteWebPushTarget(input: { id: $id }) {
      success
      errors {
        ...TargetDoesNotExistErrorFragment
        ...UnexpectedErrorFragment
      }
    }
  }
  ${ErrorFragments}
`;
