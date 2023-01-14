import { gql } from 'graphql-request';

export const TenantConnectedWalletFragment = gql`
  fragment TenantConnectedWalletFragment on TenantConnectedWallet {
    address
    walletBlockchain
  }
`;
