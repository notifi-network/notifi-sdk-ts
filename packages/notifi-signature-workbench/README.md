# Notifi Signature Workbench

A vanilla JavaScript application for testing message signing with various blockchain wallets. We use Vite to bundle the app and run a local development server.

## Supported Blockchains
- Aptos
- Ethereum
- SUI

## Tested Wallets

Below is a list of wallets that have been verified with the LoginWithWeb3 flow:

### Aptos
- Nightly
- Petra

### Ethereum
- MetaMask

### SUI
- Sui Wallet

> **Note:** This list is maintained manually and may not be exhaustive. Please help keep it updated to assist both product and engineering teams in verifying LoginWithWeb3 compatibility.

## Development Roadmap

### High Priority
- Add Solana support
- Integrate with GraphQL package to verify LoginWithWeb3 flow

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
