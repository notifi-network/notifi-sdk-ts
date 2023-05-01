import { NotifiService } from '@notifi-network/notifi-graphql';
import { GraphQLClient } from 'graphql-request';

import { NotifiFrontendConfiguration, envUrl } from '../configuration';
import {
  NotifiFrontendStorage,
  createInMemoryStorageDriver,
  createLocalForageStorageDriver,
} from '../storage';
import { NotifiFrontendClient } from './NotifiFrontendClient';

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

export const newFrontendClient = (config: NotifiFrontendConfiguration) => {
  const service = newNotifiService(config);
  const storage = newNotifiStorage(config);
  return new NotifiFrontendClient(config, service, storage);
};
