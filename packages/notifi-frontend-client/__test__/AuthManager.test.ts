import { Account, Ed25519PrivateKey } from '@aptos-labs/ts-sdk';
import { Secp256k1HdWallet, StdSignDoc } from '@cosmjs/amino';
import * as CardanoMessage from '@emurgo/cardano-message-signing-nodejs';
import * as CardanoWasm from '@emurgo/cardano-serialization-lib-nodejs';
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
import * as bip39 from 'bip39';
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

// Helper function for BIP32 hardened derivation
function harden(num: number): number {
  return 0x80000000 + num;
}

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

  it.only('CardanoAuthStrategy: CARDANO_SIGN_MESSAGE', async () => {
    /* Reference: https://cips.cardano.org/cip/CIP-30 */
    const blockchainType = 'CARDANO';
    const mnemonic =
      'gas bulb motion certain stairs behave job amazing hip neutral burden enforce seminar wealth cram dignity month water govern witness leave duck panel deal';

    // Derive Cardano wallet from mnemonic using BIP39 and Cardano derivation path
    // Standard Cardano derivation paths:
    //   Account:  m/1852'/1815'/0'
    //   Payment:  m/1852'/1815'/0'/0/0
    //   Staking:  m/1852'/1815'/0'/2/0
    const entropy = bip39.mnemonicToEntropy(mnemonic);
    const rootKey = CardanoWasm.Bip32PrivateKey.from_bip39_entropy(
      Buffer.from(entropy, 'hex'),
      Buffer.from(''),
    );

    // Derive account key (m/1852'/1815'/0')
    const accountKey = rootKey
      .derive(harden(1852)) // purpose
      .derive(harden(1815)) // coin_type (ADA)
      .derive(harden(0)); // account

    // Derive payment key (m/1852'/1815'/0'/0/0)
    const paymentKey = accountKey
      .derive(0) // external chain
      .derive(0); // address index

    const paymentPublicKey = paymentKey.to_public();
    const paymentKeyHash = paymentPublicKey.to_raw_key().hash();

    // Derive stake key (m/1852'/1815'/0'/2/0)
    const stakeKey = accountKey
      .derive(2) // staking chain
      .derive(0); // address index

    const stakePublicKey = stakeKey.to_public();
    const stakeKeyHash = stakePublicKey.to_raw_key().hash();

    // Build BaseAddress with both payment and stake credentials (Mainnet)
    const baseAddr = CardanoWasm.BaseAddress.new(
      CardanoWasm.NetworkInfo.mainnet().network_id(),
      CardanoWasm.Credential.from_keyhash(paymentKeyHash),
      CardanoWasm.Credential.from_keyhash(stakeKeyHash),
    );

    const address = baseAddr.to_address().to_bech32();

    // Construct COSE_Key Lace wallet format)
    // a5                         # map(5)
    //   01 01                    # 1: 1 (kty = OKP)
    //   02 5839 <address>        # 2: bytes(57) = address (key ID)
    //   03 27                    # 3: -8 (alg = EdDSA)
    //   20 06                    # -1: 6 (crv = Ed25519)
    //   21 5820 <pubkey>         # -2: bytes(32) = public key
    const addressBytes = baseAddr.to_address().to_bytes();
    const publicKeyBytes = paymentPublicKey.to_raw_key().as_bytes();

    const coseKeyParts = [];
    coseKeyParts.push(Buffer.from('a5', 'hex')); // map(5)
    coseKeyParts.push(Buffer.from('0101', 'hex')); // 1: 1 (kty = OKP)
    coseKeyParts.push(Buffer.from('025839', 'hex')); // 2: bytes(57)
    coseKeyParts.push(Buffer.from(addressBytes)); // address bytes (key ID)
    coseKeyParts.push(Buffer.from('0327', 'hex')); // 3: -8 (alg = EdDSA)
    coseKeyParts.push(Buffer.from('2006', 'hex')); // -1: 6 (crv = Ed25519)
    coseKeyParts.push(Buffer.from('215820', 'hex')); // -2: bytes(32)
    coseKeyParts.push(Buffer.from(publicKeyBytes)); // public key bytes

    const coseKeyHex = Buffer.concat(coseKeyParts).toString('hex');

    const config: NotifiFrontendConfiguration = {
      tenantId: dappAddress,
      walletBlockchain: blockchainType,
      walletPublicKey: address,
      storageOption: { driverType: 'InMemory' },
    };
    const service = newNotifiService(config);
    const storage = newNotifiStorage(config);
    const authManager = new AuthManager(service, storage, config);

    const signMessage: Uint8SignMessageFunction = async (message) => {
      const protectedHeaders = CardanoMessage.HeaderMap.new();
      protectedHeaders.set_algorithm_id(
        CardanoMessage.Label.from_algorithm_id(
          CardanoMessage.AlgorithmId.EdDSA,
        ),
      );
      protectedHeaders.set_key_id(baseAddr.to_address().to_bytes());
      protectedHeaders.set_header(
        CardanoMessage.Label.new_text('address'),
        CardanoMessage.CBORValue.new_bytes(baseAddr.to_address().to_bytes()),
      );
      const protectedSerialized =
        CardanoMessage.ProtectedHeaderMap.new(protectedHeaders);

      const unprotectedHeaders = CardanoMessage.HeaderMap.new();
      unprotectedHeaders.set_header(
        CardanoMessage.Label.new_text('hashed'),
        CardanoMessage.CBORValue.new_special(
          CardanoMessage.CBORSpecial.new_bool(false),
        ),
      );

      const headers = CardanoMessage.Headers.new(
        protectedSerialized,
        unprotectedHeaders,
      );

      const signStructure = CardanoMessage.COSESign1Builder.new(
        headers,
        message,
        false,
      );

      const toSign = signStructure.make_data_to_sign().to_bytes();
      const signedSigStruct = paymentKey.to_raw_key().sign(toSign).to_bytes();
      const coseSign1 = signStructure.build(signedSigStruct);
      const signature = Buffer.from(coseSign1.to_bytes()).toString('hex');
      const combinedSignature = `${signature}:${coseKeyHex}`;
      return new TextEncoder().encode(combinedSignature);
    };

    const userState = await authManager.logIn({
      signMessage,
      walletBlockchain: blockchainType,
    });

    expect(userState.authorization).toHaveProperty('token');
  });
});
