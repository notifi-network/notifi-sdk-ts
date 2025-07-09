import { NotifiService } from '@notifi-network/notifi-graphql';

import {
  BlockchainAuthStrategy,
  type LoginWeb3Params,
  SIGNING_MESSAGE,
  beginLogInWithWeb3,
} from '.';
import {
  type NotifiFrontendConfiguration,
  checkIsConfigWithDelegate,
  checkIsConfigWithPublicKeyAndAddress,
} from '../../configuration';
import { type CosmosBlockchain } from '../../models';

export class CosmosAuthStrategy implements BlockchainAuthStrategy {
  constructor(
    private service: NotifiService,
    private config: NotifiFrontendConfiguration,
  ) {}
  async authenticate(params: CosmosSignMessageParams) {
    const { signatureBase64, signedMessage } = await params.signMessage(
      params.message,
    );
    return { signature: signatureBase64, signedMessage };
  }
  async prepareLoginWithWeb3(params: LoginWeb3Params) {
    if (checkIsConfigWithDelegate(this.config)) {
      const { delegatedAddress, delegatedPublicKey, delegatorAddress } =
        this.config;
      const { nonce } = await beginLogInWithWeb3({
        service: this.service,
        config: this.config,
        authAddress: delegatorAddress,
        authType: 'COSMOS_AUTHZ_GRANT',
      });

      const signedMessage = `${SIGNING_MESSAGE}${nonce}`;
      return {
        signMessageParams: {
          walletBlockchain: params.walletBlockchain as CosmosBlockchain,
          message: signedMessage,
          signMessage: params.signMessage as CosmosSignMessageFunction,
        },
        signingAddress: delegatedAddress,
        signingPubkey: delegatedPublicKey,
        nonce,
      };
    } else if (checkIsConfigWithPublicKeyAndAddress(this.config)) {
      const { walletPublicKey, accountAddress } = this.config;
      const { nonce } = await beginLogInWithWeb3({
        service: this.service,
        config: this.config,
        authAddress: accountAddress,
        authType: 'COSMOS_ADR36',
      });
      const signedMessage = `${SIGNING_MESSAGE}${nonce}`;
      return {
        signMessageParams: {
          walletBlockchain: params.walletBlockchain as CosmosBlockchain,
          message: signedMessage,
          signMessage: params.signMessage as CosmosSignMessageFunction,
        },
        signingAddress: accountAddress,
        signingPubkey: walletPublicKey,
        nonce,
      };
    }
    throw new Error('Invalid Cosmos login parameters');
  }
}

export type CosmosSignMessageParams = Readonly<{
  walletBlockchain: CosmosBlockchain;
  message: string;
  signMessage: CosmosSignMessageFunction;
}>;

export type CosmosSignMessageFunction = (message: string) => Promise<{
  signatureBase64: string;
  signedMessage: string;
}>;
