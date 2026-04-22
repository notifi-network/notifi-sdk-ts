# Notifi API Skill

Use this skill when you need to interact with Notifi directly through GraphQL and Dataplane APIs without relying on MCP tools.

This skill is optimized for AI agents that need to:

- authenticate with Notifi using service credentials
- discover tenant config and available fusion events
- inspect active alert subscribers for a fusion event
- publish fusion messages through the Dataplane API

## Environment Endpoints

Choose the environment that matches the tenant credentials you were given.

### Production

- GraphQL: `https://api.notifi.network/gql`
- Dataplane: `https://dpapi.prd.notifi.network`

### Staging

- GraphQL: `https://api.stg.notifi.network/gql`
- Dataplane: `https://dpapi.stg.notifi.network`

### Development

- GraphQL: `https://api.dev.notifi.network/gql`
- Dataplane: `https://dpapi.dev.notifi.network`

### Local

- GraphQL: `https://localhost:5001/gql`
- Dataplane: `http://localhost:5005`

## Authentication

Notifi service-to-service authentication uses:

- `sid`
- `secret`

First call the GraphQL `logInFromService` mutation to get a JWT.

### GraphQL mutation

```graphql
mutation logInFromService($input: ServiceLogInInput!) {
  logInFromService(serviceLogInInput: $input) {
    token
    expiry
  }
}
```

### GraphQL variables

```json
{
  "input": {
    "sid": "<NOTIFI_SID>",
    "secret": "<NOTIFI_SECRET>"
  }
}
```

Use the returned JWT as a Bearer token in subsequent GraphQL or Dataplane calls.

### Authorization header

```http
Authorization: Bearer <JWT>
```

If a request fails with an auth-related error such as `unauthorized`, `forbidden`, `jwt`, `token`, or `authentication`, log in again and retry the request once.

## Recommended Agent Workflow

When the payload shape is not already known, use this order:

1. Authenticate with `logInFromService`.
2. Query `findTenantConfig` for the relevant tenant config.
3. Inspect `fusionEvents`, `metadata`, and `dataJson` for topic or template hints.
4. Infer the expected payload shape for the target event.
5. Publish with Dataplane `POST /FusionIngest/`.
6. Optionally inspect recipients or subscriptions with `getActiveAlerts`.

Do not start by assuming a fixed `variablesJson` shape.

## Core API Reference

### 1. `logInFromService`

Use this to obtain a JWT from service credentials.

Endpoint:

- `POST <GRAPHQL_URL>`

Mutation:

```graphql
mutation logInFromService($input: ServiceLogInInput!) {
  logInFromService(serviceLogInInput: $input) {
    token
    expiry
  }
}
```

Expected result:

- `token`: JWT used for authenticated requests
- `expiry`: token expiration timestamp

### 2. `findTenantConfig`

Use this to fetch tenant config and discover available fusion events.

Endpoint:

- `POST <GRAPHQL_URL>`

Query:

```graphql
query findTenantConfig($input: FindTenantConfigInput!) {
  findTenantConfig(findTenantConfigInput: $input) {
    id
    type
    dataJson
    fusionEvents {
      id
      name
      metadata
    }
  }
}
```

Example variables:

```json
{
  "input": {
    "id": "<TENANT_CONFIG_ID>",
    "tenant": "<TENANT_SLUG>",
    "type": "SUBSCRIPTION_CARD"
  }
}
```

Use this result to:

- identify the correct `fusionEventId` / event type
- inspect `metadata` for payload hints
- inspect `dataJson` for topic or template context

### 3. `getActiveAlerts`

Use this to inspect active alert subscriptions for a fusion event.

Endpoint:

- `POST <GRAPHQL_URL>`

Query:

