import { NotifiService } from '@notifi-network/notifi-graphql';

import {
  BeginLogInByTransactionResult,
  CompleteLogInByTransactionInput,
  CompleteLogInByTransactionMutation,
  UserFragmentFragment,
  WalletBlockchain,
} from '../../notifi-graphql/lib/gql/generated';
import type { NotifiFrontendConfiguration } from './configuration/NotifiFrontendConfiguration';
import type { NotifiStorage } from './storage';
import { notNullOrEmpty } from './utils/notNullOrEmpty';

export type SignMessageFunction = (message: Uint8Array) => Promise<Uint8Array>;

type BeginLoginProps = {
  walletBlockchain: WalletBlockchain;
  walletPublicKey: string;
};

type CompleteLoginProps = {
  input: CompleteLogInByTransactionInput;
};

// Don't split this line into multiple lines due to some packagers or other build modules that
// modify the string literal, which then causes authentication to fail due to different strings
export const SIGNING_MESSAGE = `Sign in with Notifi \n\n    No password needed or gas is needed. \n\n    Clicking “Approve” only means you have proved this wallet is owned by you! \n\n    This request will not trigger any transaction or cost any gas fees. \n\n    Use of our website and service is subject to our terms of service and privacy policy. \n`;

export class NotifiFrontendClient {
  constructor(
    private _configuration: NotifiFrontendConfiguration,
    private _service: NotifiService,
    private _storage: NotifiStorage,
    private clientRandomUuid: string | null,
  ) {}

  async logIn({
    signMessage,
  }: Readonly<{ signMessage: SignMessageFunction }>): Promise<
    UserFragmentFragment | undefined
  > {
    const timestamp = Math.round(Date.now() / 1000);
    const signature = await this._signMessage({ signMessage, timestamp });

    const { walletPublicKey, dappAddress } = this._configuration;

    const result = await this._service.logInFromDapp({
      walletPublicKey,
      dappAddress,
      timestamp,
      signature,
    });

    await this._handleLogInResult(result.logInFromDapp);
    return result.logInFromDapp;
  }

  private async _signMessage({
    signMessage,
    timestamp,
  }: Readonly<{
    signMessage: SignMessageFunction;
    timestamp: number;
  }>): Promise<string> {
    const { walletPublicKey, dappAddress } = this._configuration;

    const messageBuffer = new TextEncoder().encode(
      `${SIGNING_MESSAGE} \n 'Nonce:' ${walletPublicKey}${dappAddress}${timestamp.toString()}`,
    );

    const signedBuffer = await signMessage(messageBuffer);
    const signature = Buffer.from(signedBuffer).toString('base64');
    return signature;
  }

  private async _handleLogInResult(
    user: UserFragmentFragment | undefined,
  ): Promise<void> {
    const authorization = user?.authorization;
    const saveAuthorizationPromise =
      authorization !== undefined
        ? this._storage.setAuthorization(authorization)
        : Promise.resolve();

    const roles = user?.roles;
    const saveRolesPromise =
      roles !== undefined
        ? this._storage.setRoles(roles.filter(notNullOrEmpty))
        : Promise.resolve();

    await Promise.all([saveAuthorizationPromise, saveRolesPromise]);
  }

  async beginLoginViaTransaction({
    walletBlockchain,
    walletPublicKey,
  }: BeginLoginProps): Promise<BeginLogInByTransactionResult> {
    const { dappAddress } = this._configuration;

    const result = await this._service.beginLogInByTransaction({
      walletAddress: walletPublicKey,
      walletBlockchain: walletBlockchain,
      dappAddress,
    });

    const nonce = result.beginLogInByTransaction.nonce;

    this.clientRandomUuid = await window.crypto.randomUUID();

    return { nonce };
  }

  async completeLoginViaTransaction({
    walletBlockchain,
    walletPublicKey,
    input,
  }: BeginLoginProps &
    CompleteLoginProps): Promise<CompleteLogInByTransactionMutation> {
    const { transactionSignature } = input;
    const { dappAddress } = this._configuration;

    if (this.clientRandomUuid == null) {
      throw new Error(
        'BeginLoginViaTransaction is required to be called first',
      );
    }

    const result = await this._service.completeLogInByTransaction({
      walletAddress: walletPublicKey,
      walletBlockchain: walletBlockchain,
      dappAddress,
      randomUuid: this.clientRandomUuid,
      transactionSignature,
    });

    await this._handleLogInResult(result.completeLogInByTransaction);

    return result;
  }
}
