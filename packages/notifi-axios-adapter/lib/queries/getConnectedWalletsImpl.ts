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

const MUTATION = `
query getConnectedWallets {
  connectedWallet {
    ...connectedWalletFragment
  }
}
`.trim();

const getConnectedWalletsImpl =
  makeParameterLessRequest<GetConnectedWalletsResult>(
    collectDependencies(...DEPENDENCIES, MUTATION),
    'connectedWallet',
  );

export default getConnectedWalletsImpl;
