# @notifi/notifi-react-example

## 🙋🏻‍♀️ Introduction

This example is aim to demonstrate the Dapp integration with notifi SDK (notifi-react-card) across multi supported blockchains.

## Supported blockchains (Wallet)

- EVM compatible chains (WalletConnect): 'ETHEREUM', 'POLYGON', 'ARBITRUM', 'AVALANCHE', 'BINANCE', 'OPTIMISM'
- Solana (Phantom)
- Polkadot (Acala)
- Aptos
- Near
- More supported chains coming soon ...

## 📥 How to get started

1. Clone the notifi-sdk-ts mono-repo

```bash
# By ssh
git clone git@github.com:notifi-network/notifi-sdk-ts.git
# By https
git clone https://github.com/notifi-network/notifi-sdk-ts.git

cd notifi-sdk-ts
```

2. Install dependencies and build

```bash
npm install
npm run build
```

3. Run react app

```bash
npx lerna --scope=@notifi-network/notifi-react-example run start
```

Then the demo dapp will be available on localhost port 3000. Access it through the following url:
`http://localhost:3000`
