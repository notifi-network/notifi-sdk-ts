import { arrayify } from '@ethersproject/bytes';
import {
  AuthManager,
  type EvmUserParams,
  type NotifiFrontendConfiguration,
  envUrl,
} from '@notifi-network/notifi-frontend-client';
import { ethers } from 'ethers';
import expect from 'expect';

import {
  newNotifiService,
  newNotifiStorage,
} from '../lib/client/clientFactory';

describe('AuthManager Unit Test', () => {
  beforeEach(() => {});

  it('login - EVM', async () => {
    const blockchainType = 'ETHEREUM';
    const wallet = ethers.Wallet.createRandom();
    wallet.connect(new ethers.JsonRpcProvider(envUrl()));
    const evmUserParams: EvmUserParams = {
      walletBlockchain: blockchainType,
      walletPublicKey: wallet.address,
    };
    const config: NotifiFrontendConfiguration = {
      tenantId: dappAddress,
      walletBlockchain: evmUserParams.walletBlockchain,
      walletPublicKey: evmUserParams.walletPublicKey.toLowerCase(),
      storageOption: { driverType: 'InMemory' },
    };
    const service = newNotifiService(config);
    const storage = newNotifiStorage(config);
    const authManager = new AuthManager(service, storage, config);
    const userState = await authManager.logIn({
      signMessage: async (message: Uint8Array) => {
        const signature = await wallet.signMessage(message);
        return arrayify(signature);
      },
      walletBlockchain: blockchainType,
    });
    expect(userState.authorization).toHaveProperty('token');
  });
});

/* ⬇ Unit Test exclusive tenant: notifi.network.unitest */
const dappAddress = 'xdjczkhmgann9g24871z';
