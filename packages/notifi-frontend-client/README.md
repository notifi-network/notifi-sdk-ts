# `@notifi/notifi-frontend-client`

## 🎬 Getting Started using Aptos

In this README, we'll cover the simple use case of one user authenticating through a Martian wallet and creating an alert. 

## 📥 Installation

```
npm i @notifi-network/notifi-frontend-client
```

## 🪝 Hook up the SDK 

Load the Notifi Frontend Client SDK into your component.

```
const { newAptosClient, newAptosConfig } = require('@notifi-network/notifi-frontend-client');
```

Instantiate and configure the Notifi Client for your dApp and environment. If your user has not connected their wallet, they will need to do so in order to instantiate the client.

```
const tenantId = <Tenant ID received through the Notifi Config Tool>;
const account = await martian.account();
const blockchainEnv = "Development";

const config = newAptosConfig(account, tenantId, blockchainEnv);
const client = newAptosClient(config);

```

## 🔏 Signature Authorization

For a user to opt-in for notifications, they will need to provide their signature. This signature will then be used to authorize the user's connected wallet address with Notifi and create the account with Notifi.

Using the wallet adapter of your choice, prompt the user to sign and use the signed message in the `logIn()` hook.

```
const martianLogIn = async () => {
    const loginResult = await client.logIn({
        walletBlockchain: 'APTOS',
        signMessage: async (message, timestamp) => {
            const signedMessage = await wallet.signMessage({
                address: true,
                application: false,
                chainId: false,
                message,
                nonce: timestamp,
            });
            console.log('signedMessage', signedMessage);
            return signedMessage.signature;
        },
      });
      // client should be authenticated now
      console.log('loginResult', loginResult);
      return loginResult;
};

```

## 🪢 Create the Alert

Once your user enters their contact information and options for their first alert, use the `ensureTargetGroup()` to create a "target group" of their contact information and a "source group" of their desired alert options.

In order to create a target group, `ensureTargetGroup()` must pass in least one email address, phone number, telegramId, or webhook url. Dapp admins can update pass in a webhook url to receive all of the notifications instead of a user email address, phone number, or telegramId.

In order to create a source group, `ensureSourceGroup()` must pass in metadata of the alert options returned in the Rendering Alert Options section. 

After creating a target group and source group, use the `ensureAlert()` to create the first alert.

This example shows how to create a Broadcast message alert.

```
 // First create a source group
const sourceGroup = await client.ensureSourceGroup({
  name: 'Default Source Group',
    sourceParams: [
      {
        type: 'BROADCAST',
        name: 'Marketing Broadcast Source',
        blockchainAddress: 'notifi__newFeature'
      }
    ]
});
    
const source = sourceGroup.sources?.find(it => it?.blockchainAddress === 'notifi__newFeature');
const filter = source?.applicableFilters?.find(it => it?.filterType === 'BROADCAST_MESSAGES');

if (filter === undefined) {
  throw new Error('Unable to find required filter');
}

// Second create a target group
const targetGroup = await client.ensureTargetGroup({
      name: 'Default Target Group',
      webhook: {
        url: 'Notifi Platform', // For BROWSER_PUSH_NOTIFI, url is unused
        format: 'BROWSER_PUSH_NOTIFI',
        headers: [],
  },
})

    // Finally create the alert
    const alert = await client.ensureAlert({
        name: 'User broadcast alerts',
        sourceGroupId: sourceGroup.id,
        targetGroupId: targetGroup.id,
        filterId: filter.id,
    });

    return alert;
}
```

## 🔃 Updating the Alert

If a user wants to update their alert by changing the email address notifications are sent to, or to add a phone number for SMS notifications, you can still use `ensureAlert()` to update.

You'll want to pass in the `name` of the existing alert to make the update to that alert entity. You can use `getAlerts()` to find the alert entity. 

```

const handleUpdateAlert = async () => {
  try {
    const alerts = await getAlerts();
    const response = await ensureAlert({
      name = alerts[0].name,
      sourceGroupId,
      targetGroupId,
      filterId,
      filterOptions,
      groupName = 'default'
    });
    return response;
  } catch (e) {
    if (e instanceof GqlError) {
      // handle the Notifi GqlError
    }
  }
}

```

## 🗑 Deleting the Alert

To delete an alert, use `deleteAlert()`, which simply [takes the `id` of the alert] to be deleted. In our use case where the user only has 1 alert in their account:

```

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
}
```

## 🔔 Get Notification History

To get notification history, use the getNotificationHistory() 

```
const getNotificationHistory = async (first?: number, after?: string) => {
    // Fetch `first` items after the `after` cursor (leave undefined for first page)
    const { nodes , pageInfo } = await client.getNotificationHistory({
        first,
        after,
    });

    nodes.forEach(item => {
        if (item.detail?.__typename === 'BroadcastMessageEventDetails') {
            console.log('I have a broadcast message', item.detail?.subject, item.detail?.message);
        }
    });

    console.log('pageInfo', pageInfo.hasNextPage, pageInfo.endCursor);

    return {
        nodes,
        pageInfo
    }
}
```
