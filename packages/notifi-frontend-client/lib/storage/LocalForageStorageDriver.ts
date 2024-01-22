import localforage from 'localforage';

import {
  NotifiEnvironment,
  NotifiFrontendConfiguration,
  checkIsConfigWithPublicKeyAndAddress,
} from '../configuration/NotifiFrontendConfiguration';
import { StorageDriver } from './NotifiFrontendStorage';

localforage.config({
  name: 'notifi',
});

const getEnvPrefix = (env: NotifiEnvironment): string => {
  switch (env) {
    case 'Production':
      return 'notifi-jwt';
    case 'Development':
      return 'notifi-jwt:dev';
    case 'Staging':
      return 'notifi-jwt:stg';
    case 'Local':
      return 'notifi-jwt:local';
  }
};

export const createLocalForageStorageDriver = (
  config: NotifiFrontendConfiguration,
): StorageDriver => {
  let keyPrefix = `${getEnvPrefix(config.env)}:${config.tenantId}:${
    config.walletBlockchain
  }`;

  if (checkIsConfigWithPublicKeyAndAddress(config)) {
    keyPrefix += `:${config.accountAddress}:${config.authenticationKey}`;
  } else {
    keyPrefix += `:${config.walletPublicKey}`;
  }

  const storageDriver: StorageDriver = {
    get: async <T>(key: string): Promise<T | null> => {
      const item = await localforage.getItem<T>(`${keyPrefix}:${key}`);
      return item;
    },
    set: async <T>(key: string, newValue: T | null): Promise<void> => {
      await localforage.setItem(`${keyPrefix}:${key}`, newValue);
    },
    has: async (key: string): Promise<boolean> => {
      const keys = await localforage.keys();
      return keys.indexOf(`${keyPrefix}:${key}`) >= 0;
    },
  };

  return storageDriver;
};
