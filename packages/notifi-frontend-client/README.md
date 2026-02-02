# Notifi Frontend Client

The Notifi Frontend Client SDK is a JavaScript (Typescript) library that allows you to integrate the Notifi Network into your decentralized application (dApp). Dapp will be able to access Notifi services using client methods.

`@notifi/notifi-frontend-client` package is not framework specific, it means you can use it with any JavaScript framework like React, Angular, Vue, svelte, etc.

> Note: if you are using React, Notifi has a React SDK that is built on top of this SDK, [@notifi-network/notifi-react](https://www.npmjs.com/package/@notifi-network/notifi-react)

## 📥 Installation

```
npm i @notifi-network/notifi-frontend-client
```

## 🪝 Initialization

Instantiate the `client` object at your dapp to interact with the Notifi core services by providing your notifi Notifi tenant credentials and the user's wallet information.

```ts
const tenantId = '<notifi-tenent-id>'; // dappAddress
const env = 'Production'; // or 'Development'
const walletBlockchain = '<the-blockchain-of-your-choice>'; // e.g. 'Ethereum'

const client = instantiateFrontendClient({
  walletBlockchain,
  // ⬇ Users wallet credentials (public key, address, user account ... etc), properties differ depending on the blockchain (below is an example for Evm chains)
  walletPublicKey: '<user-wallet-public-key>',
  // ⬇ Notifi tenant credentials
  tenantId,
  env,
});

const newUserState = await client.initialize();
```

> **Reference**:
>
> - You can register a new tenant to get tenantId (dappAddress) at [Notifi Admin Panel](https://admin.notifi.network/) for free.
> - The interface of input argument differs depending on the blockchain, see the [type doc here](https://github.com/notifi-network/notifi-sdk-ts/blob/a00d59215032375b35c303ff1ccec54892d3c423/packages/notifi-frontend-client/lib/configuration/NotifiFrontendConfiguration.ts#L73)

## 🔏 Authorization

There are two authentication categories to onboard the users with Notifi:

1. **On-chain (blockchain) authorization**

   - Arbitrary signature authorization
   - Transaction signature authorization

2. **Off-chain (OpenID Connect) authorization**

### On-chain method: Arbitrary signature authorization

Authorize users using `logIn` client method by providing a `signMessage` callback function.

```ts
const signMessage: AptosSignMessageFunction = async (message, nonce) => {
  // Implement your signing logic here ...

  return signature; // string (if the signature is not string format, you will need to convert it to string)
};

const loginResult = await client.logIn({
  walletBlockchain: `the-blockchain-of-your-choice`,
  signMessage,
});
```

> **NOTE**:
>
> - The format of the returned signature differs depending on the blockchain, see the [type doc here](https://github.com/notifi-network/notifi-sdk-ts/blob/a00d59215032375b35c303ff1ccec54892d3c423/packages/notifi-frontend-client/lib/client/NotifiFrontendClient.ts#L37)
> - The example of implementing `signMessage` callback function: [notifi-svelte-example](https://github.com/notifi-network/notifi-svelte-example/blob/26e2ef14ad507e35bce148bab71adc4d437ef44f/src/routes/%2Bpage.svelte#L26)
> - Notifi supported blockchains: [WalletBlockchain Enum documentation](https://graphdoc.io/preview/enum/WalletBlockchain?endpoint=https://api.dev.notifi.network/gql/)

<br><br>

### On-chain method: Transaction signature authorization

Authorize users by using `beginLoginViaTransaction` method and `completeLoginViaTransaction` client method. The `beginLoginViaTransaction` method will return a nonce that should be appended to the transaction data before signing the transaction. The `completeLoginViaTransaction` method will take the transaction signature and the nonce to complete the login process. The following examples show how to authorize a user using the transaction signature method on EVM (Ethereum virtual machine) compatible blockchains.

```ts
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

// Step 2: Get notifi nonce
const { nonce } = await notifiClient.beginLoginViaTransaction({
  walletBlockchain,
  walletAddress,
});
console.info({ notifiNonce: nonce }); // notifiNonce will be a 32 bytes hex string

// Step 3: Append notifi nonce to the calldata
const txParams = {
  to: smartContract.address,
  data: calldata + nonce.replace('0x', ''),
};

// Step 4: Sign the transaction with new calldata
const { hash } = await provider.getSigner().sendTransaction(txParams);

// Step 5: Use the transaction signature to login to notifi
const notifiLoginResult = await notifiClient.completeLoginViaTransaction({
  walletAddress,
  walletAddress,
  transactionSignature: hash,
  walletBlockchain,
});
```

**IMPORTANT NOTE**:

- **Browser extension constraints**: Some browser extensions (Metamask ...) do not allow appending additional info to the calldata of particular smart contract method (example: Token contract (ERC20, ERC721 ...etc)). Browser extension (Metamask) will throw `Message: Invalid token value; should be exactly xx hex digits long` error in this case.

<br><br>

### Off-chain method: OpenID Connect (OIDC) Authorization

Authorize users by using `logIn` client method by providing a `signIn` callback function.

```ts
const signIn: OidcSignInFunction = async () => {
  // other logic here to generate the OIDC token id (JWT token)
  const jwt = '<the-oidc-id-token-here>';
  return {
    oidcProvider: 'GOOGLE',
    jwt,
  };
};

const loginResult = await client.logIn({
  walletBlockchain: 'OFF_CHAIN',
  signIn,
});
```

> **NOTE**
>
> - Respective OIDC `login` [arguments](https://github.com/notifi-network/notifi-sdk-ts/blob/1457d642900b8969abb8f1ad353aaeb7059a6946/packages/notifi-frontend-client/lib/client/NotifiFrontendClient.ts#L104)
> - Notifi supported OIDC providers: [OidcProvider Enum document](https://graphdoc.io/preview/enum/OidcProvider?endpoint=https://api.dev.notifi.network/gql/)
> - To enable OIDC login, it requires additional setup to integrate your OIDC provider with Notifi tenant using [Notifi Admin Portal](https://admin.notifi.network/) check on the Notifi Documentation **(WIP: coming soon)**

<br><br>

## Fetch User Data

The `fetchFusionData` client method is used to fetch the user's data, including their:

1. `targetGroup`: contact informations
2. `alerts`: subscribed alerts

> **NOTE**:
>
> - [interface](https://github.com/notifi-network/notifi-sdk-ts/blob/a00d59215032375b35c303ff1ccec54892d3c423/packages/notifi-frontend-client/lib/client/NotifiFrontendClient.ts#L726)

## 📭 Destinations (Target & TargetGroup)

When a user logs in for the first time, a default target group named `Default` is automatically created for them. Users can manage their target groups using the `alterTargetGroup` client method.

### Supported Destination Types

Notifi currently supports the following destination types:

- **Email**
- **SMS**
- **Telegram**
- **Discord**
- **More to come** (additional types will be added in the future)

### Target Group Management

The `alterTargetGroup` method allows users to modify their target groups. It supports three operations:

1. **Ensure** (`{ type: 'ensure'; name: string }`):
   - Adds a target to the target group if it doesn't already exist.
   - If the target doesn't exist, it creates a new target using the provided `name`.
2. **Remove** (`{ type: 'remove' }`):
   - Removes the target from the target group.
   - The target remains in Notifi's backend and can be re-added later without re-verification.
3. **Delete** (`{ type: 'delete'; id: string }`):
   - Removes the target from the target group and deletes it from Notifi's backend.
   - The target will need to be re-verified if added again in the future.

### Example Usage

Below is an example of how to use the `alterTargetGroup` method:

```typescript
const targetGroup = await client.alterTargetGroup({
  name: 'Default', // Target group name
  email: {
    type: 'ensure',
    name: '<user-email>', // Add or ensure the email target
  },
  discord: {
    type: 'remove', // Remove the discord target from the group
  },
  telegram: {
    type: 'delete',
    id: '<telegram-id>', // Delete the Telegram target from the group and backend
  },
  // Other destination types can be added as needed
  // Note: Targets not specified will be removed from the target group
});
```

### Key Notes

- **Reference Documentation**: For detailed type documentation, refer to [this link (WIP)]().
- **Remove vs Delete**:
  - **Remove**: Targets are only removed from the target group but remain in Notifi's backend. They can be re-added using the `ensure` method without re-verification.
  - **Delete**: Targets are removed from the target group and permanently deleted from Notifi's backend. Re-adding them will require re-verification.
- **Unspecified Targets**: If a target type is not included in the `alterTargetGroup` call, it will be removed from the target group.

## 🪢 Topics & Alerts

There are two key concepts of Notifi's notification source: `Alert` and `Topic`.

- `Topic` is the event allowed to be subscribed (Tenant specific).
- `Alert` is the subscription of the `Topic` (User specific).

> `Topic` is the prototype of the `Alert`.

### Topics

We can get the available topics of the tenant by calling `fetchTenantConfig` client method.

```ts
const id = '<ui-card-config-of-the-tenant>';
const tenantConfig = await client.fetchTenantConfig({
  id,
  type: 'SUBSCRIPTION_CARD',
});
const topics = tenantConfig.fusionEventTopics;
```

> **NOTE**:

> - [interface](https://github.com/notifi-network/notifi-sdk-ts/blob/a00d59215032375b35c303ff1ccec54892d3c423/packages/notifi-frontend-client/lib/client/NotifiFrontendClient.ts#L1209)
> - You can config your card in the [Notifi Admin Panel](https://admin.notifi.network/)

### Alerts

We can subscribe users to a topic by creating an alert object by using the `ensureFusionAlerts` client method.

The following methods are used to get and delete alerts:

- `getAlerts`
- `deleteAlert`

The full example of getting, deleting, and creating an alert is shown below:

```ts
import { resolveObjectArrayRef } from '@notifi-network/notifi-frontend-client';

const topic = topics[0];
const fusionEventDescriptor = topic.fusionEventDescriptor;
const fusionEventMetadataJson = fusionEventDescriptor.metadata;
const fusionEventId = fusionEventDescriptor.id;

if (fusionEventMetadataJson && fusionEventId) {
  const fusionEventMetadata = getFusionEventMetadata(topic);
  const filters = fusionEventMetadata?.filters?.filter(isAlertFilter);
  const fusionFilterOptionsInput: FusionFilterOptions['input'] = {};
  if (filters && filters.length > 0) {
    // NOTE: for now we only consider 1 to 1 relationship (1 filter for 1 topic)
    const userInputParams = filters[0].userInputParams;
    const userInputOptions: UserInputOptions = {};
    userInputParams.forEach((userInputParm) => {
      userInputOptions[userInputParm.name] = userInputParm.defaultValue;
    });
    fusionFilterOptionsInput[filters[0].name] = userInputOptions;
  }
  const filterOptions: FusionFilterOptions = {
    version: 1,
    input: fusionFilterOptionsInput,
  };
  /** Error caught here often caused by incorrect `inputs` format  */
  const subscriptionValueOrRef =
    fusionEventMetadata?.uiConfigOverride?.subscriptionValueOrRef;
  const subscriptionValue = subscriptionValueOrRef
    ? resolveObjectArrayRef('', subscriptionValueOrRef, inputs) // See the related information section for more details
    : null;

  const alertToCreate = fusionEventId;
  const createAlertInputs = [
    {
      fusionEventId: fusionEventId,
      name: alertToCreate,
      targetGroupId,
      subscriptionValue: subscriptionValue?.[0]?.value,
      filterOptions: JSON.stringify(filterOptions),
    },
  ];
}
const existingAlerts = await getAlerts()) ?? [];
const existingAlertNames = alerts.map((alert) => alert.name);

// Alerts are immutable, delete the existing instead
if (existingAlertNames.includes(alerToCreate)) {
  const id = existingAlerts[alerToCreate].id;
  await client.deleteAlert({ id });
}

// Create the alert
await frontendClient.ensureFusionAlerts({ alerts: createAlertInputs });

// Utils
const getFusionEventMetadata = (
  topic: FusionEventTopic,
): FusionEventMetadata | null => {
  const parsedMetadata = JSON.parse(
    topic.fusionEventDescriptor.metadata ?? '{}',
  );
  if (isFusionEventMetadata(parsedMetadata)) {
    return parsedMetadata;
  }
  return null;
};

const isFusionEventMetadata = (
  metadata: unknown,
): metadata is FusionEventMetadata => {
  const metadataToVerify = metadata as any;
  if (typeof metadataToVerify !== 'object' || !metadataToVerify) {
    return false;
  }
  return (
    'filters' in metadataToVerify && Array.isArray(metadataToVerify.filters)
  );
};
```

> **Related Information**:
>
> - inputs: it is a concept which is used when a dynamic topic subscription value needs to be adopted. The input is a key-value pair object. The key is the value associated with the Create a new topic section in Admin Portal. The value is the dynamic value that needs to be passed into the topic subscription. The value needs to be an array of InputObject interface. See the doc [here](https://github.com/notifi-network/notifi-sdk-ts/tree/main/packages/notifi-react#notifitenantconfigcontext)

## 🔔 Notification History

To get notification history, use the getFusionNotificationHistory()

```ts
const { nodes, pageInfo } = await client.getFusionNotificationHistory({
  first,
  after,
});

const notifications = nodes.map((node) => {
  return {
    icon: node.detail.icon,
    topicName: node.detail.sourceName,
    message: node.detail.message,
    timestamp: node.createdDate,
  };
});
```

## ⚠️ Listening to events

Using `addEventListener` method allows to monitor the `stateChanged` event.

**Listening to event**

```ts
const id = client.addEventListener('stateChanged', eventHandler, errorHandler);

const eventHandler = (event) => {
  if (event.__typename === 'TargetStateChangedEvent') {
    console.info('User target state changed', event);
  }
  if (event.__typename === 'NotificationHistoryStateChangedEvent') {
    console.info('New notification coming', event);
  }
};

const errorHandler = (error: Error) => {
  console.error('Error occurred', error);
};
```

**Removing the event listener**

```ts
client.removeEventListener('stateChanged', id);
```

## 🚨 Error Handling

The SDK provides a unified error handling system with typed errors.

### Error Types

| Error Class                 | Error Type       | Description                                  |
| --------------------------- | ---------------- | -------------------------------------------- |
| `NotifiError`               | (base)           | Base class for all errors                    |
| `NotifiTargetError`         | `TARGET`         | Target-related errors (e.g., limit exceeded) |
| `NotifiAuthenticationError` | `AUTHENTICATION` | Auth errors (e.g., unauthorized)             |
| `NotifiValidationError`     | `VALIDATION`     | Validation errors (e.g., invalid arguments)  |
| `NotifiUnknownError`        | `UNKNOWN`        | Fallback for unclassified errors             |

### Handling Errors

Use `NotifiError.from()` to convert any error to a typed `NotifiError`:

```ts
import {
  NotifiAuthenticationError,
  NotifiError,
  NotifiTargetError,
} from '@notifi-network/notifi-frontend-client';

try {
  await client.alterTargetGroup({
    /* ... */
  });
} catch (e) {
  const error = NotifiError.from(e);

  if (error instanceof NotifiTargetError) {
    console.error('Target error:', error.code, error.message);
  } else if (error instanceof NotifiAuthenticationError) {
    console.error('Auth error:', error.code, error.message);
  }

  // Access error properties
  console.log(error.errorType); // 'TARGET', 'AUTHENTICATION', 'VALIDATION', 'UNKNOWN'
  console.log(error.code); // Specific error code (e.g., 'TargetLimitExceededError')
  console.log(error.timestamp); // Error timestamp
  console.log(error.cause); // Original error (if available)
}
```

> **NOTE**:
>
> - GraphQL payload errors (with `__typename`) are automatically mapped to the appropriate error classes.
> - [Type documentation](https://docs.notifi.network/notifi-sdk-ts/notifi-frontend-client/classes/NotifiError.html)

## Contributing & Testing

We welcome and appreciate your contributions! Please review our [contribution guidelines](https://github.com/notifi-network/notifi-sdk-ts?tab=readme-ov-file#contribute-to-the-repository-for-contributors) before getting started.

To ensure a smooth contribution process, please run `npm run test` below to confirm that all tests pass before submitting your changes

If your contribution includes a new feature, you may also want to create a dedicated test case within the` __tests__/NotifiFrontendClient.test.ts` file to validate its functionality.

## 📝 More examples

- [notifi-dapp-example](https://github.com/notifi-network/notifi-sdk-ts/tree/main/packages/notifi-dapp-example): A dapp example built with `@notifi/notifi-frontend-client` and `@notifi/notifi-react` SDKs.

- [notifi-react-example-v2](https://github.com/notifi-network/notifi-sdk-ts/tree/main/packages/notifi-react-example-v2): React contexts & components library built with `@notifi/notifi-frontend-client`.
