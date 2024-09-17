import { NotifiEnvironment } from '@notifi-network/notifi-frontend-client';

import {
  NotifiServiceWorkerMessagePayload,
  NotifiWebPushEventData,
} from '../types';

export function initWebPushServiceWorker(
  serviceWorkerFilePath?: string | null,
  userAccount?: string | null,
  dappId?: string | null,
  env?: NotifiEnvironment | null,
) {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register(serviceWorkerFilePath ?? '/notifi-service-worker.js', {
        type: 'module',
        scope: '/',
      })
      .then((registration) => {
        if (!userAccount || !dappId || !env) {
          return;
        }

        const payload = {
          type: 'NotifiCheckSubscription',
          userAccount: userAccount,
          dappId: dappId,
          env: env,
        };
        registration?.active?.postMessage(JSON.stringify(payload));
      })
      .catch((err) => {
        console.error(err);
      });
  } else {
    console.error('Web push service worker failed to start.');
  }
}

export function tryCreateWebPushSubscription(
  userAccount: string, // IMPORTANT: Case sensitive, make sure to pass the account identically as it is in (web) app
  dappId: string,
  env: NotifiEnvironment,
) {
  console.log('tryCreateWebPushSubscription was called');
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistration().then((registration) => {
      const payload: NotifiServiceWorkerMessagePayload = {
        type: 'NotifiCheckSubscription',
        userAccount,
        dappId,
        env,
      };
      registration?.active?.postMessage(JSON.stringify(payload));
    });
  } else {
    console.error(
      'Web push service worker failed to try create web push subscription.',
    );
  }
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
