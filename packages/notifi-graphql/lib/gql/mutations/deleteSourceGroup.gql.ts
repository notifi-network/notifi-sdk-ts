import { gql } from 'graphql-request';

export const DeleteSourceGroup = gql`
  mutation deleteSourceGroup($id: String!) {
    deleteSourceGroup(sourceGroupInput: { id: $id }) {
      id
    }
  }
`;
