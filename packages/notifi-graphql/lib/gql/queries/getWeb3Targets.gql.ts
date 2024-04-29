import { gql } from 'graphql-request';

import { Web3TargetFragment } from '../fragments/Web3TargetFragment.gql';

export const GetWeb3Targets = gql`
  query getWeb3Targets {
    web3Targets {
      nodes {
        ...Web3TargetFragment
      }
    }
  }
  ${Web3TargetFragment}
`;
