import { NotifiEnvironment } from '@notifi-network/notifi-frontend-client';

import {
  NotifiServiceWorkerMessagePayload,
  NotifiWebPushEventData,
} from '../types';
import { notifiServiceWorkerDefaultFilePath } from './constants';

/**
 * @description Only registers service worker if not passing userAccount, dappId or env; otherwise, it will also try to subscribe web push
 * @note you can call tryCreateWebPushSubscription after this function to subscribe web push
 * @IMPORTANT Case sensitive, make sure all input arguments are identical to the ones in browser (or app) code
 */
export async function initWebPushServiceWorker(
  serviceWorkerFilePath?: string,
  userAccount?: string,
  dappId?: string,
  env?: NotifiEnvironment,
): Promise<void> {
  if (!('serviceWorker' in navigator))
    throw new Error(
      'initWebPushServiceWorker: Failed to initialize service worker, serviceWorker is not supported in this app',
    );

  const registration = await navigator.serviceWorker.register(
    serviceWorkerFilePath ?? notifiServiceWorkerDefaultFilePath,
    {
      type: 'module',
      scope: '/',
    },
  );

  if (!userAccount || !dappId || !env) {
    console.log(
      'initWebPushServiceWorker: userAccount, dappId or env is missing, only registering service worker w/o subscribing web push',
    );
    return;
  }

  const payload: NotifiServiceWorkerMessagePayload = {
    type: 'NotifiCheckSubscription',
    userAccount,
    dappId,
    env,
  };

  registration.active?.postMessage(JSON.stringify(payload));
}

/**
 * @IMPORTANT Case sensitive, make sure all input arguments are identical to the ones in browser (or app) code
 */
export async function tryCreateWebPushSubscription(
  userAccount: string,
  dappId: string,
  env: NotifiEnvironment,
): Promise<void> {
  if (!('serviceWorker' in navigator))
    throw new Error(
      'tryCreateWebPushSubscription: Failed to initialize service worker, serviceWorker is not supported in this app',
    );

  const registration = await navigator.serviceWorker.getRegistration();

  if (!registration) {
    throw new Error(
      'tryCreateWebPushSubscription: Failed to get service worker registration, service worker is not registered',
    );
  }

  console.log('tryCreateWebPushSubscription was called');

  const payload: NotifiServiceWorkerMessagePayload = {
    type: 'NotifiCheckSubscription',
    userAccount,
    dappId,
    env,
  };

  registration.active?.postMessage(JSON.stringify(payload));
}

export const isNotifiServiceWorkerMessage = (
  data: unknown,
): data is NotifiServiceWorkerMessagePayload => {
  if (typeof data !== 'object') return false;
  const messagePayload = data as NotifiServiceWorkerMessagePayload;
  if (!('type' in messagePayload)) return false;
  if (messagePayload.type !== 'NotifiCheckSubscription') return false;
  return true;
};

export const isNotifiWebPushEventData = (
  data: unknown,
): data is NotifiWebPushEventData => {
  if (typeof data !== 'object') return false;
  const eventData = data as NotifiWebPushEventData;
  if (!('Subject' in eventData)) return false;
  if (!('Message' in eventData)) return false;
  // if (!('EncryptedBlob' in eventData)) return false; // TODO: uncomment when BE is ready
  return true;
};
