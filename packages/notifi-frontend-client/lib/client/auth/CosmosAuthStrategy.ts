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
import { type CosmosBlockchain, isUsingCosmosBlockchain } from '../../models';

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
    if (!isUsingCosmosBlockchain(params))
      throw new Error('CosmosAuthStrategy: Invalid Cosmos login parameters');

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
          walletBlockchain: params.walletBlockchain,
          message: signedMessage,
          signMessage: params.signMessage,
        },
        signingAddress: delegatedAddress,
        signingPubkey: delegatedPublicKey,
        nonce,
      };
    }

    if (checkIsConfigWithPublicKeyAndAddress(this.config)) {
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
          walletBlockchain: params.walletBlockchain,
          message: signedMessage,
          signMessage: params.signMessage,
        },
        signingAddress: accountAddress,
        signingPubkey: walletPublicKey, // REQUIRED for Cosmos: must be the public key corresponding to the accountAddress
        nonce,
      };
    }

    throw new Error('CosmosAuthStrategy: Invalid Configuration');
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
