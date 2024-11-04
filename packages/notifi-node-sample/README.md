# `notifi-node-sample`

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
export NOTIFI_ENV="Production-or-Development" && \
 NOTIFI_SECRET="your-tenent-secret" && \
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

### Login to get a Authorization(Bearer) jwt token.

- endpoint: `/login`
- method: `POST`
- required headers: `Authorization: Bearer <jwt-token>`
- request body:

```json
{
  "sid": "NPOFGOF0Z3P0NLVPXDVA111PVYV16KIG",
  "secret": "vV$)RuHwJ6D3&7@w$y2-U6?oE4%VzVYpnCVPp9gGtKp~NBe^PB99SsDZR2naU+2>",
  "env": "Production"
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
> - The `variablesJson` parameter is the set of variables that will be used when rendering your templates. If you have a variable `fromAddress`, for example, you can display it in the template with the expression `{{ eventData.fromAddress }}`
> - `FusionMessage<T>`'s generic type `T` represents the shape `variablesJson` payload. Defaults to `object` for better flexibility. Specify to [CommunityManagerJsonPayload](TBD) if for the notification sent by community manager (Learn more about [Notifi Community Manager](https://docs.notifi.network/docs/getting-started#learn-more-about-community-manager)

### Demo video

<video width="600" controls> <source src="https://i.imgur.com/5UAsUcY.mp4" type="video/mp4"> Your browser does not support the video tag. </video>
