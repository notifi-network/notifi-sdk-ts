import {
  NotifiFrontendClient,
  instantiateFrontendClient,
} from '@notifi-network/notifi-frontend-client';
import { NotifiEnvironment } from 'notifi-frontend-client/dist';

declare const self: ServiceWorkerGlobalScope;

interface PushSubscriptionChangeEvent extends ExtendableEvent {
  oldSubscription: PushSubscription;
}

let client: NotifiFrontendClient;
const db = createDb();
const webPushTargetIdKey = 'webPushTargetId';

function createDb() {
  let dbInstance: Promise<IDBDatabase>;

  function getDB() {
    if (dbInstance) return dbInstance;

    dbInstance = new Promise((resolve, reject) => {
      const openreq = indexedDB.open('notifi');

      openreq.onerror = () => {
        reject(openreq.error);
      };

      openreq.onupgradeneeded = () => {
        // First time setup: create an empty object store
        openreq.result.createObjectStore('keyvaluepairs');
      };

      openreq.onsuccess = () => {
        resolve(openreq.result);
      };
    });

    return dbInstance;
  }

  async function withStore(
    type: IDBTransactionMode,
    callback: (store: IDBObjectStore) => void,
  ): Promise<void> {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('keyvaluepairs', type);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      callback(transaction.objectStore('keyvaluepairs'));
    });
  }

  return {
    async get(key: IDBValidKey): Promise<string | undefined> {
      return new Promise((resolve, reject) => {
        withStore('readonly', (store) => {
          const req = store.get(key);
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => reject(req.error);
        });
      });
    },
    set(key: IDBValidKey, value: string) {
      return withStore('readwrite', (store) => {
        store.put(value, key);
      });
    },
    delete(key: IDBValidKey) {
      return withStore('readwrite', (store) => {
        store.delete(key);
      });
    },
  };
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = self.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function uint8ArrayToBase64Url(uint8Array: Uint8Array) {
  return self.btoa(String.fromCharCode.apply(null, Array.from(uint8Array)));
}

async function createWebPushTarget(
  subscription: PushSubscription,
  vapidPublicKey: string,
) {
  try {
    const targetGroups = await client.getTargetGroups();
    const defaultTargetGroup = targetGroups.find(
      (targetGroup) => targetGroup.name === 'Default',
    );
    if (!defaultTargetGroup?.webPushTargets)
      throw new Error('Default target group not found.');
    const authBuffer = subscription.getKey('auth');
    const p256dhBuffer = subscription.getKey('p256dh');
    if (!authBuffer || !p256dhBuffer)
      throw new Error('Invalid subscription auth or p256dh key');
    const webPushTargetIds = defaultTargetGroup.webPushTargets
      .map((it) => it?.id)
      .filter((it): it is string => !!it);

    const webPushTargetResponse = await client.createWebPushTarget({
      vapidPublicKey: vapidPublicKey,
      endpoint: subscription.endpoint,
      auth: uint8ArrayToBase64Url(new Uint8Array(authBuffer)),
      p256dh: uint8ArrayToBase64Url(new Uint8Array(p256dhBuffer)),
    });

    if (
      !webPushTargetResponse.createWebPushTarget.webPushTarget ||
      !webPushTargetResponse.createWebPushTarget.webPushTarget?.id
    ) {
      console.error(
        'Failed to create web push target. CreateWebPushTargetMutation failed.',
      );
      return;
    }

    webPushTargetIds.push(
      webPushTargetResponse.createWebPushTarget.webPushTarget?.id,
    );

    await client.ensureTargetGroup({
      name: 'Default',
      emailAddress: defaultTargetGroup?.emailTargets?.[0]?.emailAddress,
      phoneNumber: defaultTargetGroup?.smsTargets?.[0]?.phoneNumber,
      telegramId: defaultTargetGroup?.telegramTargets?.[0]?.telegramId,
      discordId: defaultTargetGroup?.discordTargets?.[0]?.name,
      slackId: defaultTargetGroup?.slackChannelTargets?.[0]?.name,
      walletId: defaultTargetGroup?.web3Targets?.[0]?.name,
      webPushTargetIds: webPushTargetIds,
    });
    await db.set(
      webPushTargetIdKey,
      webPushTargetResponse.createWebPushTarget.webPushTarget?.id,
    );
  } catch (err) {
    console.error(err, 'Failed to create web push target.');
  }
}

async function updateWebPushTarget(
  subscription: PushSubscription,
  webPushTargetId: string,
) {
  try {
    const authBuffer = subscription.getKey('auth');
    const p256dhBuffer = subscription.getKey('p256dh');
    if (!authBuffer || !p256dhBuffer)
      throw new Error('Invalid subscription auth or p256dh key');

    await client.updateWebPushTarget({
      id: webPushTargetId,
      endpoint: subscription.endpoint,
      auth: uint8ArrayToBase64Url(new Uint8Array(authBuffer)),
      p256dh: uint8ArrayToBase64Url(new Uint8Array(p256dhBuffer)),
    });
  } catch (err) {
    console.error(err, 'Failed to update web push target.');
  }
}

async function createOrUpdateWebPushTarget(
  subscription: PushSubscription,
  vapidPublicKey: string,
) {
  const webPushTargetId = await db.get(webPushTargetIdKey);
  if (!webPushTargetId || webPushTargetId === '') {
    await createWebPushTarget(subscription, vapidPublicKey);
  } else {
    const getWebPushTargetsResponse = await client.getWebPushTargets({
      ids: [webPushTargetId],
    });

    if (getWebPushTargetsResponse?.nodes?.length !== 1) {
      await createWebPushTarget(subscription, vapidPublicKey);
    } else {
      await updateWebPushTarget(subscription, webPushTargetId);
    }
  }
}

function GetSubsciption(
  userAccount: string,
  dappId: string,
  env: NotifiEnvironment,
) {
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
      userAccount: userAccount,
    },
    env,
    undefined,
    { fetch },
  );

  client
    .initialize()
    .then(async (userState) => {
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
          self.registration.pushManager
            .getSubscription()
            .then(async (subscription) => {
              if (subscription) {
                console.log('subscription already exists');
                return subscription;
              }

              const convertedVapidKey = urlBase64ToUint8Array(
                vapidBot.publicKey,
              );

              return await self.registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: convertedVapidKey,
              });
            })
            .then(async (subscription) => {
              // TODO: Handle subscription errors
              await createOrUpdateWebPushTarget(
                subscription,
                vapidBot.publicKey,
              );
            });
        }
      }
    })
    .catch((err) => {
      console.error(err, 'Notifi client failed to initialize.');
    });
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

self.addEventListener(
  'notificationclick',
  async function (event: NotificationEvent) {
    // TODO: Analytics here
  },
);

self.addEventListener('notificationclose', async function (event) {
  // TODO: Analytics here
});

self.addEventListener('message', (event) => {
  try {
    const payload = JSON.parse(event.data);
    if (payload.type == 'NotifiCheckSubscription') {
      GetSubsciption(payload.userAccount, payload.dappId, payload.env);
    }
  } catch (e) {
    console.error(e, 'Error parsing message data');
  }
});

self.addEventListener(
  'pushsubscriptionchange',
  (event) => {
    // Force casting "PushSubscriptionChangeEvent" because it is not widely supported across browsers: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/pushsubscriptionchange_event
    console.log('push subscription changed!!');
    console.log(event);
    const subscription = self.registration.pushManager
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
              );
            }
          }
        });
      });
    (event as PushSubscriptionChangeEvent).waitUntil(subscription);
  },
  false,
);
