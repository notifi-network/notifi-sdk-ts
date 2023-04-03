import {
  collectDependencies,
  makeParameterLessRequest,
} from '@notifi-network/notifi-axios-utils';
import { GetConnectedWalletsResult } from '@notifi-network/notifi-core';

import {
  connectedWalletFragment,
  connectedWalletFragmentDependencies,
} from '../fragments';

const DEPENDENCIES = [
  ...connectedWalletFragmentDependencies,
  connectedWalletFragment,
];

const QUERY = `
query getConnectedWallets {
  connectedWallet {
    ...connectedWalletFragment
  }
}
`.trim();

const getConnectedWalletsImpl =
  makeParameterLessRequest<GetConnectedWalletsResult>(
    collectDependencies(...DEPENDENCIES, QUERY),
    'connectedWallet',
  );

export default getConnectedWalletsImpl;
