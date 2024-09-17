import { NotifiEnvironment } from '@notifi-network/notifi-frontend-client';

export type NotifiServiceWorkerMessagePayload = NotifiCheckSubscriptionPayload;

export type NotifiCheckSubscriptionPayload = {
  type: 'NotifiCheckSubscription';
  userAccount: string;
  dappId: string;
  env: NotifiEnvironment;
};

export type NotifiWebPushEventData = {
  Subject: string;
  Message: string;
  Icon?: string; // iconUrl
  EncryptedBlob?: string; // TODO: should not be optional (BE WIP)
};

export type IndexedDb = {
  get(key: IDBValidKey): Promise<string | undefined>;
  set(key: IDBValidKey, value: string): Promise<void>;
  delete(key: IDBValidKey): Promise<void>;
};
