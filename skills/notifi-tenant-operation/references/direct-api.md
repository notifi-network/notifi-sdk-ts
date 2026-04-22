# Direct API Reference

Use this reference only when MCP is unavailable or the user explicitly wants direct API calls.

## Environment Endpoints

Choose the environment that matches the tenant credentials.

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

Use service credentials:

- `sid`
- `secret`

Get a JWT first.

```graphql
mutation logInFromService($input: ServiceLogInInput!) {
  logInFromService(serviceLogInInput: $input) {
    token
    expiry
  }
}
```

Example variables:

```json
{
  "input": {
    "sid": "<NOTIFI_SID>",
    "secret": "<NOTIFI_SECRET>"
  }
}
```

Use the returned JWT as:

```http
Authorization: Bearer <JWT>
```

If a request fails with auth-related errors such as `unauthorized`, `forbidden`, `jwt`, `token`, or `authentication`, log in again and retry once.

## `findTenantConfig`

Use this to discover tenant config and available fusion events.

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

Use the result to:

- identify the correct event
- inspect metadata for payload hints
- inspect `dataJson` for card or topic context

## `getActiveAlerts`

Use this to inspect active subscribers for a fusion event.

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

## Dataplane `FusionIngest`

Use this to publish a fusion message directly.

Endpoint:

- `POST <DPAPI_URL>/FusionIngest/`

Headers:

```http
Authorization: Bearer <JWT>
Content-Type: application/json
```

Request shape:

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

Typical success response:

```json
{
  "indexToResultIdMap": {
    "0": "<RESULT_ID>"
  }
}
```
