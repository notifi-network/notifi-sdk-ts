import { NotifiService } from '@notifi-network/notifi-graphql';
import { GraphQLClient } from 'graphql-request';

import {
  NotifiAptosConfiguration,
  NotifiFrontendConfiguration,
  NotifiSolanaConfiguration,
  envUrl,
} from '../configuration';
import {
  NotifiFrontendStorage,
  createLocalForageStorageDriver,
} from '../storage';
import { NotifiFrontendClient } from './NotifiFrontendClient';

export const newNotifiStorage = (config: NotifiFrontendConfiguration) => {
  const driver = createLocalForageStorageDriver(config);
  return new NotifiFrontendStorage(driver);
};

export const newNotifiService = (config: NotifiFrontendConfiguration) => {
  const url = envUrl(config.env);
  const client = new GraphQLClient(url);
  return new NotifiService(client);
};

export const newAptosClient = (config: NotifiAptosConfiguration) => {
  const service = newNotifiService(config);
  const storage = newNotifiStorage(config);
  return new NotifiFrontendClient(config, service, storage);
};

export const newSolanaClient = (config: NotifiSolanaConfiguration) => {
  const service = newNotifiService(config);
  const storage = newNotifiStorage(config);
  return new NotifiFrontendClient(config, service, storage);
};
