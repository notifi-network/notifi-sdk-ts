# Notifi React SDK

`@notifi-network/notifi-react` accelerates the development of Notifi integrated dapps by providing:

- Out-of-the-box React components (`NotifiCardModal`) by which developers can just plug and play.

- React Contexts for more advanced use cases in case developers want to build their own UI components.

> Give it a hand-on by checking out the [example project](https://notifi-sdk-ts-vercel-notifi-react-example-v2.vercel.app/)

## React Components (NotifiCardModal)

Dapp developers can easily mount the `NotifiCardModal` component to their dapp to enable the Notifi notification service without any hassle. The `NotifiCardModal` component provides the following features:

1. login Notifi services

2. manage (subscribe/unsubscribe) topics

3. manage (add/remove) targets

4. Preview notification details

### Getting Started

1. Make sure the react environment is set up properly with the following dependencies:

- Node version >= 18 (with corresponding npm version)
- React version >= 17

2. Make sure you have a Notifi tenant account. we will need the following information to set up the `NotifiCardModal`.

- tenantId
- cardId

> You can register a new tenant through [Notifi Admin Portal](https://admin.notifi.network/) for free if you do not have one yet.
> Check out the [detail here](https://docs.notifi.network/docs/getting-started)

#### Mount `NotifiCardModal` to your dapp

1. Wrap your app with `NotifiContextProvider`

```tsx
import { NotifiFrontendClientProvider } from '@notifi-network/notifi-react';

const App = () => {
  const params = {
    // params for contexts
  };
  return (
    <NotifiContextProvider {...params}>
      <App />
    </NotifiContextProvider>
  );
};
```

2. Mount `NotifiCardModal` component to wherever you want in your dapp.

```tsx
import { NotifiCardModal } from '@notifi-network/notifi-react';

const MyComponent = () => {
  const cardModalParams = {
    // params for NotifiCardModal
  };
  return <NotifiCardModal {...cardModalParams} />;
};
```

> [Check out the example project](https://notifi-sdk-ts-vercel-notifi-react-example-v2.vercel.app/) which is powered by next.js 14 app router.

#### Customize the card style

The style of `NotifiCardModal` is fully customizable. There are two approaches to customize the card style:

1. Global css override (Recommended): By overriding the default css class, we can style almost all the elements in the card. [Check out the default css class here](https://github.com/notifi-network/notifi-sdk-ts/tree/stage-notifi-react-m2/packages/notifi-react/lib/style)

2. Custom css class: it is allowed to pass in the custom css class to the `NotifiCardModal` component. This requires the more advanced understanding of the `NotifiCardModal` component structure. And example to adopt custom class to card modal container below.

   ```tsx
   const YourComponent = () => {
     // ...
     const customClassName: NotifiCardModalProps['classNames'] = {
       container: 'custom-card-modal-container',
     };

     return (
       <>
         {/*  ... */}
         <NotifiCardModal classNames={customClassName} />
         {/*  ... */}
       </>
     );
   };
   ```

   > **NOTE** Before start implementing this, make sure you have a good understanding of the `classNames` property structure in the `NotifiCardModal` component.
   > Check out the `classNames` property [structure here](https://github.com/notifi-network/notifi-sdk-ts/blob/238add5a222d113ac7fdb90898b4c8dd8c584929/packages/notifi-react/lib/components/NotifiCardModal.tsx#L39)

#### Customize the copy text

The copy text in the `NotifiCardModal` is fully customizable by inserting the custom copy text object to the `NotifiCardModal` component.

> **NOTE** Before start doing this, make sure you have a good understanding of the `copy` property structure in the `NotifiCardModal` component.
> Check out the `copy` prop [structure here](https://github.com/notifi-network/notifi-sdk-ts/blob/238add5a222d113ac7fdb90898b4c8dd8c584929/packages/notifi-react/lib/components/NotifiCardModal.tsx#L32)

An often-used example is the destination (target) input separator customization like below:
![](https://i.imgur.com/Rxld99Q.png)

You can customize the separator copy `OR` by passing the `customCopy` object to the `NotifiCardModal` component.

```tsx
const YourComponent = () => {
  // ...
  const { frontendClientStatus } = useNotifiFrontendClientContext();
  const customCopy: NotifiCardModalProps['copy'] = {
    Ftu: {
      FtuTargetEdit: {
        TargetInputs: {
          inputSeparators: {
            email: 'OR',
            sms: 'OR',
            telegram: 'OR',
          },
        },
      },
    },
    Inbox: {
      InboxConfigTargetEdit: {
        TargetInputs: {
          inputSeparators: {
            email: 'OR',
            sms: 'OR',
            telegram: 'OR',
          },
        },
      },
    },
  };

  return (
    <>
      {/*  ... */}
      <NotifiCardModal copy={customCopy} />
      {/*  ... */}
    </>
  );
};
```

## Notifi React Contexts (Advanced)

If you want to build your own UI components instead of using the `NotifiCardModal`, you can use the Notifi React Contexts to access the Notifi core services.

Two main concepts in Notifi React Contexts:

1. **NotifiContextProvider**: A provider to wrap your dapp with all the Notifi contexts.
2. **specific contexts**: The specific contexts to provide the specific Notifi services.
   - **NotifiFrontendClientContext**: Provide the Notifi Frontend Client instance and also the auth status (authenticated, initiated, or expired)
   - **NotifiTenantConfigContext**: Provide the tenant configuration.
   - **NotifiUserSettingContext**: Provide the user specific methods and state
   - **NotifiTargetContext**: Provide Notifi Target (destination) related methods and state.
   - **NotifiTopicContext**: Provide the topic related methods and state.

By simply wrap the app with `NotifiContextProvider` like below, you can access the Notifi services in your dapp.

```tsx
import { NotifiContextProvider } from '@notifi-network/notifi-react';

const App = () => {
  const params = {
    // params for contexts
  };
  return (
    <NotifiContextProvider {...params}>
      <MyComponent />
    </NotifiContextProvider>
  );
};
```

Or use particular contexts to access the specific Notifi services.

```tsx
import {
  NotifiFrontendClientProvider,
  NotifiTenantConfigProvider,
} from '@notifi-network/notifi-react';

const App = () => {
  const params = {
    // params for contexts
  };
  return (
    <NotifiFrontendClientProvider {...params}>
      <NotifiTenantConfigProvider {...params}>
        <MyComponent />
      </NotifiTenantConfigProvider>
    </NotifiFrontendClientProvider>
  );
};
```

In the following sections, we will introduce the specific contexts in more detail and how to use them.

### **NotifiFrontendClientContext**

Provide the Notifi Frontend Client instance and also the auth status (authenticated, initiated, or expired)

```tsx
import { useNotifiFrontendClientContext } from '@/context/NotifiFrontendClientContext';

export const MyComponent = () => {
  const { login, frontendClientStatus, frontendClient } =
    useNotifiFrontendClientContext();

  // Other code ...
};
```

1. **login**: A function to trigger the login process.
2. **frontendClientStatus**: The status of the frontend client, it can be one of the following:
   - **INITIATED**: The frontend client is initiated but not authenticated.
   - **AUTHENTICATED**: The frontend client is authenticated.
   - **EXPIRED**: The frontend client is expired.
3. **frontendClient**: The frontend client instance. You can use it to interact with the Notifi backend services.

### **NotifiTenantConfigContext**

Provide the tenant configuration.

```tsx
import { useNotifiTenantConfigContext } from '@/context/NotifiTenantConfigContext';

export const MyComponent = () => {
  const { cardConfig, inputs, isLoading, error, fusionEventTopics } =
    useNotifiTenantConfigContext();

  // Other code ...
};
```

1. **cardConfig**: The card ui configuration set in Notifi Admin portal.
2. **inputs**: `input` is a special concept which is used when the dynamic topic subscription value needs to be adopted. One example is that we want to allow a user to subscribe the topic which relates to his/her specific wallet address' state (eg, a transition signed by the wallet). This case, we need to somehow pass the wallet address to the topic subscription. The `input` is the place to store the dynamic value.

The `input` is a key-value pair object. The key is the value associated with the `Create a new topic` section in Admin Portal. The value is the dynamic value that needs to be passed into the topic subscription. The value needs to be an array of [InputObject](https://github.com/notifi-network/notifi-sdk-ts/blob/439023715e78ca1b02eab363a19c4bad51038cdd/packages/notifi-frontend-client/lib/models/FusionEvent.ts#L24) interface.

![Notifi Admin Portal UX](https://i.imgur.com/eJlqMdZ.png)

- Case 1: `Wallet Address` is selected, the key is set to `walletAddress`. So the `input` will be `{ walletAddress: [{label: '', '<user_wallet_address>'}] }`
- Case 2: `No input From User` is selected, we do not need to specify the `inputs` object.
- Case 3: `User Selects From List` is selected with a self-defined value. It means we want to allow users to select preferred targets to subscribe. For example, we want to allow users to define multiple smart contracts' state change (eg. staked value changed). So we want to provide a list of options for users to select. If we set `farm` in Admin portal UX in `User Selects From List` section. And we want to allow to have `BTC/ETH farm` and `BTC/USDT farm`, we can set the `inputs` object to `{ farm: [{label: 'BTC/ETH farm', value: 'BTC-ETH'}, {label: 'BTC/USDT farm', value: 'BTC-USDT'}] }`. The `value` is the value that will be passed to the topic subscription.

> **NOTE** the `value` in the `InputObject` should associate with the subscription value in the parser. `label` is the display name in the UI.
>
> - [more info](https://docs.notifi.network/docs/next/notifi-hosted-development)

3. **fusionEventTopics**: The detail info of the fusion event topics in the specific ui card config. See the interface [here](https://github.com/notifi-network/notifi-sdk-ts/blob/439023715e78ca1b02eab363a19c4bad51038cdd/packages/notifi-react/lib/context/NotifiTenantConfigContext.tsx#L18)

> **IMPORTANT** to use `NotifiTenantConfigContext`, you need to wrap your component with `NotifiFrontendClientContext` first.

### **NotifiUserSettingContext**

Provide the user specific methods and state

```tsx
import { useNotifiUserSettingContext } from '@notifi-network/notifi-react';

export const MyComponent = () => {
  const { ftuStage, updateFtuStage, isLoading, error } =
    useNotifiUserSettingContext();

  // Other code ...
};
```

1. **ftuStage**: The current First Time User stage of the user.

2. **updateFtuStage**: A function to update the FTU stage of the user.

> **IMPORTANT** to use `NotifiUserConfigContext`, you need to wrap your component with `NotifiFrontendClientContext` first.

### **NotifiTargetContext**

Provide Notifi Target (destination) related methods and state.
`Target` is an important concept in Notifi. It is the destination which need to be notified when the specific event is triggered. Notifi currently supports the following targets:

- Email
- Telegram
- sms
- discord
- slack
- more to come...

```tsx
import { useNotifiTargetContext } from '@notifi-network/notifi-react';

export const MyComponent = () => {
  const {
    error,
    isLoading,
    renewTargetGroup,
    unVerifiedTargets,
    isChangingTargets,
    targetDocument: {
      targetGroupId,
      targetInputs,
      targetData,
      targetInfoPrompts,
    },
    updateTargetInputs,
  } = useNotifiTargetContext();

  // Other code ...
};
```

1. **renewTargetGroup**: A function to renew the target group. `targetGroup` is a group of targets which owned by the user.

2. **unVerifiedTargets**: The list of targets which are not verified yet.

3. **targetInputs**: The targetInputs is the temporary storage which reflects the on-demand target input changes. It is used to store the target input changes before the user confirms the changes.

4. **isChangingTargets**: if a target is under changing status, it means the users are changing the target inputs and has the unsaved changes.

5. **targetInfoPrompts**: The targetInfoPrompts is the prompt message which is used to guide the user to input the target information.

6. **updateTargetInputs**: A function to update the target inputs. It is used to update the target when the user changes the target inputs.

7. **renewTargetGroup**: A function to update backend target state according to the targetInputs.

8. **TargetGroupId**: The target group id which is the arg to call `renewTargetGroup` function.

9. **targetData**: The target data which is the backend target state.

> **IMPORTANT** to use `NotifiTargetContext`, you need to wrap your component with `NotifiFrontendClientContext` first.

### **NotifiTopicContext**

Provide the topic related methods and state.
`Topic` is an important concept in Notifi. It is the prototype that shapes the event which will be triggered. Users are able to `subscribe` a certain topic to receive the notification when the event is triggered.

> **IMPORTANT CONCEPT**
> Once the users subscribe a topic, notifi service creates an `Alert` object belong to the users associated with the topic.
> [more info](https://github.com/notifi-network/notifi-sdk-ts/blob/439023715e78ca1b02eab363a19c4bad51038cdd/packages/notifi-react/lib/context/NotifiTopicContext.tsx#L60)

```tsx
import { useNotifiTopicContext } from '@notifi-network/notifi-react';

export const MyComponent = () => {
  const {
    isLoading,
    error,
    subscribeAlertsDefault,
    unsubscribeAlert,
    isAlertSubscribed,
    subscribeAlertsWithFilterOptions,
    getAlertFilterOptions,
    getTopicStackAlerts,
  } = useNotifiTopicContext();

  // Other code ...
};
```

1. **subscribeAlertsDefault**: A function to subscribe topic with the default filterOptions. This will create alerts for the user.

2. **unsubscribeAlert**: A function to unsubscribe the topic. This will remove the alert object from the user's alert list.

3. **isAlertSubscribed**: A function to check if the topic is subscribed (whether the alert object is created).

4. **subscribeAlertsWithFilterOptions**: A function to subscribe the topic with custom filter options. This will create alerts for the user.

5. **getAlertFilterOptions**: A function to get the filter options from the subscribed topic (`Alert` object).

6. **getTopicStackAlerts**: A function to get the subscribed stackable topic. (`Alert` objects).

> Notifi provides an example project to showcase the usage of the Notifi React Context. You can find the example project [here](https://github.com/notifi-network/notifi-sdk-ts/tree/main/packages/notifi-card-modal-example)
> For more comprehensive information, please refer to [notifi-dapp-example](https://github.com/notifi-network/notifi-sdk-ts/tree/main/packages/notifi-dapp-example)

> **IMPORTANT** to use `NotifiTopicContext`, you need to wrap your component with `NotifiFrontendClientContext` first.

### **NotifiHistoryContext**

Check or manipulate the history notification items of the connected user account.

```tsx
import { useNotifiHistoryContext } from '@notifi-network/notifi-react';

export const MyComponent = () => {
  const {
    isLoading,
    error,
    getHistoryItems,
    markAsRead,
    historyItems,
    unreadCount,
    hasNextPage,
  } = useNotifiHistoryContext();

  // Other code ...
};
```

1. **getHistoryItems**: A function to get the history notification items. This method will update the `historyItems` state. It takes `(initialLoad?: boolean)` as input args. If `initialLoad` is true, it will clean up the `historyItem` and fetch the first page of the history items. If `initialLoad` is `undefined` or `false`, it will fetch the next page from existing page cursor. You can use `hasNextPage` to check if there is more page to fetch.
2. **markAsRead**: A function to mark all or particular notification items as read. it takes`(ids?: string[])` as input. If `ids` is not provided, it will mark all the items as read.
3. **historyItems**: The history notification items.
4. **unreadCount**: The unread notification count in `historyItems`.
5. **hasNextPage**: A boolean to check if there is more page to fetch. If `true`, calling `getHistoryItems()` will fetch the next page.

> **IMPORTANT** to use `NotifiHistoryContext`, you need to wrap your component with `NotifiFrontendClientContext` first.

> **NOTE**
> page count is set to 20 by default. You can change the page count by setting the `notificationCountPerPage` in the `<NotifiContextProvider />`or `<NotifiHistoryContextProvider />` Property.
>
> Check the example [here](https://github.com/notifi-network/notifi-sdk-ts/blob/1885f21a93160f8f222700c39b1fbc34b12edea0/packages/notifi-react-example-v2/src/context/NotifiContextWrapper.tsx#L121)

## Migrate from `@notifi-network/notifi-react-card` (v0.) to `@notifi-network/notifi-react` (v1.)

`@notifi-network/notifi-react` is a major upgrade of `@notifi-network/notifi-react-card`. `@notifi-network/notifi-react` provides more advanced features by adopting the new Notifi infrastructure (called `fusion`). Migrating to `@notifi-network/notifi-react` will have the following benefits:

- **Optimized bundle size**: the package size of has a significant reduction (~20%)
- **Better efficiency and performant**: the network request amount is reduced significantly. (~50%)
- **Better UI & UX**: The new UI/UX design is more user-friendly and intuitive.
- **Advanced new features**: support Notifi Admin Portal V2 new features. Check out Notifi Admin Portal V2 [here](https://admin.notifi.network/) for more information.

> **IMPORTANT** > `@notifi-network/notifi-react-card` will no longer be maintained. Please use the `@notifi-network/notifi-react` if you are new to the Notifi React SDK.
> For the existing Dapp which is already utilizing `@notifi-network/notifi-react-card`, you can easily do the migration by following the migration guide below.

### Migration Guide

As `@notifi-network/notifi-react` is a separate package from `@notifi-network/notifi-react-card`, new package installation is required.

```json
// package.json
{
  // ...
  "dependencies": {
    "@notifi-network/notifi-frontend-client": "^1.0.0",
    "@notifi-network/notifi-graphql": "^1.0.0",
    "@notifi-network/notifi-react": "^1.0.0"
  }
  // ...
}
```

### Step 1: Replace the `NotifiContext` with the `NotifiContextProvider`

Most of input props of the `NotifiContextProvider` are the same as `NotifiContext`. The only differences are listed below:

**Deprecated props:**

- `alertConfigurations`(Optional) is deprecated. (No longer needed)
- `keepSubscriptionData` (Optional) is deprecated. (No longer needed)
- `multiWallet` (Optional) is deprecated. (No longer needed)
- `isUsingFrontendClient` (Optional) is deprecated. (No longer needed)

**Newly added props:**

- `tenantId` (Required): The `tenantId` property originally was set in the `NotifiSubscriptionCard` component as `dappAddress`. Now it is moved to context provider level.

- `cardId` (Required): The `cardId` property originally was set in the `NotifiSubscriptionCard` component. Now it is moved to context provider level.

- `notificationCountPerPage` (Optional): The `notificationCountPerPage` property is used to set the number of notifications per fetch in the notification history. The default value is `20`.

- `toggleTargetAvailability` (Optional): The `toggleTargetAvailability` property is used to enable/disable the target availability feature. The default value depends on the active destinations set in the Notifi Admin Portal. See below, more detail [click here](https://github.com/notifi-network/notifi-sdk-ts/blob/8bb68f8f661e0c41f4411adec2cd9f12df0e5bcb/packages/notifi-react/lib/context/NotifiTargetContext.tsx#L82)

### Step 2: Replace the `<NotifiSubscriptionCard />` with the `<NotifiCardModal />`

Most of the props of `NotifiCardModal` are the same as `NotifiSubscriptionCard`. The only differences are listed below:

**Deprecated props:**

- `loadingSpinnerSize` (Optional) is deprecated. (No longer needed as we can use css override to customize the spinner size)

- `loadingSpinnerColor` (Optional) is deprecated. (No longer needed as we can use css override to customize the spinner color)

- `cardId` (Optional) is deprecated. (No longer needed as we can set the `cardId` in the `NotifiContextProvider`)

- `inputLabels` and `inputSeparators` (Optional) is deprecated. Instead, we can use the `copy` prop to customize the input labels. (See below)

```tsx
const copy: NotifiCardModalProps['copy'] = {
  Ftu: {
    FtuTargetEdit: {
      TargetInputs: {
        inputSeparators: {
          email: 'OR',
          sms: 'OR',
          telegram: 'OR',
          discord: 'OR',
        },
        targetInputFields: {
          email: {
            label: 'Email',
            placeholder: 'Enter your email',
          },
        },
      },
    },
  },
  Inbox: {
    InboxConfigTargetEdit: {
      TargetInputs: {
        inputSeparators: {
          email: 'OR',
          sms: 'OR',
          telegram: 'OR',
          discord: 'OR',
        },
        targetInputFields: {
          email: {
            label: 'Email',
            placeholder: 'Enter your email',
          },
        },
      },
    },
  },
};
// ...
<NotifiCardModal copy={copy} />;
```

> More example in [`@notifi-network/notifi-react-example-v2`](https://github.com/notifi-network/notifi-sdk-ts/blob/8bb68f8f661e0c41f4411adec2cd9f12df0e5bcb/packages/notifi-react-example-v2/src/app/notifi/components-example/page.tsx#L19)

**Newly added props:**

- N/A

**On-going (TODO)**

- `disclosureCopy` (Optional): Not supported yet. but it is planned to be removed and make use of the `copy` prop instead (TBD)

- `onClose` (Optional)

### Step 3 Restyle the card by using the css override

Since the Component layout has significant changes, the css classes of the `NotifiCardModal` are also changed significantly. If you are already using the existing `NotifiSubscriptionCard` with css override, you might need to deprecate all the css classes and re-implement the css override.
For more detail about CSS classes, please refer to the [source code](https://github.com/notifi-network/notifi-sdk-ts/tree/main/packages/notifi-react/lib/style)

### Step 4: Remove all the related code of the `@notifi-network/notifi-react-card`

- Remove the `@notifi-network/notifi-react-card` package from the `package.json` file.

- Remove the `NotifiSubscriptionCard` component from the codebase.

- Remove the `NotifiContext` component from the codebase.

- Remove the legacy css override related to the `NotifiSubscriptionCard`.
