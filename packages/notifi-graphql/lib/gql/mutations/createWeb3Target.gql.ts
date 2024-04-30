import { gql } from 'graphql-request';

import { Web3TargetFragment } from '../fragments/Web3TargetFragment.gql';

export const CreateWeb3Target = gql`
  mutation createWeb3Target($name: String!, $accountId: String!, $walletBlockchain: WalletBlockchain!, $web3TargetProtocol: Web3TargetProtocol!) {
    createWeb3Target(createWeb3TargetInput: { name: $name, accountId: $accountId, walletBlockchain: $walletBlockchain, protocol: $web3TargetProtocol }) {
      ...Web3TargetFragment
    }
  }
  ${Web3TargetFragment}
`;
