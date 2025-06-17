# Notifi Node (@notifi-network/notifi-node)

This SDK is intended for use with _Servers_ who have obtained a SID / Secret pair from Notifi.
Please reach out to us for help on [Discord](https://discord.gg/nAqR3mk3rv)!

This SDK allows you to interact with Notifi Tenant specific services, such as creating users, sending notifications. It is particularly useful when you want to have a custom server-side application. For example, sending notifications automatically when a certain event occurs.

> To authenticate with Notifi Node SDK to get the valid auth token, it requires specific server credentials, `SID` and `Secret`. You can get these credentials from Notifi Admin Panel --> Account Settings --> Account Keys (top right corner) --> `Show Sid/Secret`.
> If you not yet have an Notifi tenant account, feel free to register a new tenant at [Notifi Admin Panel](https://admin.notifi.network/) for free.

## Prerequisites

- Node.js >= 18 (LTS with corresponding npm version)

## Usage

### Installation

Install `@notifi-network/notifi-node` package using npm or yarn:

```bash
# NPM
npm install @notifi-network/notifi-node
# Yarn
yarn add @notifi-network/notifi-node
```

## Getting Started

### Instantiating a NotifiNodeClient

The `NotifiNodeClient` instance behaves as an proxy of `NotifiService` which is a wrapper around the Notifi GraphQL API. By interacting with `NotifiNodeClient`, we can perform various admin leven server methods such as creating users, sending notifications, etc.

It requires to pass in `GraphqlClient`, `DataPlaneClient` and `SubscriptionService` instances in order to instantiate a `NotifiService` object. The `NotifiService` object is then passed to the `NotifiClient` constructor. Example:

```ts
import {
  NotifiClient,
  createGraphQLClient,
  createNotifiService,
} from '@notifi-network/notifi-node';

const gqlClient = createGraphQLClient();
const dpapiClient = createDataplaneClient();
const subService = createNotifiSubscriptionService();
const notifiService = createNotifiService(graphqlClient, subService);

// Instantiate a NotifiNodeClient
const client = new NotifiNodeClient(notifiService);
```

> **NOTE**:
>
> - `GraphqlClient` is used to interact with the Notifi GraphQL Mutations and Queries.
> - `DataPlaneClient` is used to interact with the Notifi Data Plane API.
> - `SubscriptionService` is used to interact with the Notifi Subscription Service.

### Login or initialize NotifiNodeClient

In order to utilize the NotifiNodeClient methods, we firstly need to call the `logIn` by passing the tenant `SID` and `Secret` mentioned above. This method initializes the NotifiNodeClient and returns a `token` and `expiry`.

If we already have a valid token, we can directly call `initialize` method by passing the token.

```ts
const sid = 'your-notifi-tenant-sid';
const secret = 'your-notifi-tenant-secret';

// Either login
const { token, _expiry } = await client.logIn({
  sid,
  secret,
});

// Or,iff already have a valid token, directly initialize client
await client.initialize(token);
```

You can obtain the client status by calling `client.status`.

- If the client is uninitialized, it will return `NotifiNodeclientUninitializedState`
- If the client is initialized, it will return `NotifiNodeclientInitializedState`

```ts
// uninitialized
const { status } = client.status;

// initialized
const { status, jwt } = client.status;
```

> **NOTE**: Make sure not to expose the `SID`, `Secret` and `Token (jwt)` publicly. Otherwise, it could be abused by malicious users.

### Sending a Notification message

Use `publishFusionMessage` method to send one or more messages to the users. The example below sends a notification to the all users who have subscribed to the `event-type-id`.

```ts
if (!status === 'initialized') throw new Error('Client not initialized');

const messagePayloads = [
  {
    eventTypeId: 'event-type-id',
    variablesJson: {
      /** Could be any shape of object according to the need of template */
      fromAddress: 'from-wallet-address',
      toAddress: 'to-wallet-address',
      amount: 'amount',
      currency: 'ETH',
    },
    // Passing `specificWallets` optionally if you want to send to specific users. By default, it sends to all users who have subscribed to the `event-type-id`.
    // specificWallets: [{
    //   walletBlockchain: 'ETHEREUM',
    //   walletPublicKey: 'user-wallet-public-key',
    // }]
  },
];

const result = await client.publishFusionMessage(fusionMessages);
```

> NOTE:
>
> - The `variablesJson` parameter is the set of variables that will be used when rendering your templates. If you have a variable `fromAddress`, for example, you can display it in the template with the expression `{{ eventData.fromAddress }}`

### Receiving active alerts under a tenant

Use `getActiveAlerts` method to get all active alerts under the tenant.

```ts
const first = 10; // Number of alerts to fetch
const after = 'the-cursor'; // Cursor to fetch the alerts after
const result = client.getActiveAlerts({ first, after, fusionEventIds });
```

> You can get the cursor (in [PageInfo](https://docs.notifi.network/notifi-sdk-ts/modules/_internal_.html#PageInfoFragmentFragment)) from the `result` object to fetch the next set of alerts.

### Listening to events

Using `addEventListener` method allows to monitor the `tenantActiveAlertChanged` event.

**Listening to event**

```ts
const id = client.addEventListener(
  'tenantActiveAlertChanged',
  eventHandler,
  errorHandler,
);

const eventHandler = (event) => {
  console.info('Event received:', event);
};
const errorHandler = (error: Error) => {
  console.error('Error occurred', error);
};
```

**Removing event listener**

```ts
client.removeEventListener('tenantActiveAlertChanged', id);
```

## Contributing & Testing

We welcome and appreciate your contributions! Please review our [contribution guidelines](https://github.com/notifi-network/notifi-sdk-ts?tab=readme-ov-file#contribute-to-the-repository-for-contributors) before getting started.

To ensure a smooth contribution process, please follow the steps below to confirm that all tests pass before submitting your changes:

- Fill in the credentials in the `.env.example` file and rename it to `.env`.
- Run `npm run test` to execute all tests.

If your contribution includes a new feature, you may also want to create a dedicated test case within the` __tests__/NotifiNodeClient.test.ts` file to validate its functionality.

## More example

- [notifi-node-sample](): An example demonstrating how to use the `@notifi-network/notifi-node` package on express.js server.
