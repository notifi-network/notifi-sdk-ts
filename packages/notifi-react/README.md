# Notifi React SDK

`@notifi-network/notifi-react` accelerates the development of Notifi integrated dapps.

- [Out of The Box Implementation](#out-of-the-box-implementation)
- [Customized Implementation](#advanced-customized-implementation)
- [Custom Integration](#custom-integration)
- [Migrating from an older version of the SDK ](#migrate-your-card)

> Play around with a Card [Example](notifi-sdk-ts-notifi-dapp-example.vercel.app)

<br/><br/>

# Out of The Box Implementation

Dapp developers can easily mount the `NotifiCardModal` component to their dapp to enable the Notifi notification service. The `NotifiCardModal` component provides the following features to the user:

- Login to Notifi Services

- Manage Subscriptions to Notifications

- Manage Targets/Channels for Notifications

- Preview Notification Details

<br/><br/>

## Getting Started

_Environment_

- Node version >= 18 (with corresponding npm version)
- React version >= 17

> If you haven't created a Notifi tenant account yet [set up an account](https://admin.notifi.network/signup?environment=prd)

<br/><br/>

### Mount the `NotifiCardModal` to your dApp

#### Prerequisites (**IMPORTANT**)

- To use `NotifiCardModal`, you need to wrap your component with `NotifiContextProvider` first.
- Notifi supports both `on-chain` and `off-chain` authentication. The authentication method differs based on the `WalletWithSignParams` [props](https://github.com/notifi-network/notifi-sdk-ts/blob/1457d642900b8969abb8f1ad353aaeb7059a6946/packages/notifi-react/lib/context/NotifiFrontendClientContext.tsx#L49) passed to the `NotifiContextProvider`.
  - For `on-chain` authentication, `walletBlockchain='<blockchain>'`, `signMessage` callback function, and the respective `wallet keys or addresses` for the `blockchain` are required. The common EVM blockchain example is shown above.
  - For `off-chain` authentication, `walletBlockchain='OFF_CHAIN'`, `signIn` callback function, and `userAccount` are required. `userAccount` can be any user-related unique identifier derived from a JWT token. The Google off-chain OIDC authentication example is shown below.

#### **Example Quick Start for Ethereum (On chain)**

```tsx
import {
  NotifiCardModal,
  NotifiContextProvider,
} from '@notifi-network/notifi-react';
import { useEthers } from '@usedapp/core';
import { providers } from 'ethers';

const NotifiCard = () => {
  const { account, library } = useEthers();
  const signer = useMemo(() => {
    if (library instanceof providers.JsonRpcProvider) {
      return library.getSigner();
    }
    return undefined;
  }, [library]);

  if (account === undefined || signer === undefined) {
    // account is required
    return null;
  }

  return (
    //tenantId/dAppId and cardId are found on the Notifi Tenant Portal. Please see Docs below.
    <NotifiContextProvider
      tenantId="YOUR_TENANT_ID"
      env="Production"
      cardId="YOUR_CARD_ID"
      signMessage={signMessage}
      walletBlockchain="ETHEREUM"
      walletPublicKey={account}
      {/* ... other optional props */}
    >
      <NotifiCardModal {/* ... other optional props ex. darkMode */} />
    </NotifiContextProvider>
  );
};
```

#### **Example Quick Start for google OIDC (Off chain)**

```tsx
const NotifiCard = () => {
  // ... other codes
  const jwt = '<the-oidc-id-token-here>';
  const userAccount = jwtDecode(jwt).email; // or any unique identifier
  const signIn: OidcSignInFunction = async () => {
    return {
      oidcProvider: 'GOOGLE',
      jwt,
    };
  };

  return (
    <NotifiContextProvider
      tenantId="YOUR_TENANT_ID"
      env="Production"
      cardId="YOUR_CARD_ID"
      walletBlockchain={'OFF_CHAIN'}
      userAccount={userAccount}
      signIn={signIn}
      {/* ... other optional props */}
    >
      <NotifiCardModal {/* ... other optional props ex. darkMode */} />
    </NotifiContextProvider>
  );
};
```

**Reference**

> - [Getting start Docs](https://docs.notifi.network/docs/getting-started)
> - Notifi supported blockchains: [WalletBlockchain Enum document](https://graphdoc.io/preview/enum/WalletBlockchain?endpoint=https://api.dev.notifi.network/gql/)
> - Notifi supported OIDC providers: [OidcProvider Enum document](https://graphdoc.io/preview/enum/OidcProvider?endpoint=https://api.dev.notifi.network/gql/)
> - To enable OIDC login, it requires additional setup to integrate your OIDC provider with Notifi tenant using [Notifi Admin Portal](https://admin.notifi.network/) check on the Notifi Documentation **(WIP: coming soon)**

<br/><br/>

# Advanced Customized Implementation

The style of the `NotifiCardModal` is fully customizable. There are two approaches to customize the card style:
<br/><br/>

## Customizing the Card Styling

#### **Global CSS override (_Recommended_)**

By overriding the default CSS classes, we can style the elements in the card.
[Default CSS Classes are found here.](https://github.com/notifi-network/notifi-sdk-ts/tree/main/packages/notifi-react/lib/style)

_Example_

```tsx
import '@/styles/notifi/index.css';
```

#### **Custom CSS class**

You can pass in custom CSS classes to the `NotifiCardModal` component.

> **NOTE** Before implementing, please review the `classNames` property structure in the `NotifiCardModal` component.
> View the `classNames` [structure here.](https://github.com/notifi-network/notifi-sdk-ts/blob/main/packages/notifi-react/lib/components/NotifiCardModal.tsx#L39)

_Example_

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

<br/><br/>

## Customizing the Card Copy

The copy text in the `NotifiCardModal` is fully customizable by inserting the custom copy text object to the `NotifiCardModal` component.

**Common Example 1: Customizing the destination separator**

Destination (Target) input separator copy customization as seen below:  
![](https://i.imgur.com/Rxld99Q.png)

> **NOTE** Before implementing, please review the `copy` property structure in the `NotifiCardModal` component.
> View the `copy` [structure here](https://github.com/notifi-network/notifi-sdk-ts/blob/main/packages/notifi-react/lib/components/NotifiCardModal.tsx#L32)

_Example code_

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

<br/><br/>

**Common Example 2: Customizing the Connect view footer**

Connect view footer preview as seen below:

![custom-footer-content](https://github.com/user-attachments/assets/8156b76b-2f8b-47a2-9a3e-d640fc8a4ae1)

_Example code_

```tsx
const YourComponent = () => {
  // ...
  const { frontendClientStatus } = useNotifiFrontendClientContext();
  const customCopy: NotifiCardModalProps['copy'] = {
    Connect: {
      footerContent: [
        {
          type: 'plain-text',
          text: 'This is an example of some footer content that may link to a ',
        },
        {
          type: 'hyperlink',
          text: 'privacy policy',
          url: 'https://notifi.network',
        },
        { type: 'plain-text', text: ' and ' },
        {
          type: 'hyperlink',
          text: 'terms of service',
          url: 'https://notifi.network',
        },
      ],
    },
    // ... other copy customization
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

> - Checkout the example project [codebase](https://github.com/notifi-network/notifi-sdk-ts/blob/main/packages/notifi-react-example-v2/src/app/notifi/components-example/page.tsx)

<br/><br/>

**Common Example 3: Adding the Close Icon on the Card**

Close Icon preview as seen below:

![close-icon-preview](https://github.com/user-attachments/assets/79de998f-9807-45cc-a4d7-583e6298d2e7)

_Example code_

```tsx
const YourComponent = () => {
  const [isCardModalOpen, setIsCardModalOpen] = React.useState(false);

  return (
    <>
      <NotifiCardModal
        globalCtas={{ onClose: () => setIsCardModalOpen(false) }}
        // The onClose function enables the close-icon on the card
        // We are passing a callback function here to update the local state and close the modal
      />
    </>
  );
};
```

# Custom Integration

If you want to build your own UI components instead of using the `NotifiCardModal`, you can use the Notifi React Context to access the Notifi core services.

<br/><br/>

### Important Notifi React Contexts:

- **NotifiContextProvider**: A provider to wrap your dapp with all Notifi contexts.
- **Specific Context Providers**:
  - **NotifiFrontendClientContext**: Provides the Notifi Frontend Client instance and user authentication status (Authenticated, Initiated, or Expired)
  - **NotifiTenantConfigContext**: Provides the tenant configuration.
  - **NotifiUserSettingContext**: Provides available user methods and states
  - **NotifiTargetContext**: Provides Notifi Target related methods and state.
  - **NotifiTopicContext**: Provides Topic related methods and state.

> By wrapping your app with `NotifiContextProvider`, you can access the Notifi services in your dapp.

_Example_

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

Or use particular contexts to access specific Notifi services.

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

<br></br>

## **NotifiFrontendClientContext**

Provides the Notifi Frontend Client and the user authentication status.

_Example_

```tsx
import { useNotifiFrontendClientContext } from '@/context/NotifiFrontendClientContext';

export const MyComponent = () => {
  const { login, frontendClientStatus, frontendClient } =
    useNotifiFrontendClientContext();

  // Other code ...
};
```

**Methods**

- **login**: A function to trigger the login process.

- **frontendClientStatus**: The status of the frontend client, it can be one of the following:
  - **initiated**: The frontend client/user has been initiated but not authenticated.
  - **authenticated**: The frontend client/user is authenticated.
  - **expired**: The frontend client/user is authentication/authorization expired.
- **frontendClient**: The frontend client instance, used to interact with the Notifi backend services.
- **loginViaTransaction**: SDK allows Dapp to auto login the user by utilizing this property. See the following detailed information.

  We can improve the user experience by auto-login the users as soon as they sign a transaction. This way, users no longer need to manually sign a message to login to Notifi. The `loginViaTransaction` property is used to achieve this feature.

  **Step1**: Wrap higher (top) level of dapp components with `<NotifiContextProvider>` (or `<NotifiFrontendClientProvider> `).
  **Step2**: put the `loginViaTransaction.nonce` as memo when user signs a transaction.
  **Step3**: Pass in the signature from `Step#2` to the `loginViaTransaction.login` method.

  <details>
  <summary>Example for EVM dapp</summary>

  **Case 1**: Plain transaction

  ```ts
  // Any component in the dapp which has access to the NotifiFrontendClientContext
  const {
    walletWithSignParams,
    loginViaTransaction: {
      nonce: nonceForTransactionLogin,
      login: loginViaTransaction,
    },
  } = useNotifiFrontendClientContext();
  // EVM transaction (Other supported chains also work in similar manner)
  const memo = nonceForTransactionLogin;
  const signature = await transactionSigner.request({
    method: 'eth_sendTransaction',
    params: [
      {
        from: walletWithSignParams.walletPublicKey,
        // ...
        data: memo,
      },
    ],
  });
  loginViaTransaction(signature);
  ```

  **Case 2**: smart contract transaction

  ```ts
  const {
    walletWithSignParams,
    loginViaTransaction: {
      nonce: nonceForTransactionLogin,
      login: loginViaTransaction,
    },
  } = useNotifiFrontendClientContext();

  const smartContract = new ethers.Contract(
    `<contract-address>`,
    `<contract-abi>`,
    provider.getSigner(),
  );

  // Assume the smart contract has an "example" method with one argument uint amount
  const amount = ethers.utils.parseUnits('0.1', 'ether');

  // Step 1: Get the calldata for the smart contract method call
  const calldata = smartContract.interface.encodeFunctionData('example', [
    amount,
  ]);

  // Step 2: Append notifi nonce to the calldata
  const txParams = {
    to: smartContract.address,
    data: calldata + nonceForTransactionLogin.replace('0x', ''),
  };

  // Step 3: Sign the transaction with new calldata
  const { hash } = await provider.getSigner().sendTransaction(txParams);

  // Step 4: Use the transaction signature to login to notifi
  loginViaTransaction(hash);
  ```

  **IMPORTANT NOTE**:

  - **Browser extension constraints**: Some browser extensions (Metamask ...) do not allow appending additional info to the calldata of particular smart contract method (example: Token contract (ERC20, ERC721 ...etc)). Browser extension (Metamask) will throw `Message: Invalid token value; should be exactly xx hex digits long` error in this case.

  </details>

## **NotifiTenantConfigContext**

Provides the tenant configuration.

```tsx
import { useNotifiTenantConfigContext } from '@/context/NotifiTenantConfigContext';

export const MyComponent = () => {
  const { cardConfig, inputs, isLoading, error, fusionEventTopics } =
    useNotifiTenantConfigContext();

  // Other code ...
};
```

- **cardConfig**: The card UI configuration set in Notifi Admin portal.
- **fusionEventTopics**: The detailed information of the fusion event topics in the specific UI card config. [Interface.](https://github.com/notifi-network/notifi-sdk-ts/blob/main/packages/notifi-react/lib/context/NotifiTenantConfigContext.tsx#L18)
- **inputs**: `input` is a concept which is used when a dynamic topic subscription value needs to be adopted. The `input` is a key-value pair object. The key is the value associated with the `Create a new topic` section in Admin Portal. The value is the dynamic value that needs to be passed into the topic subscription. The value needs to be an array of [InputObject](https://github.com/notifi-network/notifi-sdk-ts/blob/main/packages/notifi-frontend-client/lib/models/FusionEvent.ts#L24) interface.

<br></br>

**Example**:

We want to allow a user to subscribe the topic which relates to his/her specific wallet address' state (eg, a transaction signed by the wallet). In this case, we need to pass the wallet address to the topic subscription. The `input` is where we would store the dynamic value.

<br></br>

![Notifi Admin Portal UX](https://i.imgur.com/eJlqMdZ.png)

**Case 1**: `Wallet Address` is selected, the key is set to `walletAddress`. So the `input` will be

```
 input={ walletAddress: [{label: '', '<USER_WALLET_ADDRESS_GOES_HERE>'}] }
```

**Case 2**: `No input From User` is selected, we do not need to specify the `inputs` object.

**Case 3**: `User Selects From List` is selected with a self-defined value. It means we want to allow users to select preferred targets to subscribe.

- **Example**:  
  We want to allow users to define multiple smart contracts' state change (eg. staked value changed). So we want to provide a list of options for users to select. If we set `farm` in Admin portal UX in `User Selects From List` section. And we want to allow to have `BTC/ETH farm` and `BTC/USDT farm`, we can set the `inputs` object to `{ farm: [{label: 'BTC/ETH farm', value: 'BTC-ETH'}, {label: 'BTC/USDT farm', value: 'BTC-USDT'}] }`. The `value` is the value that will be passed to the topic subscription.

> **NOTE** the `value` in the `InputObject` should associate with the subscription value in the parser. `label` is the display name in the UI.
>
> - [Additional Documentation](https://docs.notifi.network/docs/next/notifi-hosted-development)

<br></br>

## **NotifiUserSettingContext**

Provides user specific methods and state.

```tsx
import { useNotifiUserSettingContext } from '@notifi-network/notifi-react';

export const MyComponent = () => {
  const { ftuStage, updateFtuStage, isLoading, error } =
    useNotifiUserSettingContext();
  // Other code ...
};
```

**Methods**

- **ftuStage**: The current First Time User stage of the user.

- **updateFtuStage**: A function to update the FTU stage of the user.

<br></br>

## **NotifiTargetContext**

Provides the Notifi Target related methods and state.
`Target` is an important concept in Notifi. It is the destination which need to be notified when the specific event is triggered. Notifi currently supports the following targets:

- Email
- Telegram
- SMS
- Discord
- Slack
- Want another destination? [Email Us](sales@notifi.network)

_Example_

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

**Methods**

- **renewTargetGroup**: A function to renew the target group. `targetGroup` is a group of targets which owned by the user.

- **unVerifiedTargets**: The list of targets which are not verified yet.

- **targetInputs**: The targetInputs is the temporary storage which reflects the on-demand target input changes. It is used to store the target input changes before the user confirms the changes.

- **isChangingTargets**: if a target is undergoing a change, it means the users are changing the target inputs and has unsaved changes.

- **targetInfoPrompts**: The targetInfoPrompts is the prompt message which is used to guide the user to input the target destination information.

- **updateTargetInputs**: A function to update the target inputs. It is used to update the target when the user changes/finalizes the target inputs.

- **renewTargetGroup**: A function to update the backend target state according to the targetInputs.

- **TargetGroupId**: The target group id which is the argument to call `renewTargetGroup` function.

- **targetData**: The target data which is the current state of the targets in the backend.

<br></br>

## **NotifiTopicContext**

Provide the topic related methods and state.
`Topic` is an important concept in Notifi. It is the prototype that shapes the event which will be triggered. Users are able to `subscribe` to certain topics in order to receive the notification when the event is triggered.

> **IMPORTANT CONCEPT**
> Once a user subscribes to a topic, Notifi Service creates an `Alert` object associated to the users with the respective topic.
> [Additional Information.](https://github.com/notifi-network/notifi-sdk-ts/blob/main/packages/notifi-react/lib/context/NotifiTopicContext.tsx#L60)

_Example_

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

**Methods**

- **subscribeAlertsDefault**: A function to subscribe to the respective topic with the default filterOptions. This will create an alert configuration for the user.

- **unsubscribeAlert**: A function to unsubscribe to the respective topic. This will remove the alert configuration from the user's alert list.

- **isAlertSubscribed**: A function to check if the topic is subscribed (This checks whether an alert configuration exists).

- **subscribeAlertsWithFilterOptions**: A function to subscribe to the respective topic with custom filter options. This will create an alert configuration for the user.

- **getAlertFilterOptions**: A function to get the filter options from the subscribed topic (`Alert` configuration/object).

- **getTopicStackAlerts**: A function to get the subscribed stackable topic. (`Alert` configuration/objects).

> Notifi provides an example project to showcase the usage of the Notifi React Context through this [Example.](https://github.com/notifi-network/notifi-sdk-ts/tree/main/packages/notifi-card-modal-example)  
> For more comprehensive information, please refer to the [notifi-dapp-example.](https://github.com/notifi-network/notifi-sdk-ts/tree/main/packages/notifi-dapp-example)

<br></br>

## **NotifiHistoryContext**

Check or manipulate the notification history of the connected users' account.

_Example_

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

**Methods**

- **getHistoryItems**: A function to get the notification history items. This method will update the `historyItems` state. It takes `(initialLoad?: boolean)` as input arguments. If `initialLoad` is `true`, it will clean the existing `historyItem` and fetch the first page of the notification history items. If `initialLoad` is `undefined` or `false`, it will fetch the next page from an existing page cursor. You can use `hasNextPage` to check if there are more pages to fetch.

- **markAsRead**: A function to mark all or particular notification items as read. it takes`(ids?: string[])` as input. If `ids` is not provided, it will mark all the items as read.
- **historyItems**: The Notification History Items.
- **unreadCount**: An integer variable representing the unread notification count in `historyItems`.
- **hasNextPage**: A boolean variable to check if there is more page to fetch. If `true`, calling `getHistoryItems()` will fetch the next page.

> **NOTE:**
> page counts are set to 20 by default. You can change the page count by setting the `notificationCountPerPage` in the `<NotifiContextProvider />`or `<NotifiHistoryContextProvider />` Property.
> [See an Example.](https://github.com/notifi-network/notifi-sdk-ts/blob/main/packages/notifi-react-example-v2/src/context/NotifiContextWrapper.tsx#L121)

<br> <br>

# Migrate Your Card

#### Migrate from `@notifi-network/notifi-react-card` (v0.) to `@notifi-network/notifi-react` (v1.)

##### _`@notifi-network/notifi-react` is a major upgrade of `@notifi-network/notifi-react-card`. `@notifi-network/notifi-react` which provides more advanced features by adopting the new Notifi infrastructure (called `fusion`)._

<br> <br>

#### Migrating to `@notifi-network/notifi-react` will have the following benefits:

- **Optimized bundle size**: the package size reduction of ~20%.
- **Better efficiency and performant**: the network request are reduced by ~50%.
- **Better UI & UX**: The new UI/UX design is more user-friendly, intuitive, and customizable.
- **Advanced new features**: support Notifi Admin Portal V2 new features. Check out Notifi Admin Portal V2 [here](https://admin.notifi.network/) for more information.

> **IMPORTANT** `@notifi-network/notifi-react-card` will no longer be maintained. Please use the `@notifi-network/notifi-react` if you are new to the Notifi React SDK.
> For any existing Dapps utilizing `@notifi-network/notifi-react-card`, follow the migration guide below.

<br> </br>

## Migration Guide

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

<br> </br>

### Step 1: Replace the `NotifiContext` with the `NotifiContextProvider`

Many of input props of the `NotifiContextProvider` are the same as `NotifiContext`. Differences are highlighted below.
<br> </br>

**Deprecated props**

- `alertConfigurations`_(Optional)_ is deprecated. (No longer needed)
- `keepSubscriptionData` _(Optional)_ is deprecated. (No longer needed)
- `multiWallet` _(Optional)_ is deprecated. (No longer needed)
- `isUsingFrontendClient` _(Optional)_ is deprecated. (No longer needed)

**Newly added props**

- `tenantId` **(Required)**: The `tenantId` or `dAppID` (as referenced on the Admin Portal) property originally was set in the `NotifiSubscriptionCard` component as `dappAddress`. Now it is moved to context provider level.

- `cardId` **(Required)**: The `cardId` property originally was set in the `NotifiSubscriptionCard` component. Now it is moved to context provider level.

- `notificationCountPerPage` _(Optional)_: The `notificationCountPerPage` property is used to set the number of notifications per fetch in the notification history. The default value is `20`.

- `toggleTargetAvailability` _(Optional)_: The `toggleTargetAvailability` property is used to enable/disable the target availability feature. The default value depends on the active destinations set in the Notifi Admin Portal. Additional infromation can be found [here.](https://github.com/notifi-network/notifi-sdk-ts/blob/main/packages/notifi-react/lib/context/NotifiTargetContext.tsx#L82)

<br> </br>

### Step 2: Replace the `<NotifiSubscriptionCard />` with the `<NotifiCardModal />`

Most of the props of `NotifiCardModal` are the same as `NotifiSubscriptionCard`. The only differences are listed below:
<br> </br>

**Deprecated props**

- `loadingSpinnerSize` _(Optional)_ is deprecated. (No longer needed as we can utilize css overrides to customize the spinner size)

- `loadingSpinnerColor` _(Optional)_ is deprecated. (No longer needed as we can utilize css overrides to customize the spinner color)

- `cardId` _(Optional)_ is deprecated. (No longer needed as we can set the `cardId` in the `NotifiContextProvider`)

- `inputLabels` and `inputSeparators` _(Optional)_ is deprecated. Instead, we can use the `copy` prop to customize the input labels. [Seen Here](customizing-the-card-copy)

> Examples Found In [`@notifi-network/notifi-react-example-v2`](https://github.com/notifi-network/notifi-sdk-ts/blob/main/packages/notifi-react-example-v2/src/app/notifi/components-example/page.tsx#L19)

**On-going:** (SUBJECT TO CHANGES)

- `disclosureCopy` (Optional): Not supported yet. but it is planned to be removed and make use of the `copy` prop instead (TBD)

- `onClose` (Optional)

<br></br>

### Step 3 Restyle the card by using the css override

Component layout has significant changes, and accordingly the css classes of the `NotifiCardModal` are also changed. If you are already using the existing `NotifiSubscriptionCard` with the global css override, you will need to deprecate all the css classes and re-implement the new global css override.
For more detail about CSS classes, please refer to the [source code.](https://github.com/notifi-network/notifi-sdk-ts/tree/main/packages/notifi-react/lib/style)

<br></br>

### Step 4: Remove all the related code of the `@notifi-network/notifi-react-card`

- Remove the `@notifi-network/notifi-react-card` package from the `package.json` file.

- Remove the `NotifiSubscriptionCard` component from the codebase.

- Remove the `NotifiContext` component from the codebase.

- Remove the legacy css override related to the `NotifiSubscriptionCard`.

## Dependency related configuration

When using `@notifi-network/notifi-react`, it requires some additional configuration for specific dependencies.

### "@xmtp" related configuration

The `@notifi-network/notifi-react`'s dependency, `@xmtp/xxx`, requires specific configuration to handle the `wasm` file.
The following configuration is required in nextjs (the recommended framework).

- **Nextjs version 14.2.0 or above**

  ```js
  nextConfig = {
    experimental: {
      serverComponentsExternalPackages: [
        '@xmtp/user-preferences-bindings-wasm',
      ],
    },
  };

  // ...other configs
  ```

- **Nextjs version below 14.2.0**

  It requires manual copy of the wasm file to the server chunk folder. We will need to grab the `user_preferences_bindings_wasm_bg.wasm` file from [@xmtp/user-preferences-bindings-wasm
  ](https://www.npmjs.com/package/@xmtp/user-preferences-bindings-wasm) npm package: `Code > dist > bundler > user_preferences_bindings_wasm_bg.wasm`. And put it in the `public/wasm` directory. Then add the following configuration in the `next.config.js` file.

  ```js
  nextConfig = {
    ...nextConfig,
    webpack: (config) => {
      config.plugins.push(
        new CopyPlugin({
          patterns: [{ from: 'public/wasm', to: './server/chunks' }],
        }),
      );
      return config;
    },
  };
  // ...other configs
  ```

The projects might encounter the following error if the above configuration is not set up properly.

```bash
Error: ENOENT: no such file or directory, open '/path/to/project/.next/server/vendor-chunks/user_preferences_bindings_wasm_bg.wasm'
```

> Reference:
>
> - [official xmpt example](https://github.com/xmtp/xmtp-web/blob/main/examples/nextjs/next.config.mjs)
> - [Notifi React Example config](https://github.com/notifi-network/notifi-sdk-ts/blob/main/packages/notifi-react-example-v2/next.config.mjs)
