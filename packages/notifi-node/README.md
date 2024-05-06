# `@notifi-network/notifi-node`

Node SDK for Notifi APIs.

This SDK is intended for use with _Servers_ who have obtained a SID / Secret pair from Notifi.
Please reach out to us for help on [Discord](https://discord.gg/nAqR3mk3rv)!

## Usage

### Instantiating a NotifiClient

```ts
import {
  NotifiClient,
  createGraphQLClient,
  createNotifiService,
} from '@notifi-network/notifi-node';

const gqlClient = createGraphQLClient();
const notifiService = createNotifiService(gqlClient);
const client = new NotifiClient(notifiService);
```

### Creating a Tenant User

```ts
import { NotifiClient } from '@notifi-network/notifi-node';

const client: NotifiClient = getNotifiClient();

// Log in to obtain a token
const { token, expiry } = await client.logIn({
  sid: MY_SID,
  secret: MY_SECRET,
});

// Use the token to create a tenant user
const userId = await client.createTenantUser(token, {
  walletBlockchain: 'NEAR', // Or 'SOLANA'
  walletPublicKey: 'juni-kim.near', // Or other address
});
await persistUserIdSomehow(userId);

// Use the token and the user ID to subscribe the user to Direct Push alerts
const alertObject = await client.createDirectPushAlert(token, {
  userId,
  emailAddresses: [...userEmails],
  phoneNumbers: [...userPhoneNumbers], // Currently we only support US phone numbers e.g. '+1xxxAAAyyyy' (include +1)
});
await persistAlertIdSomehow(userId, alertObject.id);
```

### Sending a Direct Push Alert to a user

```ts
import { NotifiClient } from '@notifi-network/notifi-node';

const client: NotifiClient = getNotifiClient();

// Log in to obtain a token
const { token, expiry } = await client.logIn({
  sid: MY_SID,
  secret: MY_SECRET,
});

// Use the token to send a message to anyone subscribed to that wallet
const result = await client.sendDirectPush(token, {
  key: '<KEY_USED_FOR_IDEMPOTENCY>', // This should be the same value per unique message
  walletBlockchain: 'SOLANA',
  walletPublicKey: '<ACCOUNT_ADDRESS>',
  template: {
    emailTemplate: '<UUID_OF_TEMPLATE_GROUP>', // You can get these values after submitting your templates
    smsTemplate: '<UUID_OF_TEMPLATE_GROUP>', // These values will typically be the same, as they refer to a version of a group of templates
    variables: {
      // These variables are replaced inside mustache templates you have provided. syntax: https://mustache.github.io/mustache.5.html
      someTemplateVariable: 'foo',
      someOtherTemplateVariable: 'bar',
      someOtherTemplateVariable1: 'bar1',
    },
  },
});
```

### Sending a Broadcast Alert to a user

```ts
import * as dotenv from 'dotenv';
import { NotifiClient, NotifiEnvironment, createGraphQLClient, createNotifiService } from '@notifi-network/notifi-node';

const gqlClient = createGraphQLClient();
const notifiService = createNotifiService(gqlClient);
const client = new NotifiClient(notifiService);

dotenv.config();
class App {
  private JWT = '';

  public async start() {
    const result = await client.logIn({
      sid: process.env.MY_SID,
      secret: process.env.MY_SECRET,
    });

    this.JWT = result.token;
  }

  public async sendMessage() {
    await client.sendBroadcastMessage(this.JWT, {
      topicName: 'yourdappid__announcements',
      variables: [
        {
          key: 'message',
          value: 'This is the body of the message I would like my users to receive!',
        },
        {
          key: 'subject',
          value: 'Some Special Announcement',
        },
      ],
    });
  }
}

export default App;
```
