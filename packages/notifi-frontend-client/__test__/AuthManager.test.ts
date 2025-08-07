import { Account, Ed25519PrivateKey } from '@aptos-labs/ts-sdk';
import { Secp256k1HdWallet, StdSignDoc } from '@cosmjs/amino';
import { arrayify } from '@ethersproject/bytes';
import { mnemonicToSeedHex } from '@mysten/sui/cryptography';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import {
  AuthManager,
  type EvmUserParams,
  type NotifiFrontendConfiguration,
  SolanaUserParams,
  Uint8SignMessageFunction,
} from '@notifi-network/notifi-frontend-client';
import bs58 from 'bs58';
import expect from 'expect';
import { AptosSignMessageFunction } from 'notifi-frontend-client/lib/client/auth/AptosAuthStrategy';
import { CosmosSignMessageFunction } from 'notifi-frontend-client/lib/client/auth/CosmosAuthStrategy';
import nacl from 'tweetnacl';

import {
  newNotifiService,
  newNotifiStorage,
} from '../lib/client/clientFactory';
import { dappAddress, getEvmConnectedWallet } from './constants';

describe('AuthManager Unit Test - Blockchain Auth Strategies', () => {
  beforeEach(() => {
    // Sleep 1 second to avoid rate limiting issues
    return new Promise((resolve) => setTimeout(resolve, 1000));
  });
  it('EvmAuthStrategy: ETHEREUM_PERSONAL_SIGN', async () => {
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

  it('SolanaAuthStrategy: SOLANA_SIGN_MESSAGE', async () => {
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

  it('CosmosAuthStrategy: COSMOS_ADR36', async () => {
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
  it('AptosAuthStrategy: APTOS_SIGN_MESSAGE', async () => {
    const blockchainType = 'APTOS';
    const derivationPath = "m/44'/637'/0'/0'/0'";
    const mnemonic =
      'belt purity enforce meadow peanut pupil ignore inform skill common connect source';
    const privateKey = Ed25519PrivateKey.fromDerivationPath(
      derivationPath,
      mnemonic,
    );
    const account = Account.fromPrivateKey({ privateKey });
    const accountAddress = account.accountAddress.toString(); // 0x40e30fd0c9ed22e94b166f7c7a91b593af9f8dd786408849d49531798a7c0a61
    const walletPublicKey = account.publicKey.toString(); // 0xabcbb8e52d832ce5d4d6d3df2fca23f0cd5778a446e458bec57d6bc16ce187e2

    const signMessage: AptosSignMessageFunction = async (message, nonce) => {
      // Note: https://github.com/aptos-labs/aptos-developer-discussions/discussions/180
      // Note: https://github.com/aptos-labs/wallet-standard/blob/12d18409479390d1b69c6e74c51a51d005ae6a5f/example/basic/wallet.ts#L368
      const messageToSign = `APTOS\naddress: ${account.accountAddress.toString()}\nmessage: ${message}\nnonce: ${nonce}`;
      /* ⬆ This is the format used by Notifi backend */
      const encodedMessageToSign = new TextEncoder().encode(messageToSign);
      const signature = account.sign(encodedMessageToSign);
      const signatureHex =
        `0x${Buffer.from(signature.toUint8Array()).toString('hex')}` as `0x${string}`;
      return {
        signatureHex,
        signedMessage: messageToSign,
      };
    };

    const config: NotifiFrontendConfiguration = {
      tenantId: dappAddress,
      walletBlockchain: blockchainType,
      accountAddress: accountAddress,
      walletPublicKey,
      storageOption: { driverType: 'InMemory' },
    };
    const service = newNotifiService(config);
    const storage = newNotifiStorage(config);
    const authManager = new AuthManager(service, storage, config);
    const userState = await authManager.logIn({
      signMessage,
      walletBlockchain: blockchainType,
    });
    expect(userState.authorization).toHaveProperty('token');
  });

  it('SuiAuthStrategy: SUI_SIGN_MESSAGE', async () => {
    const blockchainType = 'SUI';
    const mnemonic =
      'belt purity enforce meadow peanut pupil ignore inform skill common connect source';
    const seed = await mnemonicToSeedHex(mnemonic);
    const keypair = Ed25519Keypair.deriveKeypairFromSeed(seed);
    const accountAddress = keypair.getPublicKey().toSuiAddress(); // 0x46d6866f92b37fbd97f5bc6757c2bf98669c6bceceacdccd268dc0c863ab7592
    const config: NotifiFrontendConfiguration = {
      tenantId: dappAddress,
      walletBlockchain: blockchainType,
      walletPublicKey: accountAddress,
      accountAddress: accountAddress,
      storageOption: { driverType: 'InMemory' },
    };
    const service = newNotifiService(config);
    const storage = newNotifiStorage(config);
    const authManager = new AuthManager(service, storage, config);

    const signMessage: Uint8SignMessageFunction = async (message) => {
      const signedResult = await keypair.signPersonalMessage(message);
      return Buffer.from(signedResult.signature);
    };

    const userState = await authManager.logIn({
      signMessage,
      walletBlockchain: blockchainType,
    });
    expect(userState.authorization).toHaveProperty('token');
  });
});
