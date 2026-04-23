# Payload Patterns

Use this reference when constructing or reviewing `variablesJson`.

## Core Rule

`variablesJson` is passed into the Notifi template engine and is typically exposed inside templates as `eventData`.

That means:

- `{{eventData.amount}}` maps to payload key `amount`
- `{{eventData.token}}` maps to payload key `token`
- `{{eventData.wallet.address}}` maps to nested payload `{ "wallet": { "address": ... } }`

## Flat Example

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

## Nested Example

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

## Custom Template Example

Many topics are not Community Manager topics. For those topics, the correct payload may be a custom object such as:

```json
{
  "wallet": "0x1234...",
  "amount": "100000",
  "token": "USDC",
  "txHash": "0xabc..."
}
```

## Wallet Targeting Example

Use `specificWallets` only when the request should be limited to specific wallets.

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

This is wallet-level targeting, not destination-channel routing.

## Ambiguity Rules

If tenant config or event metadata does not clearly describe the expected payload:

1. Do not assume a universal schema.
2. Prefer a conservative payload matching visible template variable names.
3. State which fields are assumptions.
4. Ask the user for sample payloads or event-specific variable requirements when correctness matters.

Do not model `variablesJson` as a deterministic universal function.
