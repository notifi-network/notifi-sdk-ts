# @notifi-network/notifi-mcp

Local-first MCP server for Notifi.

This package exposes a small set of MCP tools for AI agents that need to discover Notifi tenant configuration, inspect active alert subscriptions, and publish fusion messages.

Use this package to run a local stdio MCP server from this repo and connect AI agents to Notifi.

## Features

- local-first stdio MCP server
- service-credential authentication with automatic retry on likely auth failures
- `get_tenant_config` for tenant config and fusion event discovery
- `get_active_alerts` for active subscriber inspection
- `publish_fusion_message` for direct fusion message publishing
- companion direct API skill file for agents that do not use MCP

## Getting Started

### 1. Requirements

- Node.js runtime able to run the built `dist/cli.mjs`
- Notifi service credentials:
  - `NOTIFI_SID`
  - `NOTIFI_SECRET`
- Optional environment override:
  - `NOTIFI_ENV=Production|Staging|Development|Local`

### 2. Build the package

Build from the workspace root:

```bash
npm run build --workspace @notifi-network/notifi-mcp
```

Or build from the package directory:

```bash
npm run build
```

The MCP CLI entrypoint is:

```text
packages/notifi-mcp/dist/cli.mjs
```

### 3. Configure environment variables

Create a local `.env` file in `packages/notifi-mcp/` or inject environment variables through your MCP client.

```env
NOTIFI_SID=your-tenant-sid
NOTIFI_SECRET=your-tenant-secret
NOTIFI_ENV=Production
```

`NOTIFI_ENV` defaults to `Production` if omitted.

### 4. Add the local MCP server to your MCP client

Use your local build output instead of an npm package while testing.

Example MCP config:

```json
{
  "mcpServers": {
    "notifi": {
      "command": "node",
      "args": [
        "/absolute/path/to/notifi-sdk-ts/packages/notifi-mcp/dist/cli.mjs"
      ],
      "env": {
        "NOTIFI_SID": "your-tenant-sid",
        "NOTIFI_SECRET": "your-tenant-secret",
        "NOTIFI_ENV": "Production"
      }
    }
  }
}
```

If your MCP client already injects environment variables, you can omit the local `.env` file.

### 5. Verify the server is available

After your MCP client starts the server, verify it exposes these tools:

- `get_tenant_config`
- `get_active_alerts`
- `publish_fusion_message`

## Available Tools

### `get_tenant_config`

Returns a normalized tenant config response:

- `id`
- `type`
- `dataJson`
- `fusionEvents[{ id, name, metadata }]`

Use this first when the agent needs to discover available fusion events or infer the expected payload shape for a topic.

### `get_active_alerts`

Returns a paginated list of active alert subscriptions for a fusion event.

Normalized output includes:

- `alerts[]`
- `pageInfo.hasNextPage`
- `pageInfo.endCursor`

### `publish_fusion_message`

Publishes a fusion message using:

- `eventTypeId`
- `variablesJson`
- optional `targetWallets`
- optional `idempotencyKey`

`variablesJson` is passed through directly to the Notifi template engine.

## Payload Guidance

`variablesJson` should be treated as a template-defined contract, not a platform-defined contract.

Important notes:

- do not assume all topics use the same payload shape
- `CommunityManagerVariablesJsonPayload` is only one topic-specific example
- template placeholders usually map from `variablesJson` through `eventData`
- `variablesJson` is not a universal delivery-routing control
- for most topics, delivery targets are determined by topic configuration, destination template availability, and subscriber target setup

If the correct payload shape is not obvious, call `get_tenant_config` first and inspect `fusionEvents`, `metadata`, and `dataJson` before publishing.

## Tenant Operation Companion Skill

This repo includes a tenant-operation companion skill for agents working with Notifi:

```text
ai/skills/notifi-tenant-operation/
```

Use that skill for:

- MCP-first workflow guidance
- direct GraphQL / Dataplane fallback behavior
- `variablesJson` reasoning and formatting guidance
- Community Manager topic guidance
- ambiguity handling when topic-specific fields are unclear

## Programmatic Usage

This package also supports import usage if you want to embed the MCP server in another Node.js process.

```ts
import { createNotifiMcpServer } from '@notifi-network/notifi-mcp';

const { server, context } = createNotifiMcpServer({
  config: {
    sid: process.env.NOTIFI_SID,
    secret: process.env.NOTIFI_SECRET,
    env: 'Production',
  },
});

// Connect a transport elsewhere in your application.
```

For CLI-style local MCP usage, prefer the built `dist/cli.mjs` entrypoint.

## Development

Build the package:

```bash
npm run build --workspace @notifi-network/notifi-mcp
```
