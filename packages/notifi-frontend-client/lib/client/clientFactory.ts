import { NotifiService } from '@notifi-network/notifi-graphql';
import { GraphQLClient } from 'graphql-request';

import {
  ConfigFactoryInput,
  NotifiFrontendConfiguration,
  envUrl,
  newFrontendConfig,
} from '../configuration';
import {
  NotifiFrontendStorage,
  createInMemoryStorageDriver,
  createLocalForageStorageDriver,
} from '../storage';
import { NotifiFrontendClient } from './NotifiFrontendClient';
import { NotifiSubscriptionService } from 'notifi-graphql/lib/NotifiSubscriptionService';

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

export const newFrontendClient = (args: ConfigFactoryInput) => {
  const config = newFrontendConfig(args);
  const service = newNotifiService(config);
  const storage = newNotifiStorage(config);
  return new NotifiFrontendClient(config, service, storage);
};
