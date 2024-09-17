import {
  NotifiEnvironment,
  NotifiFrontendClient,
  instantiateFrontendClient,
} from '@notifi-network/notifi-frontend-client';
import {
  createDb,
  createOrUpdateWebPushTarget,
  defaultIconUrl,
  isNotifiServiceWorkerMessage,
  isNotifiWebPushEventData,
  parseJsonString,
  urlBase64ToUint8Array,
} from '@notifi-network/notifi-web-push-service-worker';

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

  const { Subject, Message, Icon } = eventData;

  event.waitUntil(
    self.registration.showNotification(Subject, {
      body: Message,
      icon: Icon ?? defaultIconUrl,
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
        console.error(e, 'Error getting subscription');
      });
      break;
    default:
      console.error('Unsupported message event type');
  }
});

self.addEventListener(
  'pushsubscriptionchange',
  (event) => {
    console.log('push subscription changed!!');
    const subscription = self.registration.pushManager
      // Force casting "PushSubscriptionChangeEvent" because it is not widely supported across browsers: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/pushsubscriptionchange_event
      .subscribe((event as PushSubscriptionChangeEvent).oldSubscription.options)
      .then(async (subscription) => {
        client.initialize().then(async (userState) => {
          if (userState.status === 'authenticated') {
            const getVapidKeysResponse = await client.getVapidPublicKeys();
            const vapidBot = getVapidKeysResponse?.nodes?.[0];
            if (!vapidBot) {
              return console.error(
                'Tenant does not have a configured Vapid bot. Will not attempt web push subscription.',
              );
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
  false, // TODO: Remove?? (TBC)
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