```graphql
query getActiveAlerts($first: Int, $after: String, $fusionEventId: String!) {
  activeAlerts(
    after: $after
    first: $first
    activeAlertsInput: { fusionEventId: $fusionEventId }
  ) {
    nodes {
      id
      filterOptionsJson
      fusionEventId
      subscriptionValue
      user {
        id
        connectedWallets {
          address
          walletBlockchain
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

Example variables:

```json
{
  "fusionEventId": "<FUSION_EVENT_ID>",
  "first": 20,
  "after": null
}
```

Use this when you need to:

- inspect who is actively subscribed
- understand connected wallet coverage
- paginate through alert subscribers

### 4. Dataplane `FusionIngest`

Use this to publish a fusion message directly.

Endpoint:

- `POST <DPAPI_URL>/FusionIngest/`

Headers:

```http
Authorization: Bearer <JWT>
Content-Type: application/json
```

Request body shape:

```json
{
  "data": [
    {
      "eventTypeId": "<EVENT_TYPE_ID>",
      "variablesJson": {
        "amount": "500",
        "token": "USDC"
      },
      "specificWallets": [
        {
          "walletPublicKey": "0x1234...",
          "walletBlockchain": "ETHEREUM"
        }
      ]
    }
  ]
}
```

Typical success shape:

```json
{
  "indexToResultIdMap": {
    "0": "<RESULT_ID>"
  }
}
```

## Template Variable Mapping

This is the most important rule for `variablesJson`.

`variablesJson` is passed into the Notifi template engine and is typically exposed inside templates as `eventData`.

That means:

- template placeholder `{{eventData.amount}}` maps to payload key `amount`
- template placeholder `{{eventData.token}}` maps to payload key `token`
- template placeholder `{{eventData.wallet.address}}` maps to nested payload `{ "wallet": { "address": ... } }`

### Example 1

Template:

```handlebars
You received
{{eventData.amount}}
{{eventData.token}}
from
{{eventData.fromAddress}}.
```

Payload:

```json
{
  "amount": "500",
  "token": "USDC",
  "fromAddress": "0x123..."
}
```

### Example 2

Template:

```handlebars
Wallet:
{{eventData.wallet.address}}
Explorer:
{{eventData.links.explorer}}
```

Payload:

```json
{
  "wallet": {
    "address": "0x123..."
  },
  "links": {
    "explorer": "https://etherscan.io/tx/..."
  }
}
```

`publish_fusion_message.variablesJson` should be treated as a template-defined contract, not a platform-defined contract.

## Community Manager Clarification

`CommunityManagerVariablesJsonPayload` is a common example for some topics, but it is not the default or universal payload format.

It is specific to Community Manager-style topics where different destination types may use a structure like:

```json
{
  "Platform": {
    "subject": "Alert",
    "message": "Something happened."
  },
  "Email": {
    "subject": "Alert",
    "message__markdown": "**Something happened.**"
  }
}
```

Do not assume all topics use:

- `Platform`
- `Email`
- `Discord`
- `Telegram`
- `Sms`

For many topics, the correct payload may instead be a custom object such as:

```json
{
  "wallet": "0x123...",
  "amount": "100000",
  "token": "USDC",
  "txHash": "0xabc..."
}
```

## Delivery Target Clarification

`variablesJson` is template data passed into the Notifi rendering engine. It is not a universal delivery-routing control.

For most topics, delivery targets are determined by:

- topic configuration
- destination template availability
- subscriber target setup

Only some topic types expose destination-specific payload conventions such as Community Manager-style structures.

If you need to restrict delivery to a specific set of wallets, use `specificWallets` in the Dataplane request. That is wallet-level targeting, not destination-channel routing.

## Payload Examples

### Community Manager basic

```json
{
  "Platform": {
    "subject": "Alert",
    "message": "Something happened."
  }
}
```

### Community Manager markdown

```json
{
  "Platform": {
    "subject": "Large transfer detected",
    "message__markdown": "**Alert:** transfer exceeds threshold."
  }
}
```

### Community Manager multi-destination

```json
{
  "Platform": {
    "subject": "Alert",
    "message": "Something happened."
  },
  "Email": {
    "subject": "Alert",
    "message__markdown": "**Something happened.**"
  },
  "Telegram": {
    "message": "Something happened."
  }
}
```

### Custom template example

```json
{
  "wallet": "0x1234...",
  "amount": "100000",
  "token": "USDC",
  "txHash": "0xabc..."
}
```

### Targeted wallet example

```json
{
  "data": [
    {
      "eventTypeId": "<EVENT_TYPE_ID>",
      "variablesJson": {
        "wallet": "0x1234...",
        "amount": "100000",
        "token": "USDC"
      },
      "specificWallets": [
        {
          "walletPublicKey": "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
          "walletBlockchain": "ETHEREUM"
        }
      ]
    }
  ]
}
```

## Failure and Ambiguity Guidance

If tenant config or fusion event metadata does not clearly describe the expected template variables:

1. Do not assume the Community Manager structure is correct.
2. State that the payload shape is being inferred from limited context.
3. Prefer a conservative payload that matches visible template placeholder names.
4. Ask the user for a sample payload, template placeholder list, or event-specific variable documentation if correctness matters.

When in doubt, explicitly explain which payload keys are assumptions and why.

## Optional MCP Shortcut

If the agent has access to `@notifi-network/notifi-mcp`, the same workflows can also be done through MCP tools. However, this skill is intended to work even when MCP is not installed or available.
