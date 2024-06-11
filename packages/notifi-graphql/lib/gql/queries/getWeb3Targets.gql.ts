import { gql } from 'graphql-request';

import { GetWeb3TargetResponseFragment } from '../fragments/Web3TargetFragment.gql';

export const GetWeb3Targets = gql`
  query getWeb3Targets {
    web3Targets {
      ...GetWeb3TargetResponseFragment
    }
  }
  ${GetWeb3TargetResponseFragment}
`;
