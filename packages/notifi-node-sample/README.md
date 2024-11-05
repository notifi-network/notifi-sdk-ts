# Notifi Admin Express API server (@notifi-network/notifi-node-sample)

This example demonstrates how to use the `@notifi-network/notifi-node` package on express.js server.

> To know more about `@notifi-network/notifi-node` package, please visit [documentation](https://github.com/notifi-network/notifi-sdk-ts/tree/main/packages/notifi-node)

## Prerequisites

- Node.js v18.0.0 or higher (with corresponding npm version)
- A Notifi tenant account with a tenant sid and secret

> - If you haven't created a Notifi tenant account yet [set up an account](https://admin.notifi.network/signup?environment=prd)
> - Know more about Notifi Tenant: [https://docs.notifi.network/docs](https://docs.notifi.network/docs)

## Getting Started

Follow the following steps will create a simple express server that hosts few http API endpoints to showcase the tenant admin functionalities using the `@notifi-network/notifi-node` package.

- Clone `notifi-sdk-ts` [monorepo](https://github.com/notifi-network/notifi-sdk-ts)

```bash
# SSH
git clone git@github.com:notifi-network/notifi-sdk-ts.git
# HTTPS
git clone https://github.com/notifi-network/notifi-sdk-ts.git
```

- Install dependencies

```bash
cd notifi-sdk-ts
npm install
```

- Build the project

```bash
npm run build
```

- Config environment variables

```bash
export NOTIFI_SECRET="your-tenant-secret" && \
 NOTIFI_SID="your-sid" && \
 PORT="custom-port(optional)"
```

- Start the example express server listening on the port specified in the environment variables (default 8080 if not specified)

```bash
npx lerna --scope=@notifi-network/notifi-node-sample run dev
```

## Usage: express API endpoints

- **[/login](#login-to-get-a-authorizationbearer-jwt-token)**
- **[/publish-fusion-message](#broadcast-notification-message)**
- **[/get-active-alerts](#get-active-alerts)**
- **[Active alert changed event](#active-alert-changed-event)** (Subscribe & Unsubscribe)

### Login to get a Authorization(Bearer) jwt token.

- endpoint: `/login`
- method: `POST`
- required headers: `Authorization: Bearer <jwt-token>`
- request body:

```json
{
  "sid": "your-sid",
  "secret": "your-secret"
}
```

- response body:

```json
{
  "token": "jwt-token",
  "expiry": "token-expiry-time"
}
```

### Broadcast notification message

- endpoint: `/publish-fusion-message`
- method: `POST`
- required headers: `Authorization: Bearer <jwt-token>`
- request body:

```json
{
  "variables": [
    {
      "eventTypeId": "event-type-id",
      "variablesJson": {
        "fromAddress": "from-wallet-address",
        "toAddress": "to-wallet-address",
        "amount": "amount",
        "currency": "ETH"
      }
    }
  ]
}
```

- response body:

```json
{
  "result": {
    "indexToResultIdMap": {
      "0": "c1665c4b-5389-400e-b026-bd93471a0d00"
    }
  }
}
```

> NOTE:
>
> - The `variablesJson` parameter is the set of variables that will be used when rendering your templates. If you have a variable `fromAddress`. For example, you can display it in the template with the expression `{{ eventData.fromAddress }}`
> - Passing `specificWallets` optionally if you want to send to specific users. By default, it sends to all users who have subscribed to the `event-type-id`. For example, `specificWallets: [{ walletBlockchain: 'ETHEREUM', walletPublicKey: 'user-wallet-public-key' }]`

### Get active alerts

- endpoint: `/get-active-alerts`
- method: `POST`
- required headers: `Authorization: Bearer <jwt token>`
- request body:

```json
{
  "fusionEventId": "event-type-id"
}
```

> NOTE:
>
> - `first` and `after` are optional parameters. It allows you to paginate the results.
> - `fusionEventId` is the unique identifier of the topic (alert) you want to get the active alerts for. It is a required parameter, you can get that value from [Notifi Admin Portal](https://admin.notifi.network/): `Alert Manager` -> `Topics` -> scroll to the topic you want to get the active alerts for -> `Event Type ID`

### Active Alert changed event

#### Subscribe to active alert changed event & websocket connection status event

- endpoint: `/subscribe-active-alert-changed-event`
- method: `POST`
- required headers: `Authorization: Bearer <jwt token>`
- request body: `null`

By calling this endpoint, you will subscribe to the active alert changed event along with websocket connection status event. The event payload will be printed on the server console. Feel free to modify the code to handle the event payload as per your requirement.

#### Unsubscribe from active alert changed event

- endpoint: `/unsubscribe-active-alert-changed-event`
- method: `POST`
- required headers: `Authorization: Bearer <jwt token>`
- request body: `null`

By calling this endpoint, you will unsubscribe from the active alert changed event if you have subscribed to it.

### Demo video

<video width="600" controls> <source src="https://i.imgur.com/5UAsUcY.mp4" type="video/mp4"> Your browser does not support the video tag. </video>
