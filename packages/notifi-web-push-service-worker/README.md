# Notifi Web Push Service Worker SDK

`@notifi-network/notifi-web-push-service-worker` allows your PWA to subscribe to WebPush notifications

<br/><br/>

## Prerequisites

- Node version >= 18 (with corresponding npm version)
- React version >= 17

> - If you haven't created a Notifi tenant account yet [set up an account](https://admin.notifi.network/signup?environment=prd)
> - In order to enable WebPush notifications, your dapp must
>
>   - Create a Vapid key with our Notifi service. For now, please contact Notifi to get this setup. In the future, you will be able to configure your Vapid keys on [Notifi Admin Portal](https://admin.notifi.network/).
>   - Authenticate users by using [@notifii-network/notifi-react](https://github.com/notifi-network/notifi-sdk-ts/tree/main/packages/notifi-react) or [@notifi-network/notifi-frontend-client](https://github.com/notifi-network/notifi-sdk-ts/tree/main/packages/notifi-frontend-client)
>   - Allow a [service worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) to run in the background. This is already assumed if you're building a [PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Tutorials/js13kGames/Offline_Service_workers).

<br/><br/>

## Installation & Setup

1. Call `npm install @notifi-network/notifi-web-push-service-worker`
2. Config Webpack or some other bundler to copy the `notifi-service-worker.js` file to the public directory. The following is an example of how to config with Next.js app.

```ts
// ./next.config.mjs (or ./next.config.js)
// Expose notifi-service-worker.js file to public directory
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

> This is done because `notifi-service-worker.js` file has to be accessible on `https://web-domain/notifi-service-worker.js`.

<br/><br/>

## Getting Started

Enabling WebPush notifications is a multi-step process. In the PWA, we need to ensure:

1. **Initialize (register) service worker**
2. **Sign into Notifi services**: There are two ways to connect your app with Notifi services.

   - Using `@notifi-network/notifi-react` npm package's [out-of-the-box UI component](https://github.com/notifi-network/notifi-sdk-ts/blob/main/packages/notifi-react/README.md#mount-the-notificardmodal-to-your-dapp) or [NotifiFrontendClientContext](https://github.com/notifi-network/notifi-sdk-ts/blob/main/packages/notifi-react/README.md#notififrontendclientcontext)'s `frontendClient` object to authenticate the user.
   - Using `@notifi-network/notifi-frontend-client` [npm package](https://github.com/notifi-network/notifi-sdk-ts/blob/main/packages/notifi-frontend-client/README.md#-authorization) if your app is not using React or you are looking for more advanced control over the subscription process.

3. **Subscribe topics**: Make sure the users have subscribed to particular topics from which they want to receive notifications.

   - Using `@notifi-network/notifi-react` npm package's [out-of-the-box UI component](https://github.com/notifi-network/notifi-sdk-ts/blob/main/packages/notifi-react/README.md#mount-the-notificardmodal-to-your-dapp)
   - Using `@notifi-network/notifi-notifi-react` npm package's context method: [subscribeAlertsDefault or subscribeAlert](https://github.com/notifi-network/notifi-sdk-ts/blob/main/packages/notifi-react/README.md#notifitopiccontext)
   - Using `@notifi-network/notifi-frontend-client` [npm package](https://github.com/notifi-network/notifi-sdk-ts/blob/main/packages/notifi-frontend-client/README.md#-authorization) if your app is not using React or you are looking for more advanced control over the subscription process.

4. **Browser Notification permissions**: Request the user for [Browser Notification permissions](https://developer.mozilla.org/en-US/docs/Web/API/Notification/requestPermission_static) and call the service worker to let the service worker know that permissions for web push have been granted.
   - [Browsers](https://help.thrivenow.in/49/enable-push-notifications-browser-chrome-safari-firefox-edge)
5. **OS Notification permissions**: Enable browser app's notification permission for the operation system. Requirements for each OS/browser is different. Please check each requirements for different OS/browsers.

   - [MacOS](https://support.apple.com/guide/mac-help/notifications-settings-mh40583/mac)
   - [iOS](https://support.apple.com/en-us/HT201925)
   - [Windows](https://support.microsoft.com/en-us/windows/change-notification-and-quick-settings-in-windows-ddcbbcd4-0a02-f6e4-fe14-6766d850f294)

### Enable WebPush notifications

This SDK introduces two helper methods to easily enable WebPush notifications.

- `initWebPushServiceWorker` - Initializes & register notifi service worker.
- `tryCreateWebPushSubscription` - Attempts to create a web push subscription.

### `initWebPushServiceWorker` method

This allow to register the out-of-the-box service worker.

```tsx
import { initWebPushServiceWorker } from '@notifi-network/notifi-web-push-service-worker';

/* This is some class/object in your frontend app that is an appropriate place to initialize the service worker.*/
export default function Home() {
  React.useEffect(() => {
    initWebPushServiceWorker();
  }, []);
}
```

> Reference: [source code](TODO-after-merge)

##### **NOTE**

If already using a existing service worker and also want to utilize Notifi service worker, you can use `importScripts` in your existing service worker to include the Notifi service worker rather than using `initWebPushServiceWorker`.

```js
// existing-service-worker.js
importScripts('https://web-domain/notifi-service-worker.js');

// Your existing service worker code ...
```

### `tryCreateWebPushSubscription` method

This method asks the service worker to attempt to register a web push subscription.

> **NOTE**: If any of these conditions below are not fulfilled, the service worker will NOT create a web push subscription.
>
> - The user has successfully been authenticated to Notifi service (Refer to the [getting started](#getting-started) section).
> - The user has granted [explicit permissions for web push notifications](https://developer.mozilla.org/en-US/docs/Web/API/Notification/requestPermission_static).

Here is an example using `tryCreateWebPushSubscription` to enable web push notifications.

```tsx
import { useNotifiFrontendClientContext } from '@notifi-network/notifi-react';
import { tryCreateWebPushSubscription } from '@notifi-network/notifi-web-push-service-worker';
import { jwtDecode } from 'jwt-decode';
...

export default function YourComponent() {
  const { frontendClientStatus } = useNotifiFrontendClientContext();
  const  idToken  = '<user-id-token>' // get idToken from your auth provider
  const notifiTenantId = '<notifi-tenant-id>'
  const notifiEnv = '<notifi-env>'

  // ... other code

  const enableWebPush = React.useCallback(() => {
    if (frontendClientStatus.isAuthenticated && idToken) {
      const userAccount = (jwtDecode(idToken) as CustomJwtPayload).email; // Or chose whatever unique identifier you want to use

      tryCreateWebPushSubscription(
        userAccount,
        notifiTenantId,
        notifiEnv,
      );
    }
  }, [frontendClientStatus.isAuthenticated, idToken]);

  const enableBrowserNotification = () => {
     Notification.requestPermission()
  };

  return (
    <div>
      {Notification.permission !== 'granted' ? (
        <div onClick={enableBrowserNotification}>
          Enable Browser notification permission
        </div>
      ) : null}
      {Notification.permission === 'granted' ? (
        <>
          <div className="btn" onClick={enableWebPush}>
            Enable notifi web push
          </div>
          <div>
            <NotifiCardModal darkMode />
          </div>
        </>
      ) : null}
    </div>
  );
}
```

<br/><br/>

## Sending Notifications

Once you have successfully subscribed to web push, you can send a web push notification on Notifi's [Community Manager](https://admin.notifi.network/community). Sign into your Notifi admin credentials and navigate to the Community Manager tab. Make sure to select the `Browser` destination to send web push messages.

![](https://i.imgur.com/2Nw3Hp4.png)
