import { instantiateFrontendClient } from "@notifi-network/notifi-frontend-client";
let client;
function createDb() {
  let dbInstance;

  function getDB() {
    if (dbInstance) return dbInstance;

    dbInstance = new Promise((resolve, reject) => {
      const openreq = indexedDB.open('notifi', 1);

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

  async function withStore(type, callback) {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('keyvaluepairs', type);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      callback(transaction.objectStore('keyvaluepairs'));
    });
  }

  return {
    async get(key) {
      let request;
      await withStore('readonly', (store) => {
        request = store.get(key);
      });
      return request.result;
    },
    set(key, value) {
      return withStore('readwrite', (store) => {
        store.put(value, key);
      });
    },
    delete(key) {
      return withStore('readwrite', (store) => {
        store.delete(key);
      });
    },
  };
}

self.addEventListener('install', function (event) {
  self.skipWaiting();
})

function urlBase64ToUint8Array(base64String) {
  var padding = '='.repeat((4 - base64String.length % 4) % 4);
  var base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  var rawData = self.atob(base64);
  var outputArray = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function createWebPushTarget(subscription, vapidPublicKey) {
  try {
    const subscriptionJson = subscription.toJSON();

    const targetGroups = await client.getTargetGroups();
    const defaultTargetGroup = targetGroups.find((targetGroup) => targetGroup.name === 'Default');
    const webPushTargetIds = defaultTargetGroup?.webPushTargets?.map((t) => t?.id) ?? [];

    console.log(defaultTargetGroup?.webPushTargets)

    const webPushTargetResponse = await client.createWebPushTarget({
      vapidPublicKey: vapidPublicKey,
      endpoint: subscriptionJson.endpoint,
      auth: subscriptionJson.keys.auth,
      p256dh: subscriptionJson.keys.p256dh
    })

    console.log(webPushTargetResponse.createWebPushTarget.webPushTarget)

    if (!webPushTargetResponse.createWebPushTarget.webPushTarget || !webPushTargetResponse.createWebPushTarget.webPushTarget?.id) {
      console.error('Failed to create web push target. CreateWebPushTargetMutation failed.');
      return;
    }

    webPushTargetIds.push(webPushTargetResponse.createWebPushTarget.webPushTarget?.id);
    await client.ensureTargetGroup({
      name: 'Default',
      emailAddress: defaultTargetGroup?.emailTargets[0]?.emailAddress,
      phoneNumber: defaultTargetGroup?.smsTargets[0]?.phoneNumber,
      telegramId: defaultTargetGroup?.telegramTargets[0]?.telegramId,
      discordId: defaultTargetGroup?.discordTargets[0]?.name,
      slackId: defaultTargetGroup?.slackChannelTargets[0]?.name,
      walletId: defaultTargetGroup?.web3Targets[0]?.name,
      webPushTargetIds: webPushTargetIds
    });
  }
  catch (err) {
    console.error(err, "Failed to create web push target.")
  }
}

function GetSubsciption(userAccount, dappId, env) {
  if (Notification.permission !== "granted") {
    console.log('Notification permissions not granted');
    return;
  }

  if (!userAccount || !dappId || !env || userAccount == '' || dappId == '' || env == '') {
    console.log('UserAccount, Notifi dappId, or env not found. Skipping subscription instantiation.');
    return;
  }

  // TODO: Instantiate Notifi client here. If it fails, don't do anything.
  client = instantiateFrontendClient(
    dappId,
    {
      walletBlockchain: 'OFF_CHAIN',
      userAccount: userAccount
    },
    env,
    undefined,
    { fetch }
  );

  client.initialize().then(userState => {
    if (userState.status == 'authenticated') {
      // TODO: Get vapid key here
      let vapidPublicKey = "BBw1aI15zN4HFMIlbWoV2E390hxgY47-mBjN41Ewr2YCNGPdoR3-Q1vI-LAyfut8rqwSOWrcBA5sA5aC4gHcFjA";

      if (Notification.permission === "granted") {
        self.registration.pushManager.getSubscription()
          .then(async (subscription) => {
            if (subscription) {
              console.log('subscription already exists')
              return subscription;
            }

            const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

            return await self.registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: convertedVapidKey,
            });
          })
          .then(async (subscription) => {
            await createWebPushTarget(subscription, vapidPublicKey)
            // TODO: save target id in indexed db
          });
      }
    }
  });
}

self.addEventListener('push', async function (event) {
  let payload = event.data ? JSON.parse(event.data.text()) : {
    Subject: 'No Payload',
    Message: 'No payload'
  };

  event.waitUntil(
    self.registration.showNotification(payload.Subject, {
      body: payload.Message,
      icon: payload.Icon ?? 'https://notifi.network/logo.png'
    })
  );
});

self.addEventListener('notificationclick', async function (event) {
  // TODO: Analytics here
})

self.addEventListener('notificationclose', async function (event) {
  // TODO: Analytics here
})

self.addEventListener('message', (event) => {
  try {
    const payload = JSON.parse(event.data)
    if (payload.type == 'NotifiCheckSubscription') {
      GetSubsciption(payload.userAccount, payload.dappId, payload.env);
    }
  }
  catch (e) {
    console.error(e, "Error parsing message data")
  }
});

// TODO: Add listener for when Push Subscription changes