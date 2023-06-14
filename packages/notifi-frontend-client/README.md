# `@notifi/notifi-frontend-client`

## 🎬 Getting Started using Aptos

In this README, we'll cover the simple use case of one user authenticating through an Aptos wallet and creating an alert.

## 📥 Installation

```
npm i @notifi-network/notifi-frontend-client
```

## 🪝 Hook up the SDK and initialize the Client

Load the Notifi Frontend Client SDK into your component.

Instantiate and configure the Notifi Client for your dApp and environment. If your user has not connected their wallet, they will need to do so in order to instantiate the client.

```ts
const accountAddress = '<The-wallet-public-account-address>';
const walletPublicKey = "<The wallet's public key>";
const tenantId = '<Tenant ID received through the Notifi Config Tool>';
const blockchainEnv = 'Development';

const client = newFrontendClient({
  account: {
    address: accountAddress, // string
    publicKey: walletPublicKey, // string
  },
  tenantId,
  env: blockchainEnv,
  walletBlockchain: 'APTOS',
});

const newUserState = await client.initialize();
```

## 🔏 Signature Authorization

For a user to opt-in for notifications, they will need to provide their signature. This signature will then be used to authorize the user's connected wallet address with Notifi and create the account with Notifi.

Using the wallet adapter of your choice, prompt the user to sign and use the signed message in the `logIn()` hook.

```ts
const signMessage: AptosSignMessageFunction = async (message, nonce) => {
  if (!wallet) {
    // the wallet object will be differ based on the wallet adapter you use
    throw new Error('Wallet not connected');
  }

  // You will need to use the 'signMessage' method of your wallet adapter to sign the message.
  const signature = await wallet.signMessage({
    message,
  });

  return signature; // string (if the signature is not string format, you will need to convert it to string)
};

const logIn = async () => {
  const userState: UserState = client.userState;
  if (userState.status === 'authenticated') {
    return 'User is already logged in';
  }

  const loginResult = await client.logIn({
    walletBlockchain: 'APTOS',
    signMessage,
  } as SignMessageParams);
  // client should be authenticated now
  console.log('loginResult', loginResult);
  return loginResult;
};
```

## 🪢 Create the Alert

Once your user enters their contact information and options for their first alert, use the `ensureTargetGroup()` to create a "target group" of their contact information and a "source group" of their desired alert options.

In order to create a target group, `ensureTargetGroup()` must pass in least one email address, phone number, telegramId, or webhook url. Dapp admins can update pass in a webhook url to receive all of the notifications instead of a user email address, phone number, or telegramId.

The following example shows how to create a target group with an email address (user sign up with email).

```ts
const targetGroup = client.ensureTargetGroup({
  name: 'Default',
  emailAddress: 'user-email',
});
```

Then, use the `ensureAlert()` to create the first alert when your user tends to subscribe an alert.

This example shows how to create (user subscribe) a Broadcast message alert.

```ts
// Given that you have one Broadcast Topic in Notifi Admin Panel.

const subscribeAlert = () => {
  const subscriptionCardConfig = await client.fetchSubscriptionCard();

  const broadcastEventType: EventTypeItem = subscriptionCardConfig.eventTypes[0];

  await client.ensureAlert({
    eventType: broadcastEventType,
    inputs: {},
  });
}

```

## 🔃 Updating the Alert

If a user wants to update their alert by changing the email address notifications are sent to, or to add a phone number for SMS notifications, you can repeat the process above by calling `ensureTargetGroup()` and `ensureAlert()` again.

## 🗑 Deleting the Alert

To delete an alert, use `deleteAlert()`, which simply [takes the `id` of the alert] to be deleted. In our use case where the user only has 1 alert in their account:

```ts
const handleDeleteAlert = async () => {
  try {
    const alerts = await getAlert();
    const response = await deleteAlert({
      alertId: alerts?.[0]?.id,
    });
    return response;
  } catch (e) {
    if (e instanceof GqlError) {
      // handle the Notifi GqlError
    }
  }
};
```

## 🔔 Get Notification History

To get notification history, use the getNotificationHistory()

```ts
const getNotificationHistory = async (first?: number, after?: string) => {
  // Fetch `first` items after the `after` cursor (leave undefined for first page)
  const { nodes, pageInfo } = await client.getNotificationHistory({
    first,
    after,
  });

  nodes.forEach((item) => {
    if (item.detail?.__typename === 'BroadcastMessageEventDetails') {
      console.log(
        'I have a broadcast message',
        item.detail?.subject,
        item.detail?.message,
      );
    }
  });

  console.log('pageInfo', pageInfo.hasNextPage, pageInfo.endCursor);

  return {
    nodes,
    pageInfo,
  };
};
```

## 📝 Check out more example

For more example in different blockchain, please visit [notifi-react-example](https://github.com/notifi-network/notifi-sdk-ts/blob/main/packages/notifi-react-example/src/FrontendClient/SolanaFrontendClient.tsx)

You can also clone the example and run it locally.
