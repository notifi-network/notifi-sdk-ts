import { NotifiService } from '@notifi-network/notifi-graphql';
import { GraphQLClient } from 'graphql-request';

import {
  ConfigFactoryInput,
  NotifiFrontendConfiguration,
  envUrl,
  envWSGraphqlUrl,
  newFrontendConfig,
} from '../configuration';
import {
  NotifiFrontendStorage,
  createInMemoryStorageDriver,
  createLocalForageStorageDriver,
} from '../storage';
import { NotifiFrontendClient } from './NotifiFrontendClient';
import { NotifiSubscriptionClient } from './NotifiSubscriptionClient';

export const newNotifiStorage = (config: NotifiFrontendConfiguration) => {
  const driver =
    config.storageOption?.driverType === 'InMemory'
      ? createInMemoryStorageDriver(config)
      : createLocalForageStorageDriver(config);
  return new NotifiFrontendStorage(driver);
};

export const newNotifiService = (config: NotifiFrontendConfiguration) => {
  const url = envUrl(config.env);
  const client = new GraphQLClient(url);
  return new NotifiService(client);
};

export const newFrontendClient = (args: ConfigFactoryInput) => {
  const config = newFrontendConfig(args);
  const service = newNotifiService(config);
  const storage = newNotifiStorage(config);
  const wsurl = envWSGraphqlUrl(config.env);
  return new NotifiFrontendClient(config, service, storage, wsurl);
};