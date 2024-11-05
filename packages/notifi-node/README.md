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

### Creating a User

```ts
const { status } = client.status;
if (!status === 'initialized') throw new Error('Client not initialized');

const userId = await client.createTenantUser(token, {
  walletBlockchain: 'ETHEREUM', // Or other notifi supported blockchain: https://docs.notifi.network/notifi-sdk-ts/modules/_internal_.html#WalletBlockchain
  walletPublicKey: 'user-wallet-public-key',
});

// You can start sending notifications to this user
```

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

Notifi Node SDK provides a way to listen to the events using the `addEventListener` method. There are three main categories of events:

- [GraphQL subscription events](#1-graphql-subscription-events)
- [WebSocket status events](#2-websocket-status-events)
- [GraphQL subscription status](#3-graphql-subscription-status)

#### 1. GraphQL subscription events

Notifi provides several GraphQL subscription events by which we can easily tracking the entity changes. When listening to this category of events, it returns a `Subscription` object which is used to stop the Graphql subscription.

- `tenantActiveAlertChanged`: When the active alert is changed (created or deleted).

To stop listening to the events, we need to do the following:

1. Call the `subscription.unsubscribe` method. This will stop the Graphql subscription.
2. Call the `removeEventListener` method with the event name and the callback function. This will remove the event listener.

**Example:**

```ts
const eventHandler = (event) => {
  console.log('Event received:', event);
};

// Listen to the tenant entity updated event
const subscription = client.addEventListener(
  'tenantActiveAlertChanged',
  eventHandler,
);

// Stop the subscription
subscription.unsubscribe();
client.removeEventListener('tenantActiveAlertChanged', eventHandler);
```

#### 2. WebSocket status events :

> NOTE: This events are particularly for some advanced use cases especially when you want to interact with the WebSocket connection.
> Example, you can utilize the WebSocket client object from `wsConnected` handler to dispose the WebSocket connection.

Since websocket connection is automatically opened when the GraphQL subscription is started, we might listen to the WebSocket status events to understand the status of the WebSocket connection under some circumstances.

- `wsConnected`: When the WebSocket connection is established.
- `wsConnecting`: When the WebSocket connection is being established.
- `wsClosed`: When the WebSocket connection is closed.
- `wsError`: When there is an error in the WebSocket connection.

To stop listening to the WebSocket status events, simply call the `removeEventListener` method with the event name and the callback function.

**Example:**

```ts
const eventHandler = (event) => {
  console.log('Event received:', event);
};

// Listen to the WebSocket status events (The return type of addEventListener is never)
client.addEventListener('wsConnected', eventHandler);
client.addEventListener('wsConnecting', eventHandler);
client.addEventListener('wsClosed', eventHandler);
client.addEventListener('wsError', eventHandler);

// Stop listening to the WebSocket status events
client.removeEventListener('wsConnected', eventHandler);
client.removeEventListener('wsConnecting', eventHandler);
client.removeEventListener('wsClosed', eventHandler);
client.removeEventListener('wsError', eventHandler);
```

#### 3. GraphQL subscription status:

We can also listen to the following events to understand the status of the GraphQL subscription:

- `gqlSubscriptionError`: When there is an error in the GraphQL subscription.
- `gqlComplete`: When the GraphQL subscription is completed.

To stop listening to the GraphQL subscription status events, simply call the `removeEventListener` method with the event name and the callback function.

```ts
const eventHandler = (event) => {
  console.log('Event received:', event);
};

// Listen to the GraphQL subscription status events (The return type of addEventListener is never)
client.addEventListener('gqlSubscriptionError', eventHandler);
client.addEventListener('gqlComplete', eventHandler);

// Stop listening to the GraphQL subscription status events
client.removeEventListener('gqlSubscriptionError', eventHandler);
client.removeEventListener('gqlComplete', eventHandler);
```

## More example

- [notifi-node-sample](): An example demonstrating how to use the `@notifi-network/notifi-node` package on express.js server.
