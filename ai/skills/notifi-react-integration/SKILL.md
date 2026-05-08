---
name: notifi-react-integration
description: Use this skill whenever the user wants to integrate `@notifi-network/notifi-react` into a React or Next.js app, wire up `NotifiContextProvider`, add `NotifiCardModal`, build custom notification settings UI with Notifi React context hooks, configure on-chain or off-chain auth, pass dynamic topic `inputs`, integrate `NotifiSmartLink`, or troubleshoot a Notifi React frontend integration. Also use this when the user mentions Notifi card setup, tenant/card wiring, wallet auth, wallet target plugin, SmartLink, or custom notification preferences in a frontend app.
---

# Notifi React Integration

Use this skill for app-side frontend integration of `@notifi-network/notifi-react`.

This skill is for wiring Notifi into a user's React or Next.js application. It is not for tenant-side publishing, MCP operations, or admin-side notification workflows.

The main job of this skill is to help the agent decide:

- whether the user should use `NotifiCardModal`, custom context integration, or `NotifiSmartLink`
- which auth mode the integration needs
- which params are required before writing code
- how to make the smallest correct change inside the user's existing app structure

## Scope Boundary

Use this skill for:

- embedding `NotifiCardModal`
- wiring `NotifiContextProvider`
- building custom notification settings UI with Notifi React hooks
- handling Notifi React auth setup
- passing topic `inputs` for dynamic subscriptions
- integrating SmartLink UI
- troubleshooting notifi-react integration issues in frontend apps

Do not use this skill for:

- tenant-side publish workflows
- MCP tool usage
- direct Dataplane or GraphQL notification publishing
- admin portal operations

For those cases, prefer `notifi-tenant-operation` instead.

## Start With The Smallest Correct Path

Default to the smallest correct integration instead of introducing a full custom implementation.

Decision order:

1. If the user wants the fastest usable Notifi UI, prefer `NotifiCardModal`.
2. If the user wants a custom preferences UI or wants to compose their own notification flows, use custom context integration.
3. If the user is building a SmartLink or action-centric surface, use `NotifiSmartLink`.

Do not push a custom integration when `NotifiCardModal` is enough.

## Required Inputs

Before implementing, confirm the minimum required integration inputs.

Core params:

- `tenantId`
- `cardId`
- `env`

Auth params depend on mode.

### On-chain auth

Required:

- `walletBlockchain`
- `walletPublicKey`
- `signMessage`

Sometimes also needed:

- `accountAddress`

Be careful: the correct value for `walletPublicKey` is chain and wallet dependent. Do not assume every wallet uses the same address encoding or key format.

### Off-chain auth

Required:

- `walletBlockchain: 'OFF_CHAIN'`
- `userAccount`
- `signIn`

`userAccount` should be a stable user identifier. Do not invent one if the app's auth model is unclear.

### Optional but common

- `inputs`
- `notificationCountPerPage`
- `toggleTargetAvailability`
- `isEnabledLoginViaTransaction`
- SmartLink `authParams`

If `tenantId`, `cardId`, or the auth callback is missing, ask the user before writing a fake placeholder implementation unless the user explicitly asked for a scaffold.

## Auth Branching

Pick the auth path early because it changes the provider contract.

### Use on-chain auth when

- the app already has a connected wallet
- the user wants wallet-based login
- the project already has wallet adapters or wallet providers in place

Implementation guidance:

- adapt the existing wallet library's signing API to Notifi's `signMessage` shape
- reuse the app's current wallet connection state instead of introducing a new wallet stack
- map the correct wallet key or address format for that blockchain

### Use off-chain auth when

- the app authenticates users through OIDC, JWT, email login, or another non-wallet identity
- the user explicitly says the app is not using wallet login

Implementation guidance:

- provide `walletBlockchain='OFF_CHAIN'`
- derive `userAccount` from an existing stable user identifier
- implement `signIn` using the app's current auth token flow

### Special auth cases

Only introduce these when the user's app actually needs them:

- transaction login
- Solana hardware wallet login
- wallet target plugin

Do not surface these as standard setup unless the app context makes them relevant.

## Minimal Integration Path

When the user wants a quick embed, prefer this path.

1. Add `NotifiContextProvider` near the existing wallet or auth boundary.
2. Pass the minimum required provider props.
3. Render `NotifiCardModal` in the relevant page or modal surface.
4. Import the package CSS when using packaged components.

Use this path for requests like:

- "add Notifi to my app"
- "I just need the card working"
- "help me mount the subscription modal"

Implementation guidance:

- fit the provider into the user's current app tree instead of creating an isolated demo wrapper unless necessary
- keep the initial version small and working
- use the existing router, layout, modal, and wallet hooks already present in the project

## Custom Context Integration Path

Use this when the user wants their own UI instead of `NotifiCardModal`.

The important thing is not just listing hooks. Explain the responsibility of each context and wire only the ones needed by the requested UI.

### `useNotifiFrontendClientContext`

Use for:

- login and logout
- auth status
- frontend client initialization state
- login-via-transaction or hardware-wallet related flows

This is the root integration surface for auth-aware UI.

### `useNotifiTenantConfigContext`

Use for:

- card config
- topic discovery for the current card
- `fusionEventTopics`
- topic metadata lookup
- dynamic `inputs`

