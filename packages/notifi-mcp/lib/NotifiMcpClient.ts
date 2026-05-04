import { NotifiService } from '@notifi-network/notifi-graphql';
import {
  NotifiEnvironment,
  NotifiNodeClient,
  createDataplaneClient,
  createGraphQLClient,
  createNotifiService,
  createNotifiSubscriptionService,
} from '@notifi-network/notifi-node';

import {
  authFailedError,
  invalidConfigError,
  isLikelyAuthError,
  missingConfigError,
  upstreamError,
} from './utils/errors';

export type NotifiMcpClientConfig = Readonly<{
  sid?: string;
  secret?: string;
  env?: NotifiEnvironment;
}>;

export type ResolvedNotifiMcpConfig = Readonly<{
  sid: string;
  secret: string;
  env: NotifiEnvironment;
}>;

const VALID_ENVIRONMENTS: ReadonlyArray<NotifiEnvironment> = [
  'Production',
  'Staging',
  'Development',
  'Local',
];

export class NotifiMcpClient {
  readonly config: ResolvedNotifiMcpConfig;
  readonly nodeClient: NotifiNodeClient;
  readonly service: NotifiService;
  private authPromise?: Promise<void>;

  constructor(config?: NotifiMcpClientConfig) {
    this.config = resolveNotifiMcpConfig(config);

    const gqlClient = createGraphQLClient(this.config.env);
    const subscriptionService = createNotifiSubscriptionService(
      this.config.env,
    );
    this.service = createNotifiService(gqlClient, subscriptionService);
    this.nodeClient = new NotifiNodeClient(
      this.service,
      createDataplaneClient(this.config.env),
    );
  }

  async ensureAuthenticated(force = false): Promise<void> {
    if (!force && this.nodeClient.status.status === 'initialized') {
      return;
    }

    if (!force && this.authPromise) {
      return this.authPromise;
    }

    this.authPromise = this.nodeClient
      .logIn({ sid: this.config.sid, secret: this.config.secret })
      .then(() => undefined)
      .catch((error: unknown) => {
        throw authFailedError(error);
      })
      .finally(() => {
        this.authPromise = undefined;
      });

    return this.authPromise;
  }

  async runWithAuthRetry<T>(operation: () => Promise<T>): Promise<T> {
    await this.ensureAuthenticated();

    try {
      return await operation();
    } catch (error) {
      if (!isLikelyAuthError(error)) {
        throw upstreamError('Notifi request failed', error);
      }

      await this.ensureAuthenticated(true);

      try {
        return await operation();
      } catch (retryError) {
        throw upstreamError(
          'Notifi request failed after re-authentication',
          retryError,
        );
      }
    }
  }

  async dispose(): Promise<void> {
    await this.service.wsDispose();
  }
}

export const createNotifiMcpClient = (
  config?: NotifiMcpClientConfig,
): NotifiMcpClient => new NotifiMcpClient(config);

export const resolveNotifiMcpConfig = (
  config?: NotifiMcpClientConfig,
  env: NodeJS.ProcessEnv = process.env,
): ResolvedNotifiMcpConfig => {
  const sid = config?.sid ?? env.NOTIFI_SID;
  const secret = config?.secret ?? env.NOTIFI_SECRET;
  const requestedEnv = config?.env ?? env.NOTIFI_ENV ?? 'Production';

  const missingKeys = [
    sid ? undefined : 'NOTIFI_SID',
    secret ? undefined : 'NOTIFI_SECRET',
  ].filter((value): value is string => value !== undefined);

  if (missingKeys.length > 0) {
    throw missingConfigError(missingKeys);
  }

  if (!VALID_ENVIRONMENTS.includes(requestedEnv as NotifiEnvironment)) {
    throw invalidConfigError(
      `Invalid NOTIFI_ENV value: ${requestedEnv}. Expected one of ${VALID_ENVIRONMENTS.join(', ')}`,
    );
  }

  const resolvedSid = sid as string;
  const resolvedSecret = secret as string;

  return {
    sid: resolvedSid,
    secret: resolvedSecret,
    env: requestedEnv as NotifiEnvironment,
  };
};
