# `notifi-node-sample`

> express.js sample showing usage of `@notifi-network/notifi-node`

## Prerequisites

- Clone root repository and install dependencies

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

- Install dependencies

```bash
cd packages/notifi-node-sample
npm install
```

- Config environment variables

```bash
export NOTIFI_ENV="Production-or-Development" && \
 NOTIFI_SECRET="your-tenent-secret" && \
 NOTIFI_SID="your-sid" && \
 PORT="custom-port(optional)"
```

> You can register your own tenant account and get the sid and secret from [Notifi Admin Portal](https://admin.notifi.network/)

- Start the example express server listening on the port specified in the environment variables (default 8080 if not specified)

```bash
npx lerna --scope=@notifi-network/notifi-node-sample run dev
```

## Usage

### login and get a Authorization(Bearer) jwt token.

- endpoint: `/login`
- method: `POST`
- requeest body:

```json
{
  "sid": "NPOFGOF0Z3P0NLVPXDVA111PVYV16KIG",
  "secret": "vV$)RuHwJ6D3&7@w$y2-U6?oE4%VzVYpnCVPp9gGtKp~NBe^PB99SsDZR2naU+2>",
  "env": "Production"
}
```

Then we can get a response with a jwt token by which we can access other endpoints.

```json
{
  "token": "jwt-token",
  "expiry": "token-expiry-time"
}
```

### Send a directPush message using http post.

- endpoint: `/sendDirectPush`
- method: `POST`

- request body:

**Case#1**: Only define message

```json
{
  "walletBlockchain": "SOLANA", // Or ETHEREUM, BINANCE, POLYGON ... etc
  "walletPublicKey": "the-wallet-address-to-receive-the-notification",
  "message": "message-content",
  "type": "directPushId" // ex. erictestnotifi__directpush
}
```

**Case#2**: Specify custom variables

```json
{
  "walletBlockchain": "SOLANA", // Or ETHEREUM, BINANCE, POLYGON ... etc
  "walletPublicKey": "the-wallet-address-to-receive-the-notification",
  "type": "directPushId", // ex. erictestnotifi__directpush
  "template": {
    "variables": {
      "message": "The message content",
      "subject": "The subject",
      "title": "custom title directPush"
    }
  }
}
```

If the request is successful, we can get a response body like this:

```json
{
  "message": "success"
}
```

- Demo video: https://github.com/notifi-network/notifi-sdk-ts/assets/127958634/ba25c59b-2c82-4ee2-8c63-ad43fd85ae31

### Send a fusion Broadcast Message (AP v2) using http post.

- endpoint: `/publishFusionMessage`
- method: `POST`

- request body:

```json
{
  "variables": [
    {
      "eventTypeId": "71cc71b9c5de4a838e8c8bf46d25fb2c",
      "variablesJson": {
        "Platform": {
          "message__markdown": "[link text](https://bots.ondiscord.xyz)",
          "message": "gets overriden by message__markdown",
          "subject": "dpush test"
        },
        "Email": {
          "message": "gets overriden by message__markdown",
          "message__markdown": "[link text](https://bots.ondiscord.xyz)",
          "subject": "dpush test"
        }
      }
    }
  ]
}
```

If the request is successful, we can get a response body like this:

```json
{
  "result": {
    "indexToResultIdMap": {
      "0": "c1665c4b-5389-400e-b026-bd93471a0d00"
    }
  }
}
```

- Demo video: https://github.com/notifi-network/notifi-sdk-ts/pull/454
