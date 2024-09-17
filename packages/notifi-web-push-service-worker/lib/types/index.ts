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
  EncryptedBlob: string;
};

export type IndexedDb = {
  get(key: IDBValidKey): Promise<string | undefined>;
  set(key: IDBValidKey, value: string): Promise<void>;
  delete(key: IDBValidKey): Promise<void>;
};

export type NotifiNotificationData = {
  encryptedBlob: string;
};

export type UserInteractionType = 'MESSAGE_OPENED' | 'MESSAGE_CLOSED';
