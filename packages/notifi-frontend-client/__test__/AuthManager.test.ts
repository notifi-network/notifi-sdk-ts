import { Secp256k1HdWallet, StdSignDoc } from '@cosmjs/amino';
import { arrayify } from '@ethersproject/bytes';
import {
  AuthManager,
  type EvmUserParams,
  type NotifiFrontendConfiguration,
  SolanaUserParams,
} from '@notifi-network/notifi-frontend-client';
import bs58 from 'bs58';
import expect from 'expect';
import { CosmosSignMessageFunction } from 'notifi-frontend-client/lib/client/auth/CosmosAuthStrategy';
import nacl from 'tweetnacl';

import {
  newNotifiService,
  newNotifiStorage,
} from '../lib/client/clientFactory';
import { dappAddress, getEvmConnectedWallet } from './constants';

describe('AuthManager Unit Test', () => {
  it('ETHEREUM_PERSONAL_SIGN', async () => {
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

  it('SOLANA_SIGN_MESSAGE', async () => {
    /* Reference: https://solana.com/developers/cookbook/wallets/sign-message */
    const signer = nacl.sign.keyPair();
    const solUserParams: SolanaUserParams = {
      walletBlockchain: 'SOLANA',
      walletPublicKey: bs58.encode(signer.publicKey),
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
        const signature = nacl.sign.detached(message, signer.secretKey);
        return signature;
      },
      walletBlockchain: solUserParams.walletBlockchain,
    });
    expect(userState.authorization).toHaveProperty('token');
  });

  it('COSMOS_ADR36', async () => {
    const blockchainType = 'NIBIRU';
    const mnemonic =
      'belt purity enforce meadow peanut pupil ignore inform skill common connect source';
    const wallet = await Secp256k1HdWallet.fromMnemonic(mnemonic, {
      prefix: 'nibi',
    });
    const [account] = await wallet.getAccounts();
    const accountAddress = account.address; // nibi1tchml7k8sa88cu8yk6ae7gqsp9gwsgdya95g04
    const pubkeyBase64 = Buffer.from(account.pubkey).toString('base64');
    const config: NotifiFrontendConfiguration = {
      tenantId: dappAddress,
      walletBlockchain: blockchainType,
      walletPublicKey: pubkeyBase64, // 'Apihy5nw9dVDN5l2qhgYMVfG7KI3YSsqJz5oet3Hfibd',
      accountAddress: accountAddress,
      storageOption: { driverType: 'InMemory' },
    };
    const service = newNotifiService(config);
    const storage = newNotifiStorage(config);
    const authManager = new AuthManager(service, storage, config);

    const signMessage: CosmosSignMessageFunction = async (message) => {
      /* Reference: https://docs.cosmos.network/main/build/architecture/adr-036-arbitrary-signature */
      const base64Data = Buffer.from(message).toString('base64');
      const signDoc: StdSignDoc = {
        chain_id: '',
        account_number: '0',
        sequence: '0',
        fee: {
          gas: '0',
          amount: [],
        },
        msgs: [
          {
            type: 'sign/MsgSignData',
            value: {
              signer: accountAddress,
              data: base64Data,
            },
          },
        ],
        memo: '',
      };
      const signedResult = await wallet.signAmino(accountAddress, signDoc);
      const signature = signedResult.signature.signature;
      return {
        signatureBase64: signature,
        signedMessage: message,
      };
    };
    const userState = await authManager.logIn({
      signMessage,
      walletBlockchain: blockchainType,
    });
    expect(userState.authorization).toHaveProperty('token');
  });
});
