import { NotifiService } from '@notifi-network/notifi-graphql';

import {
  type BlockchainAuthStrategy,
  type LoginWeb3Params,
  SIGNING_MESSAGE,
  type Uint8SignMessageFunction,
  beginLogInWithWeb3,
} from '.';
import {
  type NotifiFrontendConfiguration,
  checkIsConfigWithPublicKey,
} from '../../configuration';
import { SolanaBlockchain, isUsingSolanaBlockchain } from '../../models';

export class SolanaAuthStrategy implements BlockchainAuthStrategy {
  constructor(
    private service: NotifiService,
    private config: NotifiFrontendConfiguration,
  ) {}
  async authenticate(params: SolanaSignMessageParams) {
    const signedMessage = `${SIGNING_MESSAGE}${params.nonce}`;
    const messageBuffer = new TextEncoder().encode(signedMessage);
    const signature =
      params.isUsingHardwareWallet && params.hardwareLoginPlugin
        ? await params.hardwareLoginPlugin.signTransaction(params.nonce)
        : await params.signMessage(messageBuffer);
    if (typeof signature === 'string') {
      /* CASE1: Hardware wallet (signTransaction returns a string) */
      return { signature, signedMessage };
    }
    /* CASE2: Software wallet (signMessage returns a Uint8Array) */
    const stringifiedSignature = Buffer.from(signature).toString('base64');
    return { signature: stringifiedSignature, signedMessage };
  }
  async prepareLoginWithWeb3(params: LoginWeb3Params) {
    if (
      !isUsingSolanaBlockchain(params) ||
      !checkIsConfigWithPublicKey(this.config)
    )
      throw new Error('SolanaAuthStrategy: Invalid Solana login parameters');

    const { isUsingHardwareWallet, hardwareLoginPlugin } =
      params as SolanaSignMessageParams;
    const { nonce } =
      isUsingHardwareWallet && hardwareLoginPlugin
        ? await beginLogInWithWeb3({
            service: this.service,
            config: this.config,
            walletPubkey: this.config.walletPublicKey,
            authType: 'SOLANA_HARDWARE_SIGN_MESSAGE',
            authAddress: this.config.walletPublicKey,
          })
        : await beginLogInWithWeb3({
            service: this.service,
            config: this.config,
            walletPubkey: this.config.walletPublicKey,
            authType: 'SOLANA_SIGN_MESSAGE',
            authAddress: this.config.walletPublicKey,
          });

    return {
      signMessageParams: {
        walletBlockchain: params.walletBlockchain,
        nonce,
        isUsingHardwareWallet,
        hardwareLoginPlugin,
        signMessage: params.signMessage,
      },
      signingAddress: this.config.walletPublicKey,
      signingPubkey: this.config.walletPublicKey,
      nonce,
    };
  }
}

export type SolanaSignMessageParams = Readonly<{
  walletBlockchain: SolanaBlockchain;
  nonce: string;
  signMessage: Uint8SignMessageFunction;
  isUsingHardwareWallet?: boolean;
  hardwareLoginPlugin?: {
    signTransaction: (message: string) => Promise<string>;
  };
}>;
