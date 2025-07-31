import { NotifiService } from '@notifi-network/notifi-graphql';

import {
  BlockchainAuthStrategy,
  type LoginWeb3Params,
  SIGNING_MESSAGE_WITHOUT_NONCE,
  beginLogInWithWeb3,
} from '.';
import {
  NotifiFrontendConfiguration,
  checkIsConfigWithPublicKeyAndAddress,
} from '../../configuration';
import { AptosBlockchain, isUsingAptosBlockchain } from '../../models';

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
    if (
      !isUsingAptosBlockchain(params) ||
      !checkIsConfigWithPublicKeyAndAddress(this.config)
    )
      throw new Error('AptosAuthStrategy: Invalid Aptos login parameters');

    const { nonce } = await beginLogInWithWeb3({
      service: this.service,
      config: this.config,
      authAddress: this.config.accountAddress,
      authType: 'APTOS_SIGNED_MESSAGE',
      walletPubkey: this.config.walletPublicKey,
    });
    return {
      signMessageParams: {
        walletBlockchain: params.walletBlockchain,
        nonce,
        signMessage: params.signMessage,
      },
      signingAddress: this.config.accountAddress,
      signingPubkey: this.config.walletPublicKey, // REQUIRED for Aptos chains: must be the public key corresponding to the accountAddress
      nonce,
    };
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