This is the right place to reason about what topics exist and what topic input choices the UI should expose.

### `useNotifiTargetContext`

Use for:

- destination target inputs and toggles
- saving target changes
- verification-related UI
- target availability state

This context powers email, phone, Telegram, Discord, Slack, and optional wallet destination management.

### `useNotifiTopicContext`

Use for:

- subscribe and unsubscribe flows
- checking whether a topic is already subscribed
- handling filter options
- stackable topic alert state

This is the correct place for subscription operations. Do not reimplement topic subscription logic outside the context unless the user has a concrete reason.

### `useNotifiHistoryContext`

Use for:

- inbox or notification history views
- unread count
- pagination
- mark-as-read actions

### `useNotifiUserSettingContext`

Use for:

- FTU stage management
- flows that need to follow or customize the first-time-user lifecycle

## Dynamic Topic Inputs

`inputs` are easy to misuse. Treat them as topic-driven configuration, not arbitrary props.

Use `inputs` when the card or topic expects user-selectable or app-derived values to construct a subscription value.

Common patterns:

- wallet address input derived from the connected wallet
- a predefined list of assets, farms, or market pairs
- a dynamic list passed from the host app's domain data

Guidance:

- make sure the keys match what the tenant config expects
- make sure values follow the expected `InputObject[]`-style shape when required
- if topic subscription resolution fails, check `inputs` shape before assuming the SDK is broken

Do not invent topic input keys when the tenant metadata is unclear. Ask the user or inspect existing app usage.

## SmartLink Path

Use SmartLink only when the user is working on SmartLink-specific UI or actions.

Typical setup:

1. Add `NotifiSmartLinkContextProvider`
2. Pass `env`
3. Pass optional `authParams` if the SmartLink flow needs authenticated user context
4. Render `NotifiSmartLink`
5. Implement the `actionHandler`

Use this when the user explicitly mentions:

- SmartLink
- action execution from a Notifi landing flow
- rendering SmartLink content in-app

Do not replace a normal card integration with SmartLink unless the user is clearly asking for SmartLink behavior.

## Plugin And Special Cases

### Wallet target plugin

Only bring in the wallet target plugin when the app needs wallet destinations and the current integration supports that target path.

Important rule:

- do not enable wallet target by default just because it exists

If the user needs wallet target behavior, mention that the wallet-target-enabled provider path differs from the base `NotifiContextProvider` path.

### Solana hardware wallet login

Mention this only for Solana hardware-wallet contexts.

This is not a normal path for general React integration. Use it only when the user's app already operates in that environment.

### Transaction login

Use transaction login only when the user wants login to piggyback on transaction signing.

Do not introduce it as part of a normal MVP integration.

## Troubleshooting Priorities

When the user reports a bug, check these in order.

1. Is the relevant provider present in the render tree?
2. Are `tenantId`, `cardId`, and `env` correct and available at runtime?
3. Is the auth mode correct for the app: on-chain vs off-chain?
4. Are `walletPublicKey`, `accountAddress`, `userAccount`, and signing callbacks mapped correctly?
5. If topics fail, is `inputs` shaped correctly?
6. If custom UI is used, is the correct context hook being used for that responsibility?
7. If packaged UI is used, was the package CSS imported?
8. If wallet target behavior is expected, is the plugin path actually enabled?

Avoid jumping straight to speculative SDK bugs before checking integration wiring.

## Output Expectations

When writing code with this skill:

- prefer the smallest correct integration
- preserve the user's existing framework structure and app conventions
- ask for missing runtime values when correctness depends on them
- avoid fabricating tenant or card identifiers
- avoid demo-only wrappers unless the user asked for a demo or example page
- explain any chain-specific or wallet-specific mapping assumptions

If the request is implementation-oriented, produce code changes, not just advice.

## Good Default Workflow

1. Identify whether the user needs `NotifiCardModal`, custom contexts, or SmartLink.
2. Identify auth mode.
3. Confirm required runtime params.
4. Place the provider at the smallest sensible boundary.
5. Wire the requested UI.
6. Add `inputs` only when the selected topics need them.
7. Verify the integration path matches the app's existing wallet or auth stack.

## Repo References

Use these repo locations as first-party guidance when available:

- `packages/notifi-react/README.md`
- `packages/notifi-react/lib/context/NotifiContextProvider.tsx`
- `packages/notifi-react/lib/context/NotifiFrontendClientContext.tsx`
- `packages/notifi-react/lib/context/NotifiTenantConfigContext.tsx`
- `packages/notifi-react/lib/context/NotifiTargetContext.tsx`
- `packages/notifi-react/lib/context/NotifiTopicContext.tsx`
- `packages/notifi-react/lib/context/NotifiHistoryContext.tsx`
- `packages/notifi-react/lib/context/NotifiSmartLinkContext.tsx`
- `packages/notifi-react/lib/components/NotifiCardModal.tsx`
- `packages/notifi-react/lib/components/NotifiSmartLink.tsx`
- `packages/notifi-react-example-v2/src/context/NotifiContextWrapper.tsx`
- `packages/notifi-dapp-example/src/context/NotifiContextWrapper.tsx`

Use them to stay aligned with the SDK's real provider contracts and the project's supported integration patterns.
