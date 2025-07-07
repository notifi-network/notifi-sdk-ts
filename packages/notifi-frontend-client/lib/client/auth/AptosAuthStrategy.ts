import { NotifiService } from '@notifi-network/notifi-graphql';
import {
  NotifiFrontendConfiguration,
  checkIsConfigWithPublicKeyAndAddress,
} from 'notifi-frontend-client/lib/configuration';
import { AptosBlockchain } from 'notifi-frontend-client/lib/models';

import {
  BlockchainAuthStrategy,
  LoginWeb3Params,
  SIGNING_MESSAGE_WITHOUT_NONCE,
  beginLogInWithWeb3,
} from '.';

export class AptosAuthStrategy implements BlockchainAuthStrategy {
  constructor(
    private service: NotifiService,
    private config: NotifiFrontendConfiguration,
  ) {}
  async authenticate(params: AptosSignMessageParams) {
    const { signatureHex, signedMessage } = await params.signMessage(
      SIGNING_MESSAGE_WITHOUT_NONCE,
      params.nonce,
    );
    return { signature: signatureHex, signedMessage };
  }
  async prepareLoginWithWeb3(params: LoginWeb3Params) {
    if (checkIsConfigWithPublicKeyAndAddress(this.config)) {
      const { nonce } = await beginLogInWithWeb3({
        service: this.service,
        config: this.config,
        authAddress: this.config.accountAddress,
        authType: 'APTOS_SIGNED_MESSAGE',
        walletPubkey: this.config.walletPublicKey,
      });
      return {
        signMessageParams: {
          walletBlockchain: params.walletBlockchain as AptosBlockchain,
          nonce,
          signMessage: params.signMessage as AptosSignMessageFunction,
        },
        signingAddress: this.config.accountAddress,
        signingPubkey: this.config.walletPublicKey,
        nonce,
      };
    }
    throw new Error('Invalid Aptos login parameters');
  }
}

export type AptosSignMessageParams = Readonly<{
  walletBlockchain: AptosBlockchain;
  nonce: string;
  signMessage: AptosSignMessageFunction;
}>;

export type AptosSignMessageFunction = (
  message: string,
  nonce: string,
) => Promise<{
  signatureHex: `0x${string}`;
  signedMessage: string;
}>;
