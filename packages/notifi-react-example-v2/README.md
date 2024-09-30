# Notifi Card Modal Example

This is a working example of `@notifi-network/notifi-react` package. It aims to demonstrate:

- The usage of Notifi Context
- The usage of `NotifiCardModal` component

> This example is bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Prerequisites

1. ensure the your Node.js 18 or later (with its corresponding npm)

2. set up the `.env.local` file by copying the `.env.local.example` file and fill in the required values

> **NOTE**
>
> - To have the valid `.env.local` file, a Notifi tenant account is required. You can register one for free at [Notifi Admin Portal](https://admin.notifi.network). For more detail, check on the [Notifi Documentation](https://docs.notifi.network/docs/getting-started)
> - Notifi provides two main authentication categories to onboard the user, on-chain ([Check out Notifi supported blockchains](https://graphdoc.io/preview/enum/WalletBlockchain?endpoint=https://api.dev.notifi.network/gql/)) and off-chain (OpenID connection. [Check out Notifi supported OIDC providers](https://graphdoc.io/preview/enum/OidcProvider?endpoint=https://api.dev.notifi.network/gql/)). Registering a Notifi tenant offers the out-of-the-box on-chain login w/o any additional setup. On the other hand, to enable OIDC login, it requires additional setup to integrate your OIDC provider with Notifi tenant using [Notifi Admin Portal](https://admin.notifi.network/) check on the Notifi Documentation **(WIP: coming soon)**

## Getting Started

First, clone `notifi-sdk-ts` mono repository and install the dependencies:

```bash
git clone https://github.com/notifi-network/notifi-sdk-ts.git

npm install

```

Then, start the development server of `@notifi-network/notifi-card-modal-example` using lerna cli tool

```bash
npx lerna --scope=@notifi-network/notifi-card-modal-example run dev
```

🚀 Open [http://localhost:3000](http://localhost:3000) with your browser to get started. 🚀

> - For more detail about the usage & config of `@notifi-network/notifi-react` package, checkout the [documentation](https://github.com/notifi-network/notifi-sdk-ts/tree/main/packages/notifi-react) of `@notifi-network/notifi-react`
> - Ensure the [blockchain network and the wallet setting](https://github.com/notifi-network/notifi-sdk-ts/blob/68b574175abbf49d15df330cc699711cab84159a/packages/notifi-react-example-v2/src/context/NotifiContextWrapper.tsx#L119) are correctly configured on `packages/notifi-card-modal-example/src/context/NotifiContextWrapper.tsx`
> - Feel free to add more preferred wallets by implementing new case in `NtofiContextWrapper.tsx`
