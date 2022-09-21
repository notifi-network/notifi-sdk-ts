import { gql } from 'graphql-request';

export const DeleteAlert = gql`
  mutation deleteAlert($id: String!) {
    deleteAlert(alertId: $id) {
      id
    }
  }
`;
