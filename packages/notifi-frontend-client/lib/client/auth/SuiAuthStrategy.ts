import { NotifiService } from '@notifi-network/notifi-graphql';

import {
  BlockchainAuthStrategy,
  type LoginWeb3Params,
  SIGNING_MESSAGE,
  type Uint8SignMessageFunction,
  beginLogInWithWeb3,
} from '.';
import {
  type NotifiFrontendConfiguration,
  checkIsConfigWithPublicKeyAndAddress,
} from '../../configuration';
import { type SuiBlockchain, isUsingSuiBlockchain } from '../../models';

export class SuiAuthStrategy implements BlockchainAuthStrategy {
  constructor(
    private service: NotifiService,
    private config: NotifiFrontendConfiguration,
  ) {}
  async authenticate(params: SuiSignMessageParams) {
    const signedMessage = `${SIGNING_MESSAGE}${params.nonce}`;
    const messageBuffer = new TextEncoder().encode(signedMessage);
    const signedBuffer = await params.signMessage(messageBuffer);
    const signature = signedBuffer.toString();
    return { signature, signedMessage };
  }
  async prepareLoginWithWeb3(params: LoginWeb3Params) {
    if (
      !isUsingSuiBlockchain(params) ||
      !checkIsConfigWithPublicKeyAndAddress(this.config)
    )
      throw new Error('SuiAuthStrategy: Invalid SUI login parameters');

    const { nonce } = await beginLogInWithWeb3({
      service: this.service,
      config: this.config,
      authAddress: this.config.walletPublicKey,
      authType: 'SUI_SIGNED_MESSAGE',
    });
    return {
      signMessageParams: {
        walletBlockchain: params.walletBlockchain,
        nonce,
        signMessage: params.signMessage,
      },
      signingAddress: this.config.accountAddress,
      signingPubkey: this.config.walletPublicKey,
      nonce,
    };
  }
}

export type SuiSignMessageParams = Readonly<{
  walletBlockchain: SuiBlockchain;
  nonce: string;
  signMessage: Uint8SignMessageFunction;
}>;
