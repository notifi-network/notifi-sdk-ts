import { gql } from 'graphql-request';

export const DeleteUserAlert = gql`
  mutation deleteUserAlert($alertId: String!) {
    deleteUserAlert(alertId: $alertId) {
      id
    }
  }
`;
