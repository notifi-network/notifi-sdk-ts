import { gql } from 'graphql-request';

import { Web3TargetFragment } from '../fragments/Web3TargetFragment.gql';

export const DeleteWeb3Target = gql`
  mutation deleteWeb3Target($id: String!) {
    deleteWeb3Target(deleteTargetInput: { id: $id }) {
      ...Web3TargetFragment
    }
  }
  ${Web3TargetFragment}
`;
