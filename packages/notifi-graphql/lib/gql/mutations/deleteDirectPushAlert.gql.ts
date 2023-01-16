import { gql } from 'graphql-request';

export const DeleteDirectPushAlert = gql`
  mutation deleteDirectPushAlert($input: DeleteDirectPushAlertInput!) {
    deleteDirectPushAlert(deleteDirectPushAlertInput: $input) {
      id
    }
  }
`;
