import { instantiateFrontendClient } from "@notifi-network/notifi-frontend-client";

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

function GetSubsciption(userAccount, dappId, env) {
  if (Notification.permission !== "granted") {
    console.log(Notification.permission)
    console.log('Notification permissions not granted');
    return;
  }

  if (!userAccount || !dappId || !env || userAccount == '' || dappId == '' || env == '') {
    console.log('UserAccount, Notifi dappId, or env not found. Skipping subscription instantiation.');
    return;
  }

  console.log('Creating client')
  // TODO: Instantiate Notifi client here. If it fails, don't do anything.
  let client = instantiateFrontendClient(
    dappId,
    {
      walletBlockchain: 'OFF_CHAIN',
      userAccount: userAccount
    },
    env,
  );
  console.log('here')

  client.initialize().then(userState => {
    if (userState.status == 'authenticated') {
      // TODO: Get vapid key here
      console.log('attempting to create subscription')
      let vapidPublicKey = "BBw1aI15zN4HFMIlbWoV2E390hxgY47-mBjN41Ewr2YCNGPdoR3-Q1vI-LAyfut8rqwSOWrcBA5sA5aC4gHcFjA";

      if (Notification.permission === "granted") {
        console.log('permission granted')
        self.registration.pushManager.getSubscription()
          .then(async (subscription) => {
            console.log('Registration starting')

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
            console.log(
              'Received PushSubscription: ',
              JSON.stringify(subscription),
            );
            // TODO: create web push target here and store the target id in indexed db
            const subscriptionJson = subscription.toJSON();
            const webPushTargetResponse = await client.createWebPushTarget({
              vapidPublicKey: vapidPublicKey,
              endpoint: subscriptionJson.endpoint,
              auth: subscriptionJson.keys.auth,
              p256dh: subscriptionJson.keys.p256dh
            })

            console.log(
              'WebPushTargetResponse',
              JSON.stringify(webPushTargetResponse),
            );
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