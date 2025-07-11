import { arrayify } from '@ethersproject/bytes';
import {
  AuthManager,
  type EvmUserParams,
  type NotifiFrontendConfiguration,
  SolanaUserParams,
} from '@notifi-network/notifi-frontend-client';
import { Keypair } from '@solana/web3.js';
import { generateKeyPairSync } from 'crypto';
import expect from 'expect';
import nacl from 'tweetnacl';

import {
  newNotifiService,
  newNotifiStorage,
} from '../lib/client/clientFactory';
import { dappAddress, getEvmConnectedWallet } from './constants';

describe('AuthManager Unit Test', () => {
  it('login - EVM', async () => {
    const blockchainType = 'ETHEREUM';
    const wallet = getEvmConnectedWallet();
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

  it('login - SOLANA', async () => {
    /* Reference: https://solana.com/developers/cookbook/wallets/sign-message */
    const signer = Keypair.generate();

    const solUserParams: SolanaUserParams = {
      walletBlockchain: 'SOLANA',
      walletPublicKey: signer.publicKey.toBase58(),
    };

    const config: NotifiFrontendConfiguration = {
      tenantId: dappAddress,
      walletBlockchain: solUserParams.walletBlockchain,
      walletPublicKey: solUserParams.walletPublicKey,
      storageOption: { driverType: 'InMemory' },
    };

    const service = newNotifiService(config);
    const storage = newNotifiStorage(config);
    const authManager = new AuthManager(service, storage, config);
    const userState = await authManager.logIn({
      signMessage: async (message: Uint8Array) => {
        // const signature = await signBytes(signer.keyPair.privateKey, message);
        const signature = nacl.sign.detached(message, signer.secretKey);
        return signature;
      },
      walletBlockchain: solUserParams.walletBlockchain,
    });
    expect(userState.authorization).toHaveProperty('token');
  });
});
