import type { Types } from '@notifi-network/notifi-graphql';
import { NotifiService } from '@notifi-network/notifi-graphql';

import { EnsureSourceParams, ensureSourceGroup } from './client/ensureSource';
import {
  ensureEmail,
  ensureSms,
  ensureTelegram,
  ensureWebhook,
} from './client/ensureTarget';
import type { NotifiFrontendConfiguration } from './configuration/NotifiFrontendConfiguration';
import type { NotifiStorage } from './storage';
import { notNullOrEmpty } from './utils/notNullOrEmpty';

export type SignMessageFunction = (message: Uint8Array) => Promise<Uint8Array>;

type BeginLoginProps = Omit<Types.BeginLogInByTransactionInput, 'dappAddress'>;

type CompleteLoginProps = Omit<
  Types.CompleteLogInByTransactionInput,
  'dappAddress' | 'randomUuid'
>;

type EnsureWebhookParams = Omit<
  Types.CreateWebhookTargetMutationVariables,
  'name'
>;

// Don't split this line into multiple lines due to some packagers or other build modules that
// modify the string literal, which then causes authentication to fail due to different strings
export const SIGNING_MESSAGE = `Sign in with Notifi \n\n    No password needed or gas is needed. \n\n    Clicking “Approve” only means you have proved this wallet is owned by you! \n\n    This request will not trigger any transaction or cost any gas fees. \n\n    Use of our website and service is subject to our terms of service and privacy policy. \n`;

export class NotifiFrontendClient {
  constructor(
    private _configuration: NotifiFrontendConfiguration,
    private _service: NotifiService,
    private _storage: NotifiStorage,
    private _clientRandomUuid: string | null = null,
  ) {}

  async logIn({
    signMessage,
  }: Readonly<{ signMessage: SignMessageFunction }>): Promise<
    Types.UserFragmentFragment | undefined
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
    user: Types.UserFragmentFragment | undefined,
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
    walletAddress,
  }: BeginLoginProps): Promise<Types.BeginLogInByTransactionResult> {
    const { dappAddress } = this._configuration;

    const result = await this._service.beginLogInByTransaction({
      walletAddress: walletAddress,
      walletBlockchain: walletBlockchain,
      dappAddress,
    });

    const nonce = result.beginLogInByTransaction.nonce;

    if (nonce === null) {
      throw new Error('Failed to begin login process');
    }

    const ruuid = crypto.randomUUID();
    this._clientRandomUuid = ruuid;
    const encoder = new TextEncoder();
    const data = encoder.encode(nonce + ruuid);

    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const logValue =
      'Notifi Auth: 0x' +
      hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    return { nonce: logValue };
  }

  async completeLoginViaTransaction({
    walletBlockchain,
    walletAddress,
    transactionSignature,
  }: CompleteLoginProps): Promise<Types.CompleteLogInByTransactionMutation> {
    const { dappAddress } = this._configuration;
    const clientRandomUuid = this._clientRandomUuid;

    this._clientRandomUuid = null;

    if (clientRandomUuid === null) {
      throw new Error(
        'BeginLoginViaTransaction is required to be called first',
      );
    }

    const result = await this._service.completeLogInByTransaction({
      walletAddress: walletAddress,
      walletBlockchain: walletBlockchain,
      dappAddress,
      randomUuid: clientRandomUuid,
      transactionSignature,
    });

    await this._handleLogInResult(result.completeLogInByTransaction);

    return result;
  }

  async getTargetGroups(): Promise<
    ReadonlyArray<Types.TargetGroupFragmentFragment>
  > {
    const query = await this._service.getTargetGroups({});
    const results = query.targetGroup?.filter(notNullOrEmpty) ?? [];
    return results;
  }

  async ensureTargetGroup({
    name,
    emailAddress,
    phoneNumber,
    telegramId,
    webhook,
  }: Readonly<{
    name: string;
    emailAddress?: string;
    phoneNumber?: string;
    telegramId?: string;
    webhook?: EnsureWebhookParams;
  }>): Promise<Types.TargetGroupFragmentFragment> {
    const [
      targetGroupsQuery,
      emailTargetId,
      smsTargetId,
      telegramTargetId,
      webhookTargetId,
    ] = await Promise.all([
      this._service.getTargetGroups({}),
      ensureEmail(this._service, emailAddress),
      ensureSms(this._service, phoneNumber),
      ensureTelegram(this._service, telegramId),
      ensureWebhook(this._service, webhook),
    ]);

    const emailTargetIds = emailTargetId === undefined ? [] : [emailTargetId];
    const smsTargetIds = smsTargetId === undefined ? [] : [smsTargetId];
    const telegramTargetIds =
      telegramTargetId === undefined ? [] : [telegramTargetId];
    const webhookTargetIds =
      webhookTargetId === undefined ? [] : [webhookTargetId];

    const existing = targetGroupsQuery.targetGroup?.find(
      (it) => it?.name === name,
    );
    if (existing !== undefined) {
      return this._updateTargetGroup({
        existing,
        emailTargetIds,
        smsTargetIds,
        telegramTargetIds,
        webhookTargetIds,
      });
    }

    const createMutation = await this._service.createTargetGroup({
      name,
      emailTargetIds,
      smsTargetIds,
      telegramTargetIds,
      webhookTargetIds,
    });

    if (createMutation.createTargetGroup === undefined) {
      throw new Error('Failed to create target group');
    }

    return createMutation.createTargetGroup;
  }

  private async _updateTargetGroup({
    existing,
    emailTargetIds,
    smsTargetIds,
    telegramTargetIds,
    webhookTargetIds,
  }: Readonly<{
    existing: Types.TargetGroupFragmentFragment;
    emailTargetIds: Array<string>;
    smsTargetIds: Array<string>;
    telegramTargetIds: Array<string>;
    webhookTargetIds: Array<string>;
  }>): Promise<Types.TargetGroupFragmentFragment> {
    const areTargetsEqual = <T extends Readonly<{ id: string }>>(
      ids: ReadonlyArray<string>,
      targets: ReadonlyArray<T | undefined>,
    ): boolean => {
      const idSet = new Set(ids);
      return targets.every((it) => it !== undefined && idSet.has(it.id));
    };

    if (
      areTargetsEqual(emailTargetIds, existing.emailTargets ?? []) &&
      areTargetsEqual(smsTargetIds, existing.smsTargets ?? []) &&
      areTargetsEqual(telegramTargetIds, existing.telegramTargets ?? []) &&
      areTargetsEqual(webhookTargetIds, existing.webhookTargets ?? [])
    ) {
      return existing;
    }

    const updateMutation = await this._service.updateTargetGroup({
      id: existing.id,
      name: existing.name ?? existing.id,
      emailTargetIds,
      smsTargetIds,
      telegramTargetIds,
      webhookTargetIds,
    });

    const updated = updateMutation.updateTargetGroup;
    if (updated === undefined) {
      throw new Error('Failed to update target group');
    }

    return updated;
  }

  async ensureSourceGroup(
    input: Readonly<{
      name: string;
      sourceParams: ReadonlyArray<EnsureSourceParams>;
    }>,
  ): Promise<Types.SourceGroupFragmentFragment> {
    return ensureSourceGroup(this._service, input);
  }
}
