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
    Typescript based SDK for React and NodeJS projects.
    <br />
    <a href="https://notifi-network.github.io/notifi-sdk-ts/"><strong>Explore the docs »</strong></a><br />
    <a href="https://docs.notifi.network/AlertCreateGuide.html"><strong>Alert Creation Overview »</strong></a>
    <br />
    <a href="https://discord.gg/nAqR3mk3rv"><strong>Join our Discord!!</strong></a>
    <br />
    <br />
    ·
    <a href="https://github.com/notifi-network/notifi-sdk-ts/issues">Report Bug</a>
    ·
    <a href="https://github.com/notifi-network/notifi-sdk-ts/issues">Request Feature</a>
    ·
  </p>
</div>



<!-- ABOUT THE PROJECT -->
## Usage Scenarios
<h2>Direct Push</h2>
This type of interaction assumes you have a server already running and want to push a notification to a member of your dapp. In this scenario, we first require the dapp to directly tell Notifi on our Discord SDK channel that they want to leverage our SDK. Notifi will create a tenancy that is owned by the dapp and transfer a SID/Secret pair. For now this is manual, but we will have a self-service admin panel for dapps to use in the future.

For users to sign up for notifications, the dapp will use our React SDK to logInFromDapp and then create/modify notifications. From here, the DApp SVC can send a message to the user's wallet address, where Notifi will take care of any special filtering and routing the user wanted to do. Examples coming soon!


![Direct Push Diagram][scenario-push-diagram]

<h2>Monitor and Trigger</h2>
In this scenario, Notifi can monitor the blockchain and detect important events that users can subscribe to. This is how Notifi implements DAO proposal notifications today. If you have a dapp that you'd like Notifi to monitor, please join our Discord server and tell us about it! We'll be open sourcing our plugins for DAO proposals in the future to help make this more self service. This can seem like a bit of magic, so feel free to ask any questions in our Discord#SDK.

![Monitoring Diagram][scenario-monitor-diagram]

<p align="right">(<a href="#top">back to top</a>)</p>



### Built With ❤️ and ...



* [Next.js](https://nextjs.org/)
* [React.js](https://reactjs.org/)
* [Vue.js](https://vuejs.org/)
* [Lerna.js](https://lerna.js.org/)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started with Direct Push
 - Join our <a href="https://discord.gg/nAqR3mk3rv">Notifi Discord</a>
 - Message our SDK channel for access
 - Install our npm package in your React app
 - Create UI for your users to register for notifications
 - Use our GraphQL API from your service to send messages to Notifi (NodeJS SDK coming soon!)

## Getting Started with Notifi Monitoring
 - Join our <a href="https://discord.gg/nAqR3mk3rv">Notifi Discord</a>
 - Message our SDK channel with your scenario

Note: For Notifi's monitoring scenario, we will be releasing our Notifi Monitoring code in the future so you can simply template and/or extend off of existing patterns


## Steps to deploy canary (for local development of SDK and deploying to npm)
npx lerna exec -- npx rimraf dist

npx lerna exec -- npx rimraf node_modules

npx lerna bootstrap

npx lerna run build

npx lerna publish --canary




<p align="right">(<a href="#top">back to top</a>)</p>




<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/notifi-network/notifi-sdk-ts.svg?style=for-the-badge
[contributors-url]: https://github.com/notifi-network/notifi-sdk-ts/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/notifi-network/notifi-sdk-ts.svg?style=for-the-badge
[forks-url]: https://github.com/notifi-network/notifi-sdk-ts/network/members
[stars-shield]: https://img.shields.io/github/stars/notifi-network/notifi-sdk-ts.svg?style=for-the-badge
[stars-url]: https://github.com/notifi-network/notifi-sdk-ts/stargazers
[issues-shield]: https://img.shields.io/github/issues/notifi-network/notifi-sdk-ts.svg?style=for-the-badge
[issues-url]: https://github.com/notifi-network/notifi-sdk-ts/issues
[license-shield]: https://img.shields.io/github/license/notifi-network/notifi-sdk-ts.svg?style=for-the-badge
[license-url]: https://github.com/notifi-network/notifi-sdk-ts/blob/main/LICENSE.txt
[scenario-push-diagram]: images/push_diagram.svg
[scenario-monitor-diagram]: images/monitor_diagram.svg


## Regenerate docs
npm run docs

<br/>
<br/>

## Advanced
We understand that not all scenarios can be solved with the current state of the SDK. When adding SDK features, we'd like to ensure we're building exactly what developers want. If you need to break out of the SDK features for more advanced interaction with Notifi, please see our <a href="https://docs.notifi.network"><strong>Notifi GraphQL API</strong></a> that you can consume alongside the SDK.