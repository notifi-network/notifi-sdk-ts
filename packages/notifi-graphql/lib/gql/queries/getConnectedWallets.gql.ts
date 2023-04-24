import { gql } from 'graphql-request';

import { ConnectedWalletFragment } from '../fragments/ConnectedWalletFragment.gql';

export const GetConnectedWallets = gql`
  query getConnectedWallets {
    connectedWallet {
      ...ConnectedWalletFragment
    }
  }
  ${ConnectedWalletFragment}
`;
