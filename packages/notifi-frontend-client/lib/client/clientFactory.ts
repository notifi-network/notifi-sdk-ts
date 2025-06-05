import { NotifiDataplaneClient } from '@notifi-network/notifi-dataplane';
import {
  NotifiService,
  NotifiSubscriptionService,
} from '@notifi-network/notifi-graphql';
import { GraphQLClient } from 'graphql-request';
import WebSocket from 'ws';

import { version } from '../../package.json';
import {
  NotifiEnvironment,
  NotifiFrontendConfiguration,
  NotifiSmartLinkClientConfig,
  envUrl,
} from '../configuration';
import { isEvmBlockchain } from '../models/Blockchain';
import {
  NotifiFrontendStorage,
  createInMemoryStorageDriver,
  createLocalForageStorageDriver,
} from '../storage';
import { NotifiFrontendClient, UserParams } from './NotifiFrontendClient';
import { NotifiSmartLinkClient } from './NotifiSmartLinkClient';

type RequestConfig = NonNullable<
  ConstructorParameters<typeof GraphQLClient>[1]
>;

export const newNotifiStorage = (config: NotifiFrontendConfiguration) => {
  const driver =
    config.storageOption?.driverType === 'InMemory'
      ? createInMemoryStorageDriver(config)
      : createLocalForageStorageDriver(config);
  return new NotifiFrontendStorage(driver);
};

export const newNotifiService = <T extends { env?: NotifiEnvironment }>(
  config: T,
  gqlClientRequestConfig?: RequestConfig,
  optionHeaders?: Record<string, string>,
) => {
  const url = envUrl(config.env, 'http');
  const wsurl = envUrl(config.env, 'websocket');
  const client = new GraphQLClient(url, gqlClientRequestConfig);

  const subService = new NotifiSubscriptionService(
    wsurl,
    /** NOTE - websocketImpl arg:
     * - In browser env, adopt global WebSocket automatically.
     * - In Node.js env, manually pass in WebSocket Implementation.
     * @ref https://github.com/enisdenjo/graphql-ws/blob/c030ed1d5f7e8a552dffbfd46712caf7dfe91a54/src/client.ts#L400
     */
    typeof window !== 'undefined' ? undefined : WebSocket,
  );

  if (!optionHeaders) {
    optionHeaders = {};
  }
  if (!('X-Notifi-Client-Version' in optionHeaders)) {
    optionHeaders['X-Notifi-Client-Version'] = version;
  }

  return new NotifiService(client, subService, optionHeaders);
};

export const newDataplaneClient = <T extends { env?: NotifiEnvironment }>(
  config: T,
) => {
  const dpapiUrl = envUrl(config.env, 'http', 'notifi-dataplane');
  return new NotifiDataplaneClient(dpapiUrl);
};

export const instantiateFrontendClient = (
  tenantId: string,
  params: UserParams,
  env?: NotifiEnvironment,
  storageOption?: NotifiFrontendConfiguration['storageOption'],
  gqlClientRequestConfig?: RequestConfig, // NOTE: `graphql-request` by default uses XMLHttpRequest API. To adopt fetch API, pass in { fetch: fetch }
  optionHeaders?: Record<string, string>,
): NotifiFrontendClient => {
  let config: NotifiFrontendConfiguration | null = null;
  if ('accountAddress' in params) {
    //⬇ NotifiConfigWithPublicKeyAndAddress
    config = {
      tenantId,
      env,
      walletBlockchain: params.walletBlockchain,
      walletPublicKey: params.walletPublicKey,
      accountAddress: params.accountAddress,
      storageOption,
    };
  } else if ('signingPubkey' in params) {
    //⬇ NotifiConfigWithDelegate
    config = {
      tenantId,
      env,
      walletBlockchain: params.walletBlockchain,
      delegatedAddress: params.signingAddress,
      delegatedPublicKey: params.walletPublicKey,
      delegatorAddress: params.signingPubkey,
      storageOption,
    };
  } else if ('userAccount' in params) {
    //⬇ NotifiConfigWithOidc
    config = {
      tenantId,
      env,
      userAccount: params.userAccount,
      storageOption,
      walletBlockchain: params.walletBlockchain,
    };
  } else {
    //⬇ NotifiConfigWithPublicKey
    config = {
      tenantId,
      env,
      walletBlockchain: params.walletBlockchain,
      walletPublicKey: isEvmBlockchain(params.walletBlockchain)
        ? params.walletPublicKey.toLowerCase()
        : params.walletPublicKey,
      storageOption,
    };
  }

  if (!config) {
    throw new Error('ERROR - instantiateFrontendClient: Invalid UserParams');
  }

  const service = newNotifiService(
    config,
    gqlClientRequestConfig,
    optionHeaders,
  );
  const storage = newNotifiStorage(config);
  return new NotifiFrontendClient(config, service, storage);
};

export const newSmartLinkClient = (
  config: NotifiSmartLinkClientConfig,
  gqlClientRequestConfig?: RequestConfig, // NOTE: `graphql-request` by default uses XMLHttpRequest API. To adopt fetch API, pass in { fetch: fetch }
): NotifiSmartLinkClient => {
  const service = newNotifiService(config, gqlClientRequestConfig);
  const dpClient = newDataplaneClient(config);
  return new NotifiSmartLinkClient(config, service, dpClient);
};
