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
  checkIsConfigWithPublicKey,
  checkIsConfigWithPublicKeyAndAddress,
} from '../../configuration';
import { type CardanoBlockchain, isUsingCardanoBlockchain } from '../../models';

export class CardanoAuthStrategy implements BlockchainAuthStrategy {
  constructor(
    private service: NotifiService,
    private config: NotifiFrontendConfiguration,
  ) { }
  async authenticate(params: CardanoSignMessageParams) {
    const signedMessage = `${SIGNING_MESSAGE}${params.nonce}`;
    const messageBuffer = new TextEncoder().encode(signedMessage);
    const signedBuffer = await params.signMessage(messageBuffer);
    const signature = signedBuffer.toString();
    return { signature, signedMessage };
  }
  async prepareLoginWithWeb3(params: LoginWeb3Params) {
    if (
      !isUsingCardanoBlockchain(params) ||
      !checkIsConfigWithPublicKey(this.config)
    )
      throw new Error('CardanoAuthStrategy: Invalid Cardano login parameters');

    const { nonce } = await beginLogInWithWeb3({
      service: this.service,
      config: this.config,
      authAddress: this.config.walletPublicKey,
      authType: 'CARDANO_SIGN_MESSAGE',
    });
    return {
      signMessageParams: {
        walletBlockchain: params.walletBlockchain,
        nonce: nonce,
        signMessage: params.signMessage,
      },
      signingPubkey: this.config.walletPublicKey,
      signingAddress: this.config.walletPublicKey, // NOT REQUIRED for Cardano, can be empty string ''
      nonce,
    };
  }
}

export type CardanoSignMessageParams = Readonly<{
  walletBlockchain: CardanoBlockchain;
  nonce: string;
  signMessage: Uint8SignMessageFunction;
}>;
