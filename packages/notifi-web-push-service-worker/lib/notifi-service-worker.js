import { instantiateFrontendClient } from "@notifi-network/notifi-frontend-client";
let client;
let db = createDb();
const webPushTargetIdKey = 'webPushTargetId';
function createDb() {
  let dbInstance;

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
    const conv = (val) => self.btoa(String.fromCharCode.apply(null, new Uint8Array(val)));
    const targetGroups = await client.getTargetGroups();
    const defaultTargetGroup = targetGroups.find((targetGroup) => targetGroup.name === 'Default');
    const webPushTargetIds = defaultTargetGroup?.webPushTargets?.map((t) => t?.id) ?? [];

    const webPushTargetResponse = await client.createWebPushTarget({
      vapidPublicKey: vapidPublicKey,
      endpoint: subscription.endpoint,
      auth: conv(subscription.getKey("auth")),
      p256dh: conv(subscription.getKey("p256dh"))
    })

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
    await db.set(webPushTargetIdKey, webPushTargetResponse.createWebPushTarget.webPushTarget?.id);
  }
  catch (err) {
    console.error(err, "Failed to create web push target.")
  }
}

async function updateWebPushTarget(subscription, webPushTargetId) {
  try {
    const conv = (val) => self.btoa(String.fromCharCode.apply(null, new Uint8Array(val)));
    await client.updateWebPushTarget({
      id: webPushTargetId,
      endpoint: subscription.endpoint,
      auth: conv(subscription.getKey("auth")),
      p256dh: conv(subscription.getKey("p256dh"))
    });
  }
  catch (err) {
    console.error(err, "Failed to update web push target.")
  }
}

async function createOrUpdateWebPushTarget(subscription, vapidPublicKey) {
  const webPushTargetId = await db.get(webPushTargetIdKey);
  if (!webPushTargetId || webPushTargetId === '') {
    await createWebPushTarget(subscription, vapidPublicKey);
  }
  else {
    const getWebPushTargetsResponse = await client.getWebPushTargets({ ids: [webPushTargetId] });

    if (getWebPushTargetsResponse.nodes.length !== 1) {
      await createWebPushTarget(subscription, vapidPublicKey);
    }
    else {
      await updateWebPushTarget(subscription, webPushTargetId);
    }
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

  client.initialize().then(async userState => {
    if (userState.status === 'authenticated') {
      let getVapidKeysResponse = await client.getVapidPublicKeys();
      let vapidBot = getVapidKeysResponse.nodes[0];
      if (!vapidBot) {
        console.error('Tenant does not have a configured Vapid bot. Will not attempt web push subscription.');
        return;
      }

      if (Notification.permission === "granted") {
        self.registration.pushManager.getSubscription()
          .then(async (subscription) => {
            if (subscription) {
              console.log('subscription already exists')
              return subscription;
            }

            const convertedVapidKey = urlBase64ToUint8Array(vapidBot.publicKey);

            return await self.registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: convertedVapidKey,
            });
          })
          .then(async (subscription) => {
            await createOrUpdateWebPushTarget(subscription, vapidBot.publicKey)
          });
      }
    }
  }).catch((err) => {
    console.error(err, 'Notifi client failed to initialize.')
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
  // TODO: Analytics here
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

self.addEventListener(
  "pushsubscriptionchange",
  (event) => {
    console.log('push subscription changed!!')
    console.log(event)
    const subscription = self.registration.pushManager
      .subscribe(event.oldSubscription.options)
      .then(async (subscription) => {
        client.initialize().then(async userState => {
          if (userState.status === 'authenticated') {
            let getVapidKeysResponse = await client.getVapidPublicKeys();
            let vapidBot = getVapidKeysResponse.nodes[0];
            if (!vapidBot) {
              console.error('Tenant does not have a configured Vapid bot. Will not attempt web push subscription.');
              return;
            }

            if (Notification.permission === "granted") {
              await createOrUpdateWebPushTarget(subscription, vapidBot.publicKey);
            }
          }
        })
      });
    event.waitUntil(subscription);
  },
  false,
);