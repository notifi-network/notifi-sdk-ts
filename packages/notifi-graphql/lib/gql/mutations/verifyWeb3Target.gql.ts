import { gql } from 'graphql-request';

import { Web3TargetFragment } from '../fragments/Web3TargetFragment.gql';

export const verifyWeb3Target = gql`
  mutation verifyWeb3Target($web3TargetId: String!, $accountId: String!) {
    verifyWeb3Target(input: { web3TargetId: $web3TargetId, accountId: $accountId }) {
      ...Web3TargetFragment
    }
  }
  ${Web3TargetFragment}
`;
