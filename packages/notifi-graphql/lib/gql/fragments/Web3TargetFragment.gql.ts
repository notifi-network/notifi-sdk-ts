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

export const GetWeb3TargetResponseFragment = gql`
  fragment GetWeb3TargetResponseFragment on Web3TargetsConnection {
    edges {
      cursor
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
    nodes {
      id
      name
      accountId
      walletBlockchain
      targetProtocol
      isConfirmed
    }
  }
`;
