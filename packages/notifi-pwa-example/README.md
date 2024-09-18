# Notifi Progressive Web App (PWA) Example

This is an example of a Progressive Web App (PWA) that uses the following Notifi SDK to send push notifications to users.

- [@notifi-network/notifi-wweb-push-service-worker](https://www.npmjs.com/package/@notifi-network/notifi-web-push-service-worker)
- [@notifi-network/notifi-react](https://www.npmjs.com/package/@notifi-network/notifi-react)

## Prerequisites

- Node.js 18 or later (with its corresponding npm)

- set up the `.env.local` file by copying the `.env.local.example` file and fill in the required values

> **NOTE**
>
> - To have the valid `.env.local` file, a Notifi tenant account is required. You can register one for free at [Notifi Admin Portal](https://admin.notifi.network). For more detail, check on the [Notifi Documentation](https://docs.notifi.network/docs/getting-started)

## Getting Started

First, clone `notifi-sdk-ts` mono repository and install the dependencies:

```bash
git clone https://github.com/notifi-network/notifi-sdk-ts.git

npm install

```

Then, start the development server of `@notifi-network/notifi-pwa-example` using lerna cli tool

```bash
npx lerna --scope=@notifi-network/notifi-pwa-example run dev
```

🚀 Open [http://localhost:3000](http://localhost:3000) with your browser to get started. 🚀

> - For more detail about the usage of `@notifi-network/notifi-react` package, checkout the [documentation](WIP) of `@notifi-network/notifi-web-push-service-worker`
