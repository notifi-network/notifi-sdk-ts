import { NotifiEnvironment } from '@notifi-network/notifi-frontend-client';

export * from './notifi-service';
export * from './utils';

export type NotifiServiceWorkerMessagePayload = {
  type: NotifiServiceWorkerMessageType;
  userAccount: string;
  dappId: string;
  env: NotifiEnvironment;
};

export enum NotifiServiceWorkerMessageType {
  NotifiCheckSubscription = 'NotifiCheckSubscription',
}

// TODO: Modulize this function when growing big (maybe utils/service-worker.ts)
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
          type: NotifiServiceWorkerMessageType.NotifiCheckSubscription,
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

// TODO: Modulize this function when growing big (maybe utils/service-worker.ts)
export function tryCreateWebPushSubscription(
  userAccount: string, // IMPORTANT: Case sensitive, make sure to pass the account identically as it is in (web) app
  dappId: string,
  env: NotifiEnvironment,
) {
  console.log('tryCreateWebPushSubscription was called');
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistration().then((registration) => {
      const payload: NotifiServiceWorkerMessagePayload = {
        type: NotifiServiceWorkerMessageType.NotifiCheckSubscription,
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
  if (!('userAccount' in messagePayload)) return false;
  if (!('dappId' in messagePayload)) return false;
  if (!('env' in messagePayload)) return false;
  return true;
};
