# Notifi Card Modal Example

This is a working example of `@notifi-network/notifi-react` package. It aims to demonstrate:

- The usage of Notifi Context
- The usage of `NotifiCardModal` component

> This example is bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Prerequisites

1. ensure the your Node.js 18 or later (with its corresponding npm)

2. set up the `.env.local` file by copying the `.env.local.example` file and fill in the required values

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

> For more detail about the usage of `@notifi-network/notifi-react` package, checkout the [documentation]() of `@notifi-network/notifi-react`
> Make sure the blockchain network and the wallet setting are correctly configured as per your expectation on `packages/notifi-card-modal-example/src/context/NotifiContextWrapper.tsx`
> Feel free to add more preferred wallets by implementing new case in `NtofiContextWrapper.tsx`

## TODO

- Cypress component test
