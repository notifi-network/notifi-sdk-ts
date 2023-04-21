import { gql } from 'graphql-request';

export const ConnectedWalletFragment = gql`
  fragment ConnectedWalletFragment on ConnectedWallet {
    address
    walletBlockchain
  }
`;
