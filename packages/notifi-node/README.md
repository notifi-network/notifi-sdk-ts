# `@notifi-networks/notifi-node`

Node SDK for Notifi APIs.

This SDK is intended for use with *Servers* who have obtained a SID / Secret pair from Notifi.
Please reach out to us for help on [Discord](https://discord.gg/nAqR3mk3rv)!

## Usage

### Instantiating a NotifiClient
```ts
import {
  NotifiClient,
  NotifiEnvironment,
  createAxiosInstance,
} from '@notifi-network/notifi-node';
import axios from 'axios';

const env: NotifiEnvironment = 'Production'; // Or 'Development'
const axiosInstance = createAxiosInstance(axios, env);
const client = new NotifiClient(axiosInstance);
```

### Creating a Tenant User
```ts
import {
  NotifiClient,
} from '@notifi-network/notifi-node';

const client: NotifiClient = getNotifiClient();

// Log in to obtain a token
const { token, expiry } = await client.logIn({ sid: MY_SID, secret: MY_SECRET });

// Use the token to create a tenant user
const userId = await client.createTenantUser(
  token,
  {
    walletBlockchain: 'NEAR', // Or 'SOLANA'
    walletPublicKey: 'juni-kim.near', // Or other address
  },
);
await persistUserIdSomehow(userId);

// Use the token and the user ID to subscribe the user to Direct Push alerts
const alertObject = await client.createDirectPushAlert(
  token,
  {
    userId,
    emailAddresses: [...userEmails],
    phoneNumbers: [...userPhoneNumbers], // Currently we only support US phone numbers e.g. '+1xxxAAAyyyy' (include +1)
  }
);
await persistAlertIdSomehow(userId, alertObject.id);
```

### Sending a Direct Push Alert to a user
```ts
import {
  NotifiClient,
} from '@notifi-network/notifi-node';

const client: NotifiClient = getNotifiClient();

// Log in to obtain a token
const { token, expiry } = await client.logIn({ sid: MY_SID, secret: MY_SECRET });

// Use the token to send a message to anyone subscribed to that wallet
await client.sendDirectPush(token, {
  key: randomUUID(), // Idempotency key, use the same value for each unique event
  walletBlockchain: 'NEAR', // Or 'SOLANA'
  walletPublicKey: 'juni-kim.near', // Or other address
  message: 'Hello world',
});
```