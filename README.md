<div id="top"></div>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/notifi-network/notifi-sdk-ts">
    <img src="images/logo.jpg" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Notifi SDK</h3>

  <p align="center">
    Typescript-based SDK that empowers developers with robust web3 communication infrastructure.
    <br />
    <a href="https://github.com/notifi-network/notifi-sdk-ts/tree/main/packages">Our packages</a>
    <br />
    <br />
    <a href="https://github.com/notifi-network/notifi-sdk-ts/issues">Report bug or request a Feature</a>
    <br />
    <span>For any other questions, please <a href="https://discord.gg/nAqR3mk3rv"><strong>join our Discord</strong></a></span>
  </p>
</div>

<!-- ABOUT THE PROJECT -->

# Notifi SDK

&nbsp;

## 🧑‍💻 What is the Notifi SDK

Notifi provides notification infrastructure for web3 services and dApps to communicate with their end users on Solana, Ethereum, Aptos, Acala, Binance, Arbitrum, and Near.

The Notifi SDK enables easy integration, customizable experiences, and advanced features for dApps and Web3 applications across different tech frameworks. The SDK allows developers to easily deploy messaging features without having to build their own communication infrastructure.

Most notably, we offer:

- A drop-in (React) component
- Simple APIs for integration for frontend frameworks outside of React, and backend frameworks

Currently, developers can utilize the SDK to allow their dapp users to sign up for blockchain event alerts that are sent via Telegram, email, or SMS.

&nbsp;

## 🛠 How to Get Started

Fill out [this form](https://bit.ly/NotifiDappSetup) to receive a developer login.

With a developer login, you can generate an API key and customize component configurations.

&nbsp;

## 📦 Available Packages

**Required for all tech stacks**

`@notifi-network/notifi-core`

**Using React**

Our easy-to-use drop-in component

`@notifi-network/notifi-react-card`

Using direct API integration

`@notifi/notifi-react-hooks`

**Using any other frontend framework, except React**

`@notifi-network/notifi-frontend-client`

**Using Axios (HTTP Requests)**

`@notifi-network/notifi-axios-adapter`

`@notifi-network/notifi-axios-utils`

**Using Node**

`@notifi-networks/notifi-node`

​​❓ Other Helpful Resources
[GraphQL Guide for specific Notifi APIs](https://docs.notifi.network/)

&nbsp;

## 📋 Examples

Code snippets are available in each [package](https://github.com/notifi-network/notifi-sdk-ts/tree/main/packages)

Full examples:

- [React component example](https://github.com/notifi-network/notifi-sdk-ts/tree/main/packages/notifi-react-example)

- Additional React component examples for [Aptos](https://github.com/notifi-network/notifi-aptos-example) and [Near](https://github.com/notifi-network/near-sdk-example)

- [Node example](https://github.com/notifi-network/notifi-sdk-ts/tree/main/packages/notifi-node-sample)

- [Using Svelte](https://github.com/notifi-network/notifi-svelte-sample)

If you are looking for other examples, please request in our #SDK channel under the Developments section in our [Discord](https://discord.gg/nAqR3mk3rv).

&nbsp;

## 🛠 How It Works

### **Direct Push**

Direct push applies to dapps that already manage their own backend and want to utilize Notifi to manage the filtered alerts that their users want to subscribe to. In this approach, dapps will utilize our drop-in component or create their own UI to allow users to subscribe and enter their communication channel information.

The dapp will send a message to the wallet address of the user. The user will sign the wallet message to confirm that they would like to receive notifications.

The dapp will send the wallet address information to Notifi. Notifi will create a user profile and save the user’s communication channel information and requested alerts.

Notifi will send the alert to the user's preferred communication channel information.

### **Monitor and trigger**

Monitor and trigger applies to dapps that want Notifi to monitor and send messages directly.
Dapps will create their own UI to allow users to subscribe and enter their communication channel information.

Notifi will send the alert to user’s preferred communication channel information.

&nbsp;

## 🙋 Want to Learn More

To see the latest updates on supported L1 and messaging channels and to see what’s coming up, check out our website at [notifi.network](https://notifi.network) and join the [Discord Community](https://discord.gg/nAqR3mk3rv).
