---
name: notifi-react-integration
description: Use this skill whenever the user wants to integrate `@notifi-network/notifi-react` into a React or Next.js app, generate a full-page Notifi app from the Notifi dapp example baseline, wire up `NotifiContextProvider`, add `NotifiCardModal`, build custom notification settings UI with Notifi React context hooks, configure on-chain or off-chain auth, pass dynamic topic `inputs`, integrate `NotifiSmartLink`, or troubleshoot a Notifi React frontend integration. Also use this when the user mentions Notifi card setup, tenant/card wiring, wallet auth, wallet target plugin, SmartLink, full-page app generation, starter app setup, or custom notification preferences in a frontend app.
---

# Notifi React Integration

Use this skill for app-side frontend integration of `@notifi-network/notifi-react`.

This skill is for wiring Notifi into a user's React or Next.js application. It is not for tenant-side publishing, MCP operations, or admin-side notification workflows.

The main job of this skill is to help the agent decide:

- whether the user wants in-place integration or a full-page app generated from the Notifi dapp example baseline
- whether the user should use `NotifiCardModal`, custom context integration, or `NotifiSmartLink`
- which auth mode the integration needs
- which params are required before writing code
- how to make the smallest correct change inside the user's existing app structure

## Scope Boundary

Use this skill for:

- generating a full-page app from the Notifi dapp example baseline when the user explicitly wants a starter app or standalone example app
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

## Full-Page App From Notifi Dapp Example

Use this path when the user wants a full-page app, starter app, standalone example app, or wants the agent to start from Notifi's example app instead of integrating into an existing codebase.

Required behavior:

- use the GitHub `notifi-sdk-ts` repo's `packages/notifi-dapp-example` as the baseline
- prepare or pull a separate working copy of the example app before editing
- modify only the pulled working copy, not the SDK source tree in place
- MUST ask for `tenantId` and `cardId` before writing any code. If `tenantId` or `cardId` is missing, the agent MUST NOT generate files, install dependencies, or configure providers until the user provides them.
- default `env` to Production when the user does not specify a different environment
- MUST ask the user to choose a supported chain group from the `notifi-wallet-provider` support model: `evm`, `solana`, `cosmos`, or `cardano`. Do not assume or default a chain group.
- after the user selects a chain group, the agent MUST ask which wallets from the supported list to include. The agent MUST NOT ask about wallets before the chain group is confirmed.
- use `packages/notifi-wallet-provider/lib/utils/walletConfigs.ts` as the canonical source for the chain-group and wallet mapping
- treat this as an app-generation path first, resolve the runtime questions for this path, and only then choose the appropriate integration surface inside that app (`NotifiCardModal`, custom contexts, or `NotifiSmartLink`)

Do not treat this path as the default when the user already has an existing app and only needs Notifi integrated into it.

## Start With The Smallest Correct Path

If the user wants a full-page app or starter app, use the dedicated dapp-example path first.

Otherwise, default to the smallest correct integration instead of introducing a full custom implementation.

For existing-app integration, use this decision order:

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

If any core param is missing, the agent MUST NOT proceed with implementation. Do not silently default any core param except `env` (which defaults to Production when unspecified).

Auth params depend on mode.

### On-chain auth

Required:

- `walletBlockchain`
- `walletPublicKey`
- `signMessage`

Sometimes also needed:

- `accountAddress`

Be careful: the correct value for `walletPublicKey` is chain and wallet dependent. Do not assume every wallet uses the same address encoding or key format.

For on-chain auth, the agent MUST confirm `walletBlockchain` before collecting `walletPublicKey` and `signMessage`. Do not assume the blockchain based on the wallet type alone.

### Off-chain auth

Required:

- `walletBlockchain: 'OFF_CHAIN'`
- `userAccount`
- `signIn`

`userAccount` should be a stable user identifier. Do not invent one if the app's auth model is unclear.

For off-chain auth, the agent MUST confirm `userAccount` with the user. Do not invent a user identifier from incomplete information.

### Optional but common

- `inputs`
- `notificationCountPerPage`
- `toggleTargetAvailability`
- `isEnabledLoginViaTransaction`
- SmartLink `authParams`

If `tenantId`, `cardId`, `env`, or the auth callback is missing: the agent MUST ask the user before writing any implementation code. The sole exception is when the user explicitly requests a scaffold or placeholder setup. In that case, use explicit TODO markers with instructions for finding the real value. Do not silently hardcode plausible-looking values under any circumstances.

For the full-page dapp-example path, ask for missing `tenantId` and `cardId` before implementation. If the user does not specify `env`, default it to Production. Do not silently hardcode plausible-looking tenant or card values, and do not treat this path as a placeholder-only scaffold unless the user explicitly asks for one.

For the full-page dapp-example path, do not ask the user to choose from every Notifi blockchain enum. Ask them to choose from the chain groups supported by `notifi-wallet-provider` first.

Current supported chain groups for this path:

- `evm`
- `solana`
- `cosmos`
- `cardano`

Wallet follow-up rules:

