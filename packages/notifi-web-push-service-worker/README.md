# Notifi React SDK

`@notifi-network/notifi-web-push-service-worker` allows your PWA to subscribe to WebPush notifications

> Take a look at our example implementation to see how to import and activate the worker [React Example](https://github.com/notifi-network/notifi-sdk-ts/tree/main/packages/notifi-react-example-v2)

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

<br/><br/>

# Subscribing for WebPush notifications
All alerts created via the notifi-frontend-client or notifi-react packages will automatically get published here once successfully initialized below.
```tsx
import { initWebPushServiceWorker } from '@notifi-network/notifi-web-push-service-worker';

  /* This is some class/object in your frontend app that is an appropriate place to start the notifications service.
     Ensure authorization via wallet-sign or OIDC flow has succeeded before calling this. Calling before will result
     in nothing happening */
export default function Home() {
  React.useEffect(() => {
    initWebPushServiceWorker()
  }, []);
}
```
<br/><br/>

# Unsubscribing from WebPush notifications
This will disable notifications coming in for WebPush. To manage alerts and other destinations, please continue to use the full notifi-frontend-client or notifi-react packages.
```tsx
function unsubscribePushManger() {
  navigator.serviceWorker.ready.then((reg) => {
    reg.pushManager.getSubscription().then((subscription) => {
      if (subscription) {
        subscription
          .unsubscribe()
          .then((successful) => {
            console.log("Successfully unsubscribe push manager")
          })
          .catch((e) => {
            console.error("Failed to unsusbcribe push manager")
          });
      }
    });
  });
}

return (
    <button
        onClick={() => {
          unsubscribePushManger();
        }}
      >
        Unsubscribe push subscription
    </button>
)
```
