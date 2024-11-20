# Notifi Signature Workbench

A vanilla JavaScript application for testing message signing with various blockchain wallets. We use Vite to bundle the app and run a local development server.

## Supported Blockchains
- Aptos
- Ethereum
- SUI

## Tested Wallets

Below is a list of wallets that have been tested with the LoginWithWeb3 flow:

### Aptos
- Nightly: Works, but doesnt respect the `address` within fullMessage when told to include it.
- OKX: Works, but doesnt respect the expected defaults for the signMessage params, seems to always include everything...
- Bitget: Works, but doesnt respect the expected defaults for the signMessage params, seems to always include everything. Also produces signatures without 0x prefix.
- Petra: Doesnt work with the walllet standard, no injected wallet being found.
- Martian: Doesnt work with the walllet standard, no injected wallet being found.
- Pontem: **DOESNT WORK OUT OF THE BOX, RETURNS the signature response wrapped in a {result: Signature} object. This DOES NOT MATCH THE SPECIFICATION of the Wallet Standard defined by the Aptos Foundation**

### Ethereum
- MetaMask
- Rabby
- Nightly
- Phantom
- OKX
- Bitget

### SUI
- Sui Wallet (Private Key)
- Sui Wallet (Google Authed)
- Suiet
- Nightly
- OKX
- Surf
- Bitget: **DOESNT WORK: PRODUCES SIGNATURES WHICH DO NOT RECOVER SOMEHOW**

> **Note:** This list is maintained manually and may not be exhaustive. Please help keep it updated to assist both product and engineering teams in verifying LoginWithWeb3 compatibility.

## Development Roadmap

### High Priority
- Add Solana support
- Integrate with GraphQL package to verify LoginWithWeb3 flow
- Add Cosmos support (looks like https://docs.cosmostation.io/extension/integration/cosmos/typescript should work)

### Medium Priority
- Add integration tests to SDK CI pipeline
  - Goal: Catch breaking changes early
  - Future consideration: Trigger tests on Notifi core service releases

### Low Priority
- UI bug fixes and improvements

## Running the app
- Ensure that you have NodeJS installed, ideally via NVM so that you can select the expected version via the command `nvm use`
- Run `npm install` to install dependencies
- Run `npm run dev` to start the app
