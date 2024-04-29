import { gql } from 'graphql-request';

export const Web3TargetFragment = gql`
  fragment Web3TargetFragment on Web3Target {
    id
    name
    accountId
    walletBlockchain
    targetProtocol
    isConfirmed
  }
`;
