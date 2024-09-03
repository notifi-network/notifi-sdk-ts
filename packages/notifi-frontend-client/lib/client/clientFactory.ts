import { NotifiService } from '@notifi-network/notifi-graphql';
import { GraphQLClient } from 'graphql-request';
import { NotifiSubscriptionService } from 'notifi-graphql/lib/NotifiSubscriptionService';

import {
  ConfigFactoryInput,
  NotifiEnvironment,
  NotifiEnvironmentConfiguration,
  NotifiFrontendConfiguration,
  envUrl,
  isEvmChain,
  newFrontendConfig,
} from '../configuration';
import {
  NotifiFrontendStorage,
  createInMemoryStorageDriver,
  createLocalForageStorageDriver,
} from '../storage';
import { NotifiFrontendClient, UserParams } from './NotifiFrontendClient';

export const newNotifiStorage = (config: NotifiFrontendConfiguration) => {
  const driver =
    config.storageOption?.driverType === 'InMemory'
      ? createInMemoryStorageDriver(config)
      : createLocalForageStorageDriver(config);
  return new NotifiFrontendStorage(driver);
};

export const newNotifiService = (config: NotifiFrontendConfiguration) => {
  const url = envUrl(config.env, 'http');
  const wsurl = envUrl(config.env, 'websocket');
  const client = new GraphQLClient(url);
  const subService = new NotifiSubscriptionService(wsurl);
  return new NotifiService(client, subService);
};

/**@deprecated Use instantiateFrontendClient instead */
export const newFrontendClient = (args: ConfigFactoryInput) => {
  const config = newFrontendConfig(args);
  const service = newNotifiService(config);
  const storage = newNotifiStorage(config);
  return new NotifiFrontendClient(config, service, storage);
};

export const instantiateFrontendClient = (
  tenantId: string,
  params: UserParams,
  env?: NotifiEnvironment,
  storageOption?: NotifiEnvironmentConfiguration['storageOption'],
): NotifiFrontendClient => {
  let config: NotifiFrontendConfiguration | null = null;
  if ('accountAddress' in params) {
    //⬇ NotifiConfigWithPublicKeyAndAddress
    config = {
      tenantId,
      env,
      walletBlockchain: params.walletBlockchain,
      authenticationKey: params.walletPublicKey, // NOTE: authenticationKey is a legacy field used to standardize the key name for indexedDB key. Now we directly add check condition when create storage driver
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
      walletPublicKey: isEvmChain(params.walletBlockchain)
        ? params.walletPublicKey.toLowerCase()
        : params.walletPublicKey,
      storageOption,
    };
  }

  if (!config) {
    throw new Error('ERROR - instantiateFrontendClient: Invalid UserParams');
  }

  const service = newNotifiService(config);
  const storage = newNotifiStorage(config);
  return new NotifiFrontendClient(config, service, storage);
};
