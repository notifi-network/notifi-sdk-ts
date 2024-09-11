import {
  NotifiEnvironment,
} from '@notifi-network/notifi-frontend-client';

export function initWebPushServiceWorker(serviceWorkerFilePath?: string | null, userAccount?: string | null, dappId?: string | null, env?: NotifiEnvironment | null) {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(
      serviceWorkerFilePath ?? '/notifi-service-worker.js',
      {
        type: "module",
        scope: "/"
      }
    ).then((registration) => {
      if (!userAccount || !dappId || !env) {
        return;
      }

      const payload = {
        type: "NotifiCheckSubscription",
        userAccount: userAccount,
        dappId: dappId,
        env: env
      }
      registration?.active?.postMessage(
        JSON.stringify(payload)
      );
    }).catch((err) => {
      console.error(err);
    });
  }
  else {
    console.error('Web push service worker failed to start.');
  }
}

export function tryCreateWebPushSubscription(userAccount: string, dappId: string, env: NotifiEnvironment) {
  console.log('tryCreateWebPushSubscription was called')
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistration().then((registration) => {
      const payload = {
        type: "NotifiCheckSubscription",
        userAccount: userAccount,
        dappId: dappId,
        env: env
      }
      registration?.active?.postMessage(
        JSON.stringify(payload)
      );
    });
  }
  else {
    console.error('Web push service worker failed to try create web push subscription.');
  }
}