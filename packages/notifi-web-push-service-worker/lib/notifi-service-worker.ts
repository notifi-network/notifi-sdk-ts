import {
  NotifiFrontendClient,
  instantiateFrontendClient,
} from '@notifi-network/notifi-frontend-client';
import { NotifiEnvironment } from 'notifi-frontend-client/dist';

import {
  NotifiServiceWorkerMessageType,
  isNotifiServiceWorkerMessage,
} from '.';
import { createOrUpdateWebPushTarget } from './notifi-service/webpush-target';
import { urlBase64ToUint8Array } from './utils';
import { createDb } from './utils/db';

declare const self: ServiceWorkerGlobalScope;

interface PushSubscriptionChangeEvent extends ExtendableEvent {
  oldSubscription: PushSubscription;
}

self.addEventListener('push', async function (event) {
  const payload = event.data
    ? JSON.parse(event.data.text())
    : {
        Subject: 'No Payload',
        Message: 'No payload',
      };

  event.waitUntil(
    self.registration.showNotification(payload.Subject, {
      body: payload.Message,
      icon: payload.Icon ?? 'https://notifi.network/logo.png',
    }),
  );
  // TODO: Analytics here
});

self.addEventListener('notificationclick', async function (event) {
  // TODO: Analytics here
});

self.addEventListener('notificationclose', async function (event) {
  // TODO: Analytics here
});

self.addEventListener('message', (event) => {
  let parsedEventData: object;

  try {
    parsedEventData = JSON.parse(event.data);
  } catch (e) {
    console.error('Failed to parse message event data', e);
    return;
  }

  if (!isNotifiServiceWorkerMessage(parsedEventData)) return;

  const { userAccount, dappId, env, type } = parsedEventData;
  switch (type) {
    case NotifiServiceWorkerMessageType.NotifiCheckSubscription:
      getSubscription(userAccount, dappId, env).catch((e) => {
        console.error(e, 'Error getting subscription');
      });
      break;
    default:
      console.error('Unsupported message type');
  }
});

self.addEventListener(
  'pushsubscriptionchange',
  (event) => {
    console.log('push subscription changed!!');
    console.log(event);
    const subscription = self.registration.pushManager
      // Force casting "PushSubscriptionChangeEvent" because it is not widely supported across browsers: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/pushsubscriptionchange_event
      .subscribe((event as PushSubscriptionChangeEvent).oldSubscription.options)
      .then(async (subscription) => {
        client.initialize().then(async (userState) => {
          if (userState.status === 'authenticated') {
            const getVapidKeysResponse = await client.getVapidPublicKeys();
            const vapidBot = getVapidKeysResponse?.nodes?.[0];
            if (!vapidBot) {
              console.error(
                'Tenant does not have a configured Vapid bot. Will not attempt web push subscription.',
              );
              return;
            }

            if (Notification.permission === 'granted') {
              // TODO: Handle subscription errors
              await createOrUpdateWebPushTarget(
                subscription,
                vapidBot.publicKey,
                db,
                client,
              );
            }
          }
        });
      });
    // Force casting "PushSubscriptionChangeEvent" because it is not widely supported across browsers: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/pushsubscriptionchange_event
    (event as PushSubscriptionChangeEvent).waitUntil(subscription);
  },
  false,
);

// ⬇ Helper functions & service worker global variables ⬇

let client: NotifiFrontendClient;
const db = createDb();

async function getSubscription(
  userAccount: string,
  dappId: string,
  env: NotifiEnvironment,
): Promise<PushSubscription | undefined> {
  if (Notification.permission !== 'granted') {
    console.log('Notification permissions not granted');
    return;
  }

  if (!userAccount || !dappId || !env) {
    console.log(
      'UserAccount, Notifi dappId, or env not found. Skipping subscription instantiation.',
    );
    return;
  }

  client = instantiateFrontendClient(
    dappId,
    {
      walletBlockchain: 'OFF_CHAIN',
      userAccount,
    },
    env,
    undefined,
    { fetch },
  );

  const userState = await client.initialize();
  if (userState.status !== 'authenticated') {
    console.error(
      'Failed to initialize Notifi frontend client: user not authenticated or expired',
    );
    return;
  }

  const getVapidKeysResponse = await client.getVapidPublicKeys();
  const vapidBot = getVapidKeysResponse?.nodes?.[0];
  if (!vapidBot) {
    console.error(
      'Tenant does not have a configured Vapid bot. Will not attempt web push subscription.',
    );
    return;
  }

  const subscription = await self.registration.pushManager.getSubscription();
  if (subscription) {
    console.log('subscription already exists');
    return subscription;
  }

  const convertedVapidKey = urlBase64ToUint8Array(vapidBot.publicKey);
  const newSubscription = await self.registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: convertedVapidKey,
  });

  await createOrUpdateWebPushTarget(
    newSubscription,
    vapidBot.publicKey,
    db,
    client,
  );

  return newSubscription;
}
