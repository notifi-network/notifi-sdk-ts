import {
  NotifiEnvironment,
  NotifiFrontendConfiguration,
  checkIsConfigWithPublicKeyAndAddress,
} from '../configuration/NotifiFrontendConfiguration';
import { StorageDriver } from './NotifiFrontendStorage';

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

export const createInMemoryStorageDriver = (
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

  const storageBackend: Record<string, string> = {};

  const storageDriver: StorageDriver = {
    get: <T>(key: string): Promise<T | null> => {
      const newKey = `${keyPrefix}:${key}`;
      let result: T | null = null;
      if (newKey in storageBackend) {
        const json = storageBackend[newKey];
        result = JSON.parse(json) as T;
      }

      return Promise.resolve(result);
    },
    set: <T>(key: string, newValue: T | null): Promise<void> => {
      const newKey = `${keyPrefix}:${key}`;
      if (newValue === null) {
        delete storageBackend[newKey];
      } else {
        storageBackend[newKey] = JSON.stringify(newValue);
      }

      return Promise.resolve();
    },
    has: (key: string): Promise<boolean> => {
      const newKey = `${keyPrefix}:${key}`;
      return Promise.resolve(newKey in storageBackend);
    },
  };

  return storageDriver;
};
