# Notifi React SDK

`@notifi-network/notifi-web-push-service-worker` allows your PWA to subscribe to WebPush notifications

<br/><br/>
## Getting Started

_Environment_

- Node version >= 18 (with corresponding npm version)
- React version >= 17

> If you haven't created a Notifi tenant account yet [set up an account](https://admin.notifi.network/signup?environment=prd)

<br/><br/>

# Prerequisites
In order to enable WebPush notifications, your dapp must
- Initialize Notifi's [frontend-client](https://github.com/notifi-network/notifi-sdk-ts/tree/main/packages/notifi-frontend-client) or [notifi-react](https://github.com/notifi-network/notifi-sdk-ts/tree/main/packages/notifi-react-card) packages with standard [wallet-sign auth](https://github.com/notifi-network/notifi-sdk-ts/blob/main/packages/notifi-wallet-provider/README.md), or using OAUTH2/OIDC.
- Allow a [service worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) to run in the background. This is already assumed if you're building a [PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Tutorials/js13kGames/Offline_Service_workers).
- Create a Vapid key with our Notifi service. For now, please contact Notifi to get this setup. In the future, you will be able to configure your Vapid keys on Notifi Admin Portal.

<br/><br/>

# Installation
1. Call ```npm install @notifi-network/notifi-web-push-service-worker```
2. Use web pack or some other bundler to copy the 
    - For webpack on a NextJs app:
      - Update the webpack config like below. It will copy the service worker file from node_modules into your public/ directory
```
import CopyPlugin from 'copy-webpack-plugin';

...
    config.plugins.push(
      new CopyPlugin({
        patterns: [
        {
          from: './node_modules/@notifi-network/notifi-web-push-service-worker/dist/notifi-service-worker.js',
          to: "../public/"
        },
        ],
      }),
    );
...
```
This is done because service worker must be a static js file and expose it to your NextJs app.

<br/><br/>

# Subscribing for WebPush notifications
Subscribing for WebPush notifications is a mult-step process.
1. Initialize service worker
2. Upon initializing the Notifi FE client or Notifi React card, call the service worker endpoint to let the service worker know that the user has signed into Notifi.
3. Request the user for [Notification permissions](https://developer.mozilla.org/en-US/docs/Web/API/Notification/requestPermission_static) and call the service worker to let the service worker know that permissions for web push have been granted. Requirements for each OS/browser is different. Please look at the requirements for the each OS/browser.

Once these steps have been fulfilled, PWA users will receive all alerts created via the notifi-frontend-client or notifi-react packages.

## Initialize Service Worker
```tsx
import { initWebPushServiceWorker } from '@notifi-network/notifi-web-push-service-worker';

/* This is some class/object in your frontend app that is an appropriate place to initialize the service worker.*/
export default function Home() {
  React.useEffect(() => {
    initWebPushServiceWorker()
  }, []);
}
```
## Create Web Push Subscription
The service worker needs to be informed if it can create a web push subscritions in two different places. First, after user authorization has completed in the Notifi FE client or Notifi React Card. Second, after the user has granted [explicit permissions for web push notifcations](https://developer.mozilla.org/en-US/docs/Web/API/Notification/requestPermission_static). The following endpoint, ```tryCreateWebPushSubscription```, will call the service worker to attempt to register a web push subscription and subscribe the user to Notifi alerts. If any of these conditions are not fulfilled, the service worker will not create a web push subscription.

The code below calls the service worker to try creating a web push subscription after the Notifi React card has completed the user authorization flow.
```tsx
import { useNotifiFrontendClientContext } from '@notifi-network/notifi-react';
import { tryCreateWebPushSubscription } from '@notifi-network/notifi-web-push-service-worker';

...

export default function NotifiContextWrapper() {
  ...
  const { frontendClientStatus } = useNotifiFrontendClientContext();

  /* Ensure authorization via wallet-sign or OIDC flow has succeeded before calling this. Calling before will result in nothing happening */
  React.useEffect(() => {
    if (frontendClientStatus.isAuthenticated && idToken) {
      const userAccount = (jwtDecode(idToken) as CustomJwtPayload).email
      tryCreateWebPushSubscription(userAccount, process.env.NEXT_PUBLIC_TENANT_ID ?? '', process.env.NEXT_PUBLIC_ENV ?? '');
    }
  }, [idToken, frontendClientStatus]);
  ... 
}
```

<br/><br/>

# Sending Web Push Notificaitons
Once you have successfully subscribed to web push, you can send a web push notification on Notifi's [Community Manager](https://admin.notifi.network/community). Sign into your Notifi admin credentials and navigate to the Community Manager tab. Make sure to select the Browser destination to send web push messages.