- after the user chooses `evm`, ask which of these wallets to support: `metamask`, `coinbase`, `rabby`, `walletconnect`, `okx`, `rainbow`, `zerion`, `binance`
- after the user chooses `solana`, ask whether to support `phantom`
- after the user chooses `cosmos`, ask whether to support `keplr`
- after the user chooses `cardano`, ask which of these wallets to support: `lace`, `eternl`, `nufi`, `okx-cardano`, `yoroi`, `ctrl`
- the agent MUST NOT ask about wallets before the chain group is selected by the user. This is a hard ordering constraint. Violating this order must be treated as a blocking error.
- do not invent unsupported chain-group or wallet pairings
- if the user asks for a chain outside this support model, explain that the dapp-example baseline does not provide a ready-made wallet-provider flow for it and ask whether they want to switch to a supported chain group or pursue a custom adapter path

## Clarification Gate

Before writing any code, installing any dependency, or creating any file, the agent MUST ensure all required inputs for the chosen path are confirmed with the user.

### Hard-stop conditions (MUST NOT proceed):

- `tenantId` not confirmed
- `cardId` not confirmed
- auth mode not determined
- for on-chain: `walletBlockchain` not confirmed
- for off-chain: `userAccount` not confirmed
- for full-page path: chain group not chosen before wallets
- integration path not confirmed

### Exception:

If the user explicitly requests a scaffold (e.g., "just write the provider wiring, I'll add values later"), use TODO placeholders and skip the hard-stop.

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

## NotifiCardModal Entry Placement

When the user wants `NotifiCardModal`, do not only think about provider wiring. Also choose a natural entry surface.

Preferred heuristic:

1. If the app already has a top nav or header utility area, prefer using that area for the modal entry.
2. Prefer a small icon CTA over adding a large new section or standalone demo block.
3. Keep the entry close to existing wallet, account, settings, or other utility actions when possible.
4. Preserve the app's current header structure, spacing, and interaction style.

If there is no clear top nav or header utility surface, fall back to the nearest existing action area instead of inventing a new layout pattern.

## CTA Placement Ambiguity Handling

If the app structure suggests more than one reasonable entry location, do not guess too aggressively.

Guidance:

- if the current UI clearly implies a best placement, proceed with the smallest natural integration
- if there are multiple plausible locations, ask the user which entry surface they prefer
- offer a few concrete options instead of asking an open-ended design question
- if the user has no preference, state the default choice and proceed with the smallest reasonable option

Good question pattern:

- "I found an existing header/top nav. Do you want the Notifi entry as a header utility icon, an icon near wallet/account actions, a profile menu item, or a temporary minimal button while placement is still undecided?"

Do not invent a brand new navigation pattern when existing app structure already provides a natural entry surface.

## Modal Reopen And Readiness

If the host app mounts `NotifiCardModal` inside its own dialog, popover, drawer, or other CTA-triggered shell, do not assume reopen behavior will work automatically.

Guidance:

- reuse the app's existing modal shell when it is already the natural integration surface
- prefer remounting the Notifi subtree on each open instead of keeping it mounted forever behind an `open` flag
- if reopen shows an empty modal or inconsistent state, gate the inner `NotifiCardModal` render on Notifi context readiness rather than immediately rendering it
- use `useNotifiFrontendClientContext` and `useNotifiUserSettingContext` to wait for initialization and authenticated user-setting loading when needed
- keep this workaround in the host app wrapper layer; do not rewrite the packaged card UI unless there is a stronger product reason

Common failure mode:

- first open works, but reopening after close shows an empty `.notifi-card-modal` container because the host wrapper remount timing does not align with Notifi context readiness

Preferred host-app workaround:

- remount the wrapper on each open
- if the user is already authenticated, wait until the frontend client is initialized and user-setting loading is complete before rendering `NotifiCardModal`

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
- when the user wants a full-page app or starter app, work in a pulled copy of `packages/notifi-dapp-example` rather than editing the SDK repo's source package in place
- explain any chain-specific or wallet-specific mapping assumptions

If the request is implementation-oriented, produce code changes, not just advice.

## Good Default Workflow

1. Identify whether the user wants in-place integration or a full-page app from the Notifi dapp example baseline.
2. If the user wants the full-page app path, prepare a pulled working copy first, confirm `tenantId` and `cardId`, and default `env` to Production unless the user explicitly asks for a different environment.
3. For the full-page app path, ask the user to choose a supported chain group from the `notifi-wallet-provider` support model.
4. After the chain group is selected, ask which supported wallets in that group should be included.
5. Identify whether the user needs `NotifiCardModal`, custom contexts, or SmartLink.
6. Identify auth mode.
7. Confirm required runtime params.
8. Place the provider at the smallest sensible boundary.
9. Wire the requested UI.
10. Add `inputs` only when the selected topics need them.
11. Verify the integration path matches the app's existing wallet or auth stack.

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
- `packages/notifi-dapp-example/README.md`
- `packages/notifi-dapp-example/src/context/NotifiContextWrapper.tsx`
- `packages/notifi-wallet-provider/lib/utils/walletConfigs.ts`

Use them to stay aligned with the SDK's real provider contracts and the project's supported integration patterns.
