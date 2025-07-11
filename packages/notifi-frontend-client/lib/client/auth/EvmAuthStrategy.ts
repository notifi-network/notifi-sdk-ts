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
} from '../../configuration';
import { type EvmBlockchain } from '../../models';
import { normalizeHexString } from '../../utils';

export class EvmAuthStrategy implements BlockchainAuthStrategy {
  constructor(
    private service: NotifiService,
    private config: NotifiFrontendConfiguration,
  ) {}
  async authenticate(params: EvmSignMessageParams) {
    const signedMessage = `${SIGNING_MESSAGE}${params.nonce}`;
    const messageBuffer = new TextEncoder().encode(signedMessage);
    const signedBuffer = await params.signMessage(messageBuffer);
    const signature = normalizeHexString(
      Buffer.from(signedBuffer).toString('hex'),
    );
    return { signature, signedMessage };
  }
  async prepareLoginWithWeb3(params: LoginWeb3Params) {
    if (checkIsConfigWithPublicKey(this.config)) {
      const { nonce } = await beginLogInWithWeb3({
        service: this.service,
        config: this.config,
        authAddress: this.config.walletPublicKey,
        authType: 'ETHEREUM_PERSONAL_SIGN',
      });
      return {
        signMessageParams: {
          walletBlockchain: params.walletBlockchain as EvmBlockchain,
          nonce,
          signMessage: params.signMessage as Uint8SignMessageFunction,
        },
        signingAddress: this.config.walletPublicKey,
        signingPubkey: this.config.walletPublicKey,
        nonce,
      };
    }
    throw new Error('Invalid EVM login parameters');
  }
}

export type EvmSignMessageParams = Readonly<{
  walletBlockchain: EvmBlockchain;
  nonce: string;
  signMessage: Uint8SignMessageFunction;
}>;
