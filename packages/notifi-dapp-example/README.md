# Notifi Dapp Example

This package might benefit those developers who want to integrate Notifi service into their Dapp in the following ways:

1. **Build a DAPP with Notifi service by simply clone this package and modify the code.**
2. **Learn how to use Notifi service.**

## Prerequisites

- **Node.js** (version 18 or higher)
- **npm** (Corresponding version to the Node.js version)

## Getting Started

1. Cone notifi-sdk-ts mono-repo and install the dependencies.

```bash
git clone git@github.com:notifi-network/notifi-sdk-ts.git

npm install
```

2. Build project

```bash
npm run build
```

3. Add environment variables

There is a `.env.local.example` file in the root of the `notifi-dapp-example` package. You need to copy it to `.env.local` and fill in the environment variables.

4. Run the example

There are two ways to run the example:

- with `npx lerna`

```bash

npx lerna --scope=@notifi-network/notifi-dapp-example run dev

```

- with `npm`

```bash

cd packages/notifi-dapp-example

npm run dev

```

5. Open the browser and navigate to `http://localhost:3000` to see the example.

🚀🚀🚀🚀🚀 **Enjoy building with Notifi** 🚀🚀🚀🚀🚀
