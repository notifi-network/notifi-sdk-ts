import {
  NotifiEnvironment,
  NotifiFrontendClient,
  instantiateFrontendClient,
} from '@notifi-network/notifi-frontend-client';
import {
  createDb,
  createOrUpdateWebPushTarget,
  defaultIconUrl,
  isNotifiNotificationData,
  isNotifiServiceWorkerMessage,
  isNotifiWebPushEventData,
  parseJsonString,
  sendMessageDeliveredAnalytics,
  sendUserInteractionAnalytics,
  urlBase64ToUint8Array,
} from '@notifi-network/notifi-web-push-service-worker';

import { NotifiNotificationData } from './types/index';

declare const self: ServiceWorkerGlobalScope;

interface PushSubscriptionChangeEvent extends ExtendableEvent {
  oldSubscription: PushSubscription;
}

self.addEventListener('push', async function (event) {
  const eventData = parseJsonString({
    jsonString: event.data?.text() ?? '{}',
    validator: isNotifiWebPushEventData,
  });
  if (!eventData) {
    return console.error('Push event: Invalid event data:', event.data?.text());
  }

  const { Subject, Message, Icon, EncryptedBlob } = eventData;
  const data: NotifiNotificationData = {
    encryptedBlob: EncryptedBlob,
  };

  event.waitUntil(
    self.registration.showNotification(Subject, {
      body: Message,
      icon: Icon ?? defaultIconUrl,
      data: JSON.stringify(data),
    }),
  );
  await sendMessageDeliveredAnalytics(notifiEnv, EncryptedBlob);
});

self.addEventListener('notificationclick', async function (event) {
  const notificationData = parseJsonString({
    jsonString: event.notification.data ?? '{}',
    validator: isNotifiNotificationData,
  });

  if (!notificationData) {
    return;
  }

  event.notification.close();
  event.waitUntil(
    Promise.all([
      sendUserInteractionAnalytics(
        notifiEnv,
        'MESSAGE_OPENED',
        notificationData.encryptedBlob,
      ),
      self.clients
        .matchAll({
          type: 'window',
          includeUncontrolled: true,
        })
        .then((clientList) => {
          for (const client of clientList) {
            const urlOrigin = new URL(client.url).origin;
            if (urlOrigin === self.location.origin && 'focus' in client)
              return client.focus();
          }
          self.clients.openWindow('/');
        }),
    ]),
  );
});

self.addEventListener('notificationclose', async function (event) {
  const notificationData = parseJsonString({
    jsonString: event.notification.data ?? '{}',
    validator: isNotifiNotificationData,
  });

  if (!notificationData) {
    return;
  }

  await sendUserInteractionAnalytics(
    notifiEnv,
    'MESSAGE_CLOSED',
    notificationData.encryptedBlob,
  );
});

self.addEventListener('message', (event) => {
  const eventData = parseJsonString({
    jsonString: event.data,
    validator: isNotifiServiceWorkerMessage,
  });
  if (!eventData) {
    return console.error('Invalid message event data:', event.data);
  }

  const { userAccount, dappId, env, type } = eventData;

  switch (type) {
    case 'NotifiCheckSubscription':
      getSubscription(userAccount, dappId, env).catch((e) => {
        if (e instanceof Error) {
          console.error('Message event error:', e.message);
        }
      });
      break;
    default:
      console.error('Unsupported message event type');
  }
});

self.addEventListener(
  'pushsubscriptionchange',
  (event) => {
    const subscription = self.registration.pushManager
      // Force casting "PushSubscriptionChangeEvent" because it is not widely supported across browsers: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/pushsubscriptionchange_event
      .subscribe((event as PushSubscriptionChangeEvent).oldSubscription.options)
      .then(async (subscription) => {
        try {
          const userState = await client.initialize();
          if (userState.status !== 'authenticated') {
            throw new Error('user not authenticated or expired');
          }

          const getVapidKeysResponse = await client.getVapidPublicKeys();
          const vapidBot = getVapidKeysResponse?.nodes?.[0];
          if (!vapidBot) {
            throw new Error('tenant does not have a configured Vapid bot');
          }

          if (Notification.permission === 'granted') {
            await createOrUpdateWebPushTarget(
              subscription,
              vapidBot.publicKey,
              db,
              client,
            );
          }
        } catch (e) {
          if (e instanceof Error) {
            console.error('Push subscription change event error:', e.message);
          }
        }
      });
    // Force casting "PushSubscriptionChangeEvent" because it is not widely supported across browsers: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/pushsubscriptionchange_event
    (event as PushSubscriptionChangeEvent).waitUntil(subscription);
  },
  false, // TODO: Remove?? (TBC)
);

// ⬇ Helper functions & service worker global variables ⬇

let client: NotifiFrontendClient;
let notifiEnv: NotifiEnvironment;
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
    throw new Error(
      'userAccount, Notifi dappId, or env not found. Skipping subscription instantiation.',
    );
  }

  notifiEnv = env;
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
    throw new Error('user not authenticated or expired');
  }

  const getVapidKeysResponse = await client.getVapidPublicKeys();
  const vapidBot = getVapidKeysResponse?.nodes?.[0];
  if (!vapidBot) {
    throw new Error('tenant does not have a configured Vapid bot');
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
