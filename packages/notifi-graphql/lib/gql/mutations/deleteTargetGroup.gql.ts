import { gql } from 'graphql-request';

export const DeleteTargetGroup = gql`
  mutation deleteTargetGroup($id: String!) {
    deleteTargetGroup(targetGroupInput: { id: $id }) {
      id
    }
  }
`;